const axios = require('axios');

// Function to fetch book cover and author information for a given book title
async function fetchBookCover(title) {
  try {
    // Make a GET request to the OpenLibrary API to search for the book by title
    const response = await axios.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
    const data = response.data;

    // If there are results, extract the book cover URL and author information
    if (data.docs.length > 0) {
      const book = data.docs[0];
      let coverImageUrl = null;
      let author = null;

      // Construct the book cover URL if the cover image ID is available
      if (book.cover_i) {
        coverImageUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
      }

      // Get the author's name if available
      if (book.author_name && book.author_name.length > 0) {
        author = book.author_name[0];
      }

      // Return the cover image URL and author information
      return { coverImageUrl, author };
    }
  } catch (error) {
    console.error(`Error fetching book cover for '${title}':`, error);
  }

  // If no results are found or an error occurs, return null values
  return { coverImageUrl: null, author: null };
}

// Function to update the book cover and author information for an array of books
async function updateBookDetails(books) {
  // Iterate through the array of books
  for (const book of books) {
    let shouldUpdate = false;

    // If the book cover URL or author information is missing, fetch the information
    if (!book.coverImageUrl || !book.author) {
      const { coverImageUrl, author } = await fetchBookCover(book.title);

      // Update the book cover URL if it's missing and the fetched URL is available
      if (!book.coverImageUrl && coverImageUrl) {
        book.coverImageUrl = coverImageUrl;
        shouldUpdate = true;
      }

      // Update the author information if it's missing and the fetched author is available
      if (!book.author && author) {
        book.author = author;
        shouldUpdate = true;
      }

      // Save the updated book information to the database if needed
      if (shouldUpdate) {
        await book.save();
      }
    }
  }
}

// Export the functions for use in other modules
module.exports = {
  fetchBookCover,
  updateBookDetails
};
