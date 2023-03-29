'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import custom modules
const Book = require('./models/book.js');
const seedDatabase = require('./seed.js');
const { updateBookDetails } = require('./bookUtils');

// Create an Express app
const app = express();

// Enable JSON body parsing
app.use(express.json());

// Enable CORS allows requests from server to access resources in a different origin
app.use(cors());

// Connect to the MongoDB database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Set the port number to call PORT from environment variables or 3001
const PORT = process.env.PORT || 3001;

// Set up database connection events
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to the database');
  seedDatabase();
});

// Define routes
// Root route
app.get('/', (request, response) => {
  response.send('Hello World')
});

// Get all books route
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

// Create a new book route
app.post('/books', async (req, res) => {
  try {
    const { title, author, description, status } = req.body;

    let finalDescription = description;
    let coverImageUrl;
    if (!description) {
      const bookDetails = await fetchBookCover(title, author);
      finalDescription = bookDetails.description || 'No description provided.';
      coverImageUrl = bookDetails.coverImageUrl;
    }

    const newBook = new Book({ title, author, description: finalDescription, coverImageUrl, status: status || 'active' });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).send('Error creating book');
  }
});

// Delete a book by ID route
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

// Start the server
app.listen(PORT, () => console.log(`listening on ${PORT}`));
