'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./models/book.js');
const seedDatabase = require('./seed.js');
const { updateBookDetails } = require('./bookUtils');

const app = express();
app.use(express.json());

app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const PORT = process.env.PORT || 3001;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
  seedDatabase(); 
});

app.get('/', (request, response) => {
  response.send('Hello World')
})

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();

    await updateBookDetails(books);

    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Error fetching books');
  }
});

app.post('/books', async (req, res) => {
  try {
    const { title, author, description, coverImageUrl } = req.body;

    let finalDescription = description;
    if (!description) {
      const bookDetails = await fetchBookCover(title, author);
      finalDescription = bookDetails.description || 'No description provided.';
    }

    const newBook = new Book({ title, author, description: finalDescription, coverImageUrl });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).send('Error creating book');
  }
});


app.delete('/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    await Book.findByIdAndDelete(bookId);
    res.status(204).send('Book deleted');
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).send('Error deleting book');
  }
});


app.listen(PORT, () => console.log(`listening on ${PORT}`));

