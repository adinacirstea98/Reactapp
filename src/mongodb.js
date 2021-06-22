const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const express = require('express');
const multer = require('multer')

// Import the library:
const cors = require('cors');

const storageFiles = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storageFiles });
const uploadFiles = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]);

// Init express
const app = express();

const options = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

// Then use it before your routes are set up:
app.use(cors(options));

// for parsing application/json
app.use(express.json()); 

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

// Connection URL
const url = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
const PORT = process.env.PORT || 8080;
let client = null;

// Listen on a port
const server = app.listen(PORT, () => {
  MongoClient.connect(url, {useUnifiedTopology: true}, function(err, res) {
    assert.equal(null, err);
    client = res;
  });
});

// Create endpoints/route handlers
app.get("/my-books", async function(request, result) {
  const query = { userId: request.query.uid };
  try {
    const books = await client.db("BookLand").collection("books").find(query).toArray();
    return result.status(200).send(books);
  } catch (error) {
    return result.status(500).json(error);
  }
})

app.get("/all-books", async function(request, result) {
  const query = {};
  try {
    const books = await client.db("BookLand").collection("books").find(query).toArray();
    return result.status(200).send(books);
  } catch (error) {
    return result.status(500).json(error);
  }
})

app.get("/favorites-books", async function(request, result) {
  const query = { users: {$in: [request.query.uid]} };
  try {
    const books = await client.db("BookLand").collection("books").find(query).toArray();
    return result.status(200).send(books);
  } catch (error) {
    return result.status(500).json(error);
  }
})

app.post("/add-book", uploadFiles, async function(request, result) {
  const data = request.body || {};
  const { image = [{}], pdf = [{}] } = request.files || {};
    
  uploadFiles(request, result, async function (err) {
    if (err instanceof multer.MulterError) {
      return result.status(500).json(err);
    } else if (err) {
      return result.status(500).json(err);
    }

    delete data["image"];
    delete data["pdf"];

    const imagePath = (image[0].destination || "").replace("public/", "") + (image[0].filename || "");
    const pdfPath = (pdf[0].destination || "").replace("public/", "") + (pdf[0].filename || "");
    const bookObj = { ...data, imagePath, pdfPath };
    try {
      await client.db("BookLand").collection("books").insertOne(bookObj);
      return result.status(200).send(bookObj);
    } catch (error) {
      return result.status(500).json(error);
    }
  });
});

app.patch("/edit-book/:id", uploadFiles, async function(request, result) {
  const data = request.body || {};
  const { image = [{}], pdf = [{}] } = request.files || {};
  const query = { _id: ObjectID(request.params.id) }

  uploadFiles(request, result, async function (err) {
    if (err instanceof multer.MulterError) {
      return result.status(500).json(err);
    } else if (err) {
      return result.status(500).json(err);
    }

    delete data["image"];
    delete data["pdf"];

    const imagePath = (image[0].destination || "").replace("public/", "") + (image[0].filename || "");
    const pdfPath = (pdf[0].destination || "").replace("public/", "") + (pdf[0].filename || "");
    const bookObj = Object.assign(data, imagePath && {imagePath}, pdfPath && {pdfPath});
    try {
      await client.db("BookLand").collection("books").updateOne(query, {$set: bookObj});
      return result.status(200).send(bookObj);
    } catch (error) {
      return result.status(500).json(error);
    }
  });
});

app.patch("/rating-book/:id", async function(request, result) {
  const { rating, comment, userId, email } = request.body || {};
  const query = { _id: ObjectID(request.params.id) }
  try {
    const { rating: currentRating = 0, comments = [] } = await client.db("BookLand").collection("books").findOne(query);
    const count = comments.length;
    const newRating = (currentRating * count + rating) / (count + 1);
    await client.db("BookLand").collection("books").updateOne(query, {
      $set: {
        rating: newRating
      },
      $push: {
        comments: {
          comment, 
          userId,
          email
        }
      },
    });
    return result.status(200).send({});
  } catch (error) {
    console.log(error);
    return result.status(500).json(error);
  }
});

app.patch("/set-favorite/:id", async function(request, result) {
  const data = request.body || {};
  const query = { _id: ObjectID(request.params.id) }
  try {
    const book = await client.db("BookLand").collection("books").findOne(query);
    if (book.users) {
      await client.db("BookLand").collection("books").updateOne(
        query,
        [{ $set:
          { "users":
            { $cond: [
              {$in: [data.user, "$users"]},
              {$setDifference: ["$users", [data.user]]},
              {$concatArrays: ["$users", [data.user]]}
            ]}
          }
        }]
      ) 
    } else {
      await client.db("BookLand").collection("books").updateOne(query, {$set: {users: [data.user]}});
    }  
    return result.status(200).send(data);
  } catch (error) {
    console.log(error);
    return result.status(500).json(error);
  }
});

app.delete("/delete-book/:id", async function(request, result) {
  const query = { _id: ObjectID(request.params.id) }
  try {
    await client.db("BookLand").collection("books").remove(query);
    return result.status(200).send({id: request.params.id});
  } catch (error) {
    return result.status(500).json(error);
  }
});

const onClose = () => {
  server.close();
  client.close();
}

process.on('SIGTERM', onClose);
process.on('SIGINT', onClose);
process.on('SIGQUIT', onClose);
