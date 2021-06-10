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
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname )
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
  console.log("---------------------------------------------------");
  console.log(request.body);
  // console.log(request.files);
  // console.log(request.file);
  // insert

  let obj = {
    "title": request.body.title,
    "category": request.body.category,
    "author": request.body.author
  }

  //const books = client.db("BookLand").collection("books").find(query).toArray();
  uploadFiles(request, result, function (err) {
    if (err instanceof multer.MulterError) {
      return result.status(500).json(err);
    } else if (err) {
      return result.status(500).json(err);
    }
    return result.status(200).send({});
  })
})

const onClose = () => {
  server.close();
  client.close();
}

process.on('SIGTERM', onClose);
process.on('SIGINT', onClose);
process.on('SIGQUIT', onClose);
