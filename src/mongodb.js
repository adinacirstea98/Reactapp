const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const express = require('express');

// Import the library:
const cors = require('cors');

const app = express();

const options = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

// Then use it before your routes are set up:
app.use(cors(options));

// Connection URL
const url = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';

let client = null;

const server = app.listen(process.env.PORT || 8080, ()=>{
  MongoClient.connect(url, {useUnifiedTopology: true}, function(err, res) {
    assert.equal(null, err);
    client = res;
    // const collection = db.collection("books");
    // const booksIterator = collection.find({});
    // booksIterator.forEach(console.log);
    // client.close();
  });
});

app.get("/", async function(request, result){
  const books = client.db("BookLand").collection("books").find({}).toArray();
  result.send(await books);
})

const onClose = () => {
  server.close();
  client.close();
}

process.on('SIGTERM', onClose);
process.on('SIGINT', onClose);
process.on('SIGQUIT', onClose);



