import React from 'react';
import {
  BookOpen,
  TrendingUp,
  Users,
  Star,
  Clock,
  ArrowRight,
  Award,
  Target
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useBooks } from '../../context/BookContext';
import { Book } from '../../types';

interface DashboardProps {
  onViewChange: (view: string) => void;
  onBookSelect: (book: Book) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange, onBookSelect }) => {
  const { user } = useUser();
  const { books, loading, getBookById } = useBooks();

  const currentlyReading = user?.currentlyReading
    ? getBookById(user.currentlyReading.bookId)
    : null;

  const recentBooks = books.filter(book => 
    user?.borrowedBooks?.includes(book.id) || user?.purchasedBooks?.includes(book.id)
  ).slice(0, 4);

  const recommendedBooks = books.filter(book => book.rating >= 4.5).slice(0, 3);

  const stats = [
    {
      name: 'Books Read',
      value: (user?.borrowedBooks?.length || 0) + (user?.purchasedBooks?.length || 0),
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-700',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Reading Streak',
      value: '15 days',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-700',
      bgColor: 'bg-emerald-100'
    },
    {
      name: 'Achievements',
      value: '8',
      icon: Award,
      color: 'bg-yellow-50 text-yellow-700',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'Reading Goal',
      value: '75%',
      icon: Target,
      color: 'bg-purple-50 text-purple-700',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h2>
            <p className="text-blue-100 mb-4">
              Ready to continue your reading journey?
            </p>
            {currentlyReading && (
              <button
                onClick={() => onBookSelect(currentlyReading)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center"
              >
                Continue Reading
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-blue-500 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color.split(' ').pop()}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Currently Reading */}
      {currentlyReading && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              Currently Reading
            </h3>
          </div>
          
          <div className="flex items-center space-x-4">
            <img
              src={currentlyReading.cover}
              alt={currentlyReading.title}
              className="w-16 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{currentlyReading.title}</h4>
              <p className="text-sm text-gray-600">{currentlyReading.author}</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{user?.currentlyReading?.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${user?.currentlyReading?.progress || 0}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Last read: {user?.currentlyReading?.lastPosition}
              </p>
            </div>
            <button
              onClick={() => onBookSelect(currentlyReading)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Books */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Books</h3>
            <button
              onClick={() => onViewChange('library')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </button>
          </div>
          
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading books...</p>
              </div>
            ) : recentBooks.length > 0 ? (
              recentBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => onBookSelect(book)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-10 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {book.title}
                    </h4>
                    <p className="text-xs text-gray-600">{book.author}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600 ml-1">{book.rating}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent books. Start reading to see your history here!
              </p>
            )}
          </div>
        </div>

        {/* Recommended Books */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
            <button
              onClick={() => onViewChange('library')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </button>
          </div>
          
          <div className="space-y-3">
            {recommendedBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => onBookSelect(book)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-10 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {book.title}
                  </h4>
                  <p className="text-xs text-gray-600">{book.author}</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600 ml-1">{book.rating}</span>
                    </div>
                    {book.type === 'free' && (
                      <span className="text-xs text-emerald-600 font-medium">Free</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onViewChange('library')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Browse Library</span>
          </button>
          
          <button
            onClick={() => onViewChange('physical')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="h-8 w-8 text-emerald-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Buy Books</span>
          </button>
          
          <button
            onClick={() => onViewChange('exchange')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Exchange Books</span>
          </button>
          
          <button
            onClick={() => onViewChange('profile')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Star className="h-8 w-8 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">My Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};