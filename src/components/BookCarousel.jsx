import React, { useState } from 'react';
import Modal from './Modal';
import "../styles/bookCarousel.css"
import got from "../assets/books/got.jpg"
import romcom1 from "../assets/books/romcom1.jpg"
import child from "../assets/books/child.jpg"
import jee from "../assets/books/jee.jpg"
import comic from "../assets/books/comic.jpg"
const books = [
  { id: 1, title: 'Book One', image: got },
  { id: 2, title: 'Book Two', image: romcom1 },
  { id: 3, title: 'Book Three', image: child },
  { id: 4, title: 'Book Four', image: jee },
  { id: 5, title: 'Book Five', image: comic },
];

const BookCarousel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#222831] py-8 px-4">
      <h2 className="text-4xl tracking-tight font-extrabold text-white mb-14 text-center">Explore Our Rentals</h2>
      <div className="overflow-hidden relative">
        <div className="flex animate-scroll gap-16 hover:animate-pause">
          {books.concat(books).map((book, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-60 h-100 bg-white rounded-lg shadow-lg cursor-pointer"
              onClick={handleBookClick}
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && <Modal closeModal={closeModal} />}
    </div>
  );
};

export default BookCarousel;
