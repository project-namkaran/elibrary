import React from 'react';
import { Star, Download, ShoppingCart, BookOpen, Clock } from 'lucide-react';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  onRead?: (book: Book) => void;
  onPurchase?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onSelect,
  onRead,
  onPurchase
}) => {
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      onClick={() => onSelect(book)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          {book.type === 'free' && (
            <span className="bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Free
            </span>
          )}
          {book.type === 'paid' && (
            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Premium
            </span>
          )}
          {book.type === 'physical' && (
            <span className="bg-purple-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Physical
            </span>
          )}
        </div>

        {/* Availability Badge for Physical Books */}
        {book.type === 'physical' && !book.isAvailable && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">{book.rating}</span>
          </div>
          <span className="text-sm text-gray-400 mx-2">•</span>
          <span className="text-sm text-gray-600">{book.reviews} reviews</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              {book.category}
            </span>
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
              {book.genre}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {book.description}
        </p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {book.price && (
              <span className="text-lg font-bold text-gray-900">
                ${book.price}
              </span>
            )}
            {book.type === 'free' && (
              <span className="text-lg font-bold text-emerald-600">Free</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {book.type === 'free' && onRead && (
              <button
                onClick={(e) => handleActionClick(e, () => onRead(book))}
                className="flex items-center px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <BookOpen className="h-4 w-4 mr-1" />
                Read
              </button>
            )}
            
            {book.type === 'paid' && onPurchase && (
              <button
                onClick={(e) => handleActionClick(e, () => onPurchase(book))}
                className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-1" />
                Buy
              </button>
            )}
            
            {book.type === 'physical' && onPurchase && book.isAvailable && (
              <button
                onClick={(e) => handleActionClick(e, () => onPurchase(book))}
                className="flex items-center px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Buy
              </button>
            )}

            {book.type === 'physical' && !book.isAvailable && (
              <button
                disabled
                className="flex items-center px-3 py-1.5 bg-gray-400 text-white text-sm rounded-lg cursor-not-allowed"
              >
                <Clock className="h-4 w-4 mr-1" />
                Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};