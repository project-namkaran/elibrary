import React from 'react';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  BookOpen, 
  Download, 
  ShoppingCart,
  Clock,
  MessageSquare,
  Share2,
  Bookmark
} from 'lucide-react';
import { Book } from '../../types';

interface BookDetailsProps {
  book: Book;
  onBack: () => void;
  onRead?: (book: Book) => void;
  onPurchase?: (book: Book) => void;
}

export const BookDetails: React.FC<BookDetailsProps> = ({
  book,
  onBack,
  onRead,
  onPurchase
}) => {
  const mockReviews = [
    {
      id: 1,
      author: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent book! Very informative and well-written.',
      date: '2023-06-15'
    },
    {
      id: 2,
      author: 'Mike Chen',
      rating: 4,
      comment: 'Great content, though could use more examples.',
      date: '2023-06-10'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Library
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full aspect-[3/4] object-cover rounded-lg mb-6"
              />

              {/* Type Badge */}
              <div className="mb-4">
                {book.type === 'free' && (
                  <span className="bg-emerald-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                    Free to Read
                  </span>
                )}
                {book.type === 'paid' && (
                  <span className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                    Premium Content
                  </span>
                )}
                {book.type === 'physical' && (
                  <span className="bg-purple-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                    Physical Book
                  </span>
                )}
              </div>

              {/* Price */}
              {book.price && (
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    ${book.price}
                  </span>
                </div>
              )}

              {book.type === 'free' && (
                <div className="mb-6">
                  <span className="text-3xl font-bold text-emerald-600">
                    Free
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                {book.type === 'free' && onRead && (
                  <button
                    onClick={() => onRead(book)}
                    className="w-full flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Start Reading
                  </button>
                )}
                
                {book.type === 'paid' && onPurchase && (
                  <button
                    onClick={() => onPurchase(book)}
                    className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Purchase & Download
                  </button>
                )}
                
                {book.type === 'physical' && onPurchase && book.isAvailable && (
                  <button
                    onClick={() => onPurchase(book)}
                    className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                )}

                {book.type === 'physical' && !book.isAvailable && (
                  <button
                    disabled
                    className="w-full flex items-center justify-center px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed font-medium"
                  >
                    <Clock className="h-5 w-5 mr-2" />
                    Out of Stock
                  </button>
                )}

                <button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Bookmark className="h-5 w-5 mr-2" />
                  Add to Wishlist
                </button>

                <button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Book
                </button>
              </div>

              {/* Quick Info */}
              <div className="space-y-2 text-sm text-gray-600">
                {book.pages && (
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {book.pages} pages
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Published {new Date(book.publishedDate).toLocaleDateString()}
                </div>
                {book.isbn && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">ISBN:</span>
                    {book.isbn}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{book.rating}</span>
                  <span className="ml-2 text-gray-600">({book.reviews} reviews)</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {book.category}
                  </span>
                  <span className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                    {book.genre}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Table of Contents (for free/paid books) */}
            {book.content && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Table of Contents
                </h2>
                <div className="space-y-2">
                  {book.content.map((chapter, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700">{chapter}</span>
                      <span className="text-sm text-gray-500">Page {(index + 1) * 25}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reviews & Ratings
                </h2>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Write Review
                </button>
              </div>

              <div className="space-y-4">
                {mockReviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{review.author}</span>
                        <div className="flex items-center ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};