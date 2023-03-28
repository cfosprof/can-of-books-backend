'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./models/book.js');
const seedDatabase = require('./seed.js');
const axios = require('axios');

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


//Seed the database with data from three Book objects with all available attributes

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();

    // Fetch book cover images and author's name
    for (const book of books) {
      if (!book.coverImageUrl || !book.author) {
        const { coverImageUrl, author } = await fetchBookCover(book.title);
        if (!book.coverImageUrl) {
          book.coverImageUrl = coverImageUrl;
        }
        if (!book.author) {
          book.author = author;
        }
      }
    }

    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('Error fetching books');
  }
});

async function fetchBookCover(title) {
  try {
    const response = await axios.get(`http://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
    const data = response.data;

    if (data.docs.length > 0) {
      const book = data.docs[0];
      let coverImageUrl = null;
      let author = null;

      if (book.cover_i) {
        coverImageUrl = `http://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
      }

      if (book.author_name && book.author_name.length > 0) {
        author = book.author_name[0];
      }

      return { coverImageUrl, author };
    }
  } catch (error) {
    console.error(`Error fetching book cover for '${title}':`, error);
  }

  return { coverImageUrl: null, author: null };
}





app.get('/test', (request, response) => {

  response.send('test request received')

})

app.listen(PORT, () => console.log(`listening on ${PORT}`));

