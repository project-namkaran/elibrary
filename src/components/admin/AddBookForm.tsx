import React, { useState } from 'react';
import {
  Save,
  X,
  Upload,
  AlertCircle,
  CheckCircle,
  BookOpen,
  DollarSign,
  Tag,
  Calendar,
  Hash,
  FileText
} from 'lucide-react';
import { Book } from '../../types';
import { categories, genres } from '../../data/books';

interface AddBookFormProps {
  onSave: (book: Omit<Book, 'id'>) => void;
  onCancel: () => void;
  editingBook?: Book | null;
}

export const AddBookForm: React.FC<AddBookFormProps> = ({
  onSave,
  onCancel,
  editingBook
}) => {
  const [formData, setFormData] = useState({
    title: editingBook?.title || '',
    author: editingBook?.author || '',
    category: editingBook?.category || 'Technology',
    genre: editingBook?.genre || 'Non-Fiction',
    description: editingBook?.description || '',
    cover: editingBook?.cover || '',
    type: editingBook?.type || 'free' as 'free' | 'paid' | 'physical',
    price: editingBook?.price?.toString() || '',
    pages: editingBook?.pages?.toString() || '',
    isbn: editingBook?.isbn || '',
    publishedDate: editingBook?.publishedDate || new Date().toISOString().split('T')[0],
    isAvailable: editingBook?.isAvailable ?? true,
    content: editingBook?.content?.join('\n') || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.cover.trim()) {
      newErrors.cover = 'Cover image URL is required';
    } else if (!isValidUrl(formData.cover)) {
      newErrors.cover = 'Please enter a valid URL';
    }

    if (formData.type !== 'free' && !formData.price) {
      newErrors.price = 'Price is required for paid/physical books';
    }

    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'Price must be a valid number';
    }

    if (formData.pages && isNaN(Number(formData.pages))) {
      newErrors.pages = 'Pages must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const bookData: Omit<Book, 'id'> = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category,
        genre: formData.genre,
        description: formData.description.trim(),
        cover: formData.cover.trim(),
        type: formData.type,
        price: formData.price ? Number(formData.price) : undefined,
        pages: formData.pages ? Number(formData.pages) : undefined,
        isbn: formData.isbn.trim() || undefined,
        publishedDate: formData.publishedDate,
        isAvailable: formData.type === 'physical' ? formData.isAvailable : undefined,
        rating: 0,
        reviews: 0,
        content: formData.content.trim() ? formData.content.split('\n').filter(line => line.trim()) : undefined
      };

      onSave(bookData);
      setSuccess(true);

      // Reset form after successful save
      setTimeout(() => {
        setFormData({
          title: '',
          author: '',
          category: 'Technology',
          genre: 'Non-Fiction',
          description: '',
          cover: '',
          type: 'free',
          price: '',
          pages: '',
          isbn: '',
          publishedDate: new Date().toISOString().split('T')[0],
          isAvailable: true,
          content: ''
        });
        setSuccess(false);
      }, 2000);

    } catch (error) {
      setErrors({ submit: 'Failed to save book. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const suggestedCovers = [
    'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {editingBook ? 'Edit Book' : 'Add New Book'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Book {editingBook ? 'updated' : 'added'} successfully!
        </div>
      )}

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Basic Information
            </h3>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter book title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.author ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter author name"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">{errors.author}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {categories.filter(cat => cat !== 'All Categories').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {genres.filter(genre => genre !== 'All Genres').map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter book description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Publishing & Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Publishing & Pricing
            </h3>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Book Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="free">Free</option>
                <option value="paid">Premium (Digital)</option>
                <option value="physical">Physical Book</option>
              </select>
            </div>

            {formData.type !== 'free' && (
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.price ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>
            )}

            {formData.type === 'physical' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
                  Available in stock
                </label>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="pages" className="block text-sm font-medium text-gray-700 mb-1">
                  Pages
                </label>
                <input
                  type="number"
                  id="pages"
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.pages ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Number of pages"
                />
                {errors.pages && (
                  <p className="mt-1 text-sm text-red-600">{errors.pages}</p>
                )}
              </div>

              <div>
                <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Published Date
                </label>
                <input
                  type="date"
                  id="publishedDate"
                  name="publishedDate"
                  value={formData.publishedDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                ISBN
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="978-1234567890"
              />
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Cover Image
          </h3>
          
          <div>
            <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL *
            </label>
            <input
              type="url"
              id="cover"
              name="cover"
              value={formData.cover}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.cover ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="https://example.com/book-cover.jpg"
            />
            {errors.cover && (
              <p className="mt-1 text-sm text-red-600">{errors.cover}</p>
            )}
          </div>

          {/* Cover Preview */}
          {formData.cover && isValidUrl(formData.cover) && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <img
                src={formData.cover}
                alt="Cover preview"
                className="w-32 h-40 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Suggested Covers */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Suggested covers:</p>
            <div className="flex space-x-2">
              {suggestedCovers.map((url, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, cover: url }))}
                  className="w-16 h-20 border border-gray-200 rounded overflow-hidden hover:border-blue-500 transition-colors"
                >
                  <img
                    src={url}
                    alt={`Suggested cover ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content (for free/paid books) */}
        {(formData.type === 'free' || formData.type === 'paid') && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Table of Contents
            </h3>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Chapter List (one per line)
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder={`Chapter 1: Introduction\nChapter 2: Getting Started\nChapter 3: Advanced Topics`}
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter each chapter on a new line. This will be used for the table of contents.
              </p>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {editingBook ? 'Update Book' : 'Add Book'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};