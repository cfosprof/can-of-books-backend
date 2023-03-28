'use strict';

const mongoose = require('mongoose');

require ('dotenv').config();

const Book = require('./models/book.js');

async function seedDatabase() {
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