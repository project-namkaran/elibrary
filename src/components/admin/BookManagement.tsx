import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  MoreVertical,
  Star,
  BookOpen
} from 'lucide-react';
import { Book } from '../../types';
import { books as initialBooks } from '../../data/books';
import { AddBookForm } from './AddBookForm';

export const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || book.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleAddBook = (bookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      rating: 0,
      reviews: 0
    };
    
    setBooks(prev => [newBook, ...prev]);
    setShowAddForm(false);
  };

  const handleEditBook = (bookData: Omit<Book, 'id'>) => {
    if (editingBook) {
      setBooks(prev => prev.map(book => 
        book.id === editingBook.id 
          ? { ...bookData, id: editingBook.id, rating: book.rating, reviews: book.reviews }
          : book
      ));
      setEditingBook(null);
    }
  };

  const handleDeleteBook = (bookId: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      setBooks(prev => prev.filter(book => book.id !== bookId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedBooks.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedBooks.length} selected books?`)) {
      setBooks(prev => prev.filter(book => !selectedBooks.includes(book.id)));
      setSelectedBooks([]);
    }
  };

  const toggleBookSelection = (bookId: string) => {
    setSelectedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const selectAllBooks = () => {
    if (selectedBooks.length === filteredBooks.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(filteredBooks.map(book => book.id));
    }
  };

  if (showAddForm || editingBook) {
    return (
      <AddBookForm
        onSave={editingBook ? handleEditBook : handleAddBook}
        onCancel={() => {
          setShowAddForm(false);
          setEditingBook(null);
        }}
        editingBook={editingBook}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Book Management</h2>
          <p className="text-gray-600 mt-1">
            Manage your library collection ({books.length} books total)
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Book
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books by title or author..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="free">Free</option>
              <option value="paid">Premium</option>
              <option value="physical">Physical</option>
            </select>

            {selectedBooks.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete ({selectedBooks.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedBooks.length === filteredBooks.length && filteredBooks.length > 0}
                    onChange={selectAllBooks}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(book.id)}
                      onChange={() => toggleBookSelection(book.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded border border-gray-200"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {book.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {book.pages} pages
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {book.author}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      book.type === 'free' 
                        ? 'bg-green-100 text-green-800'
                        : book.type === 'paid'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {book.type === 'free' ? 'Free' : book.type === 'paid' ? 'Premium' : 'Physical'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {book.price ? `$${book.price}` : 'Free'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-900">{book.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({book.reviews})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {book.type === 'physical' ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        book.isAvailable 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setEditingBook(book)}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit book"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete book"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first book to the library.'
              }
            </p>
            {!searchQuery && filterType === 'all' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Book
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};