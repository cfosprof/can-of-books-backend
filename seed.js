'use strict';

const mongoose = require('mongoose');

require ('dotenv').config();

// mongoose.connect(process.env.DB_URL);

const Book = require('./models/book.js');

async function seedDatabase() {
  const books = [
    {
      title: 'The Hobbit',
      description: 'A hobbit goes on an adventure',
      status: 'available'
    },
    {
      title: 'The Fellowship of the Ring',
      description: 'A hobbit goes on an adventure',
      status: 'available'
    },
    {
      title: 'The Two Towers',
      description: 'A hobbit goes on an adventure',
      status: 'available'
    },
  ];
  try {
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      await Book.insertMany(books);
      console.log('Database Seeded');
    }
  } catch (error) {
    console.log(error);
    }
  }
module.exports = seedDatabase;