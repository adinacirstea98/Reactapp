const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const express = require('express');
const multer = require('multer')

// Import the library:
const cors = require('cors');

// const storageImages = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/images/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname )
//   }
// })

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

// for parsing multipart/form-data
// app.use(uploadFiles);

// Connection URL
const url = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
const PORT = process.env.PORT || 8080;
let client = null;

// Listen on a port
const server = app.listen(PORT, () => {
  MongoClient.connect(url, {useUnifiedTopology: true}, function(err, res) {
    assert.equal(null, err);
    client = res;
    // const collection = db.collection("books");
    // const booksIterator = collection.find({});
    // booksIterator.forEach(console.log);
    // client.close();
  });
});

// Create endpoints/route handlers
app.get("/my-books", async function(request, result) {
  const query = { userId: request.query.uid };
  const books = client.db("BookLand").collection("books").find(query).toArray();
  result.send(await books);
})

/*
    "title": "",
    "image": "",
    "category": "poetry / article / novel / story",
    "author": "",
    "pageCount": "",
    "language": "",
    "description": "",
    "tags": "",
    "userId": "",
    "pdf": ""
*/

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
    const obj = { ...data, imagePath, pdfPath };
    try {
      const writeResult = await client.db("BookLand").collection("books").insertOne(obj);
      return result.status(200).send(writeResult.ops);
    } catch (error) {
      return result.status(500).json(error);
    }
  });
})

const onClose = () => {
  server.close();
  client.close();
}

process.on('SIGTERM', onClose);
process.on('SIGINT', onClose);
process.on('SIGQUIT', onClose);
