'use strict';

// Import Mongoose for database operations
const mongoose = require('mongoose');

require('dotenv').config();

// Import the Book model
const Book = require('./models/book.js');

// Seed the database with initial data if needed
async function seedDatabase() {
  // Define an array of books to be added to the database
  const books = [
    {
      title: 'The Hobbit',
      description: 'A hobbit goes on an adventure',
      status: 'available',
      author: 'J.R.R. Tolkien'
    },
    {
      title: 'The Fellowship of the Ring',
      description: 'A hobbit goes on an adventure',
      status: 'available',
      author: 'J.R.R. Tolkien'
    },
    {
      title: 'The Two Towers',
      description: 'A hobbit goes on an adventure',
      status: 'available',
      author: 'J.R.R. Tolkien'
    },
  ];

  try {
    // Check the number of documents in the Book collection
    const bookCount = await Book.countDocuments();

    // If there are no documents in the collection, insert the books array
    if (bookCount === 0) {
      await Book.insertMany(books);
      console.log('Database Seeded');
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = seedDatabase;