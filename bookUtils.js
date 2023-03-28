const axios = require('axios');

async function fetchBookCover(title) {
  try {
    const response = await axios.get(`'https://covers.openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
    const data = response.data;

    if (data.docs.length > 0) {
      const book = data.docs[0];
      let coverImageUrl = null;
      let author = null;

      if (book.cover_i) {
        coverImageUrl = `'https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
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

async function updateBookDetails(books) {
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
}

module.exports = {
  fetchBookCover,
  updateBookDetails
};