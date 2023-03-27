'use strict';
//Require express, mongoose, cors, dotenv
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./models/book.js');
const seedDatabase = require('./seed.js');


//create an instance of express, and USE JSON middleweare to parse incoming strings
const app = express();
app.use(express.json());



//use cors middleware to allow cross origin requests(front end to backend)
app.use(cors());

//connect the mongoDB database to the server using mongoose
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

//set up database connection

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
  seedDatabase(); 
});



//Seed the database with data from three Book objects with all available attributes

app.get('/books', async (req, res) => {
  try{
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Error fetching books');
  }
});


const PORT = process.env.PORT || 3001;

app.get('/test', (request, response) => {

  response.send('test request received')

})

app.listen(PORT, () => console.log(`listening on ${PORT}`));


// Modularize by creating schema and model files

//create a books route

//use a REST client to hit the route and test the server

// when a client sends GET request to /books, send back a list of all books from the book collection and send it back to the client in a json response object.