import React, { useState } from 'react';
import Comic from "../assets/books/child.jpg"

const BookCard = ({ book }) => {
  return (
    <div className="bg-[#222831] p-4 rounded-lg text-center text-white shadow-lg w-84 h-[25rem]">
      <img src={book.image} alt={book.title} className="w-64 h-52 rounded-md mb-2" />
      <h3 className="text-xl font-bold">{book.title}</h3>
      <p className="text-[#FFD369]">{book.author}</p>
      <p className="text-gray-200 text-sm">{book.date}</p>
    </div>
  );
};

const BookGrid = () => {

    const books = [
    { title: 'Little Dog Ready', author: 'Mabel Stryker', date: 'Edited Feb 1, 2024', image: '../assets/books/comic.jpg' },
    { title: 'Fiction Writing Exercises', author: 'Monique Danielle', date: 'Edited Jan 18, 2024', image: '/images/book1.jpg' },
    { title: 'Brave Dog Ready', author: 'Monique Danielle', date: 'Edited Sep 26, 2023', image: '/images/book1.jpg' },
    { title: 'Tall Tales', author: 'Monique Danielle', date: 'Edited Sep 3, 2023', image: '/images/book1.jpg' },
    { title: 'Series Bible Workbook', author: 'Monique Danielle', date: 'Edited Sep 3, 2023', image: '/images/book1.jpg' },
    { title: 'World Building Workshop', author: 'Monique Danielle', date: 'Edited Sep 3, 2023', image: '/images/book1.jpg' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('title-asc');

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedBooks = filteredBooks.sort((a, b) => {
    switch (sortOption) {
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      default:
        return 0;
    }
  });

  return (
    <div className="p-5 bg-gray-900 min-h-screen flex flex-col items-center">
      <h1 className="text-yellow-400 text-3xl mb-5">My Books</h1>
      
      <div className="flex justify-end w-5/6 mb-5 gap-4">
        <input
          type="text"
          placeholder="Search by title..."
          className="p-2 w-full max-w-xs rounded-md border border-yellow-400 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <select
          className="p-2 rounded-md border border-yellow-400 bg-gray-200 text-black outline-none"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)} 
        >
          <option value="title-asc">Sort by Title (A-Z)</option>
          <option value="title-desc">Sort by Title (Z-A)</option>
          <option value="date-asc">Sort by Date (Oldest)</option>
          <option value="date-desc">Sort by Date (Newest)</option>
        </select>
      </div>

      <div className="flex flex-wrap justify-center gap-5 w-full">
        {sortedBooks.length > 0 ? (
          sortedBooks.map((book, index) => (
            <BookCard key={index} book={book} />
          ))
        ) : (
          <p className="text-gray-200">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default BookGrid;