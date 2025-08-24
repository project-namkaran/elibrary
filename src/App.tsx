import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { AuthModal } from './components/auth/AuthModal';
import { Dashboard } from './components/dashboard/Dashboard';
import { DigitalLibrary } from './components/library/DigitalLibrary';
import { BookDetails } from './components/library/BookDetails';
import { BookReader } from './components/library/BookReader';
import { AdminPanel } from './components/admin/AdminPanel';
import { UserProvider, useUser } from './context/UserContext';
import { BookProvider } from './context/BookContext';
import { Book } from './types';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState('library');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readerMode, setReaderMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { isAuthenticated } = useUser();

  const { user } = useUser();

  const handleViewChange = (view: string) => {
    const authRequiredViews = ['dashboard', 'profile', 'exchange', 'settings'];
    const adminRequiredViews = ['admin'];
    
    if (authRequiredViews.includes(view) && !isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    if (adminRequiredViews.includes(view) && (!isAuthenticated || user?.role !== 'admin')) {
      setShowAuthModal(true);
      return;
    }
    
    setCurrentView(view);
    setSelectedBook(null);
    setReaderMode(false);
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setCurrentView('book-details');
  };

  const handleBookRead = (book: Book) => {
    setSelectedBook(book);
    setReaderMode(true);
  };

  const handleBookPurchase = (book: Book) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    // Handle purchase logic here
    alert(`Purchase functionality for "${book.title}" would be implemented here.`);
  };

  const handleBackToLibrary = () => {
    setSelectedBook(null);
    setReaderMode(false);
    setCurrentView('library');
  };

  const handleBackToDetails = () => {
    setReaderMode(false);
    setCurrentView('book-details');
  };

  // Show reader in full screen
  if (readerMode && selectedBook) {
    return (
      <BookReader
        book={selectedBook}
        onBack={handleBackToDetails}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onShowAuth={() => setShowAuthModal(true)}
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentView={currentView}
          onViewChange={handleViewChange}
        />

        <main className="flex-1 min-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Book Details View */}
            {currentView === 'book-details' && selectedBook && (
              <BookDetails
                book={selectedBook}
                onBack={handleBackToLibrary}
                onRead={handleBookRead}
                onPurchase={handleBookPurchase}
              />
            )}

            {/* Dashboard View */}
            {currentView === 'dashboard' && isAuthenticated && (
              <Dashboard
                onViewChange={handleViewChange}
                onBookSelect={handleBookSelect}
              />
            )}

            {/* Digital Library View */}
            {(currentView === 'library' || (!isAuthenticated && currentView === 'dashboard')) && (
              <DigitalLibrary
                onBookSelect={handleBookSelect}
                onBookRead={handleBookRead}
                onBookPurchase={handleBookPurchase}
              />
            )}

            {/* Physical Books View */}
            {currentView === 'physical' && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Physical Books Store</h2>
                <p className="text-gray-600 mb-8">Browse and purchase physical books for delivery</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                  <p className="text-blue-800">
                    Physical books functionality would be implemented here with shopping cart,
                    checkout process, and payment integration.
                  </p>
                </div>
              </div>
            )}

            {/* Book Exchange View */}
            {currentView === 'exchange' && isAuthenticated && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Exchange</h2>
                <p className="text-gray-600 mb-8">Exchange your books with other readers</p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 max-w-2xl mx-auto">
                  <p className="text-emerald-800">
                    Book exchange functionality would be implemented here with user listings,
                    exchange requests, and messaging system.
                  </p>
                </div>
              </div>
            )}

            {/* Profile View */}
            {currentView === 'profile' && isAuthenticated && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">User Profile</h2>
                <p className="text-gray-600 mb-8">Manage your account and reading preferences</p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 max-w-2xl mx-auto">
                  <p className="text-purple-800">
                    User profile functionality would be implemented here with account settings,
                    reading statistics, and preferences.
                  </p>
                </div>
              </div>
            )}

            {/* Settings View */}
            {currentView === 'settings' && isAuthenticated && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
                <p className="text-gray-600 mb-8">Configure your app preferences</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
                  <p className="text-gray-800">
                    Settings functionality would be implemented here with notifications,
                    privacy controls, and app preferences.
                  </p>
                </div>
              </div>
            )}

            {/* Admin Panel View */}
            {currentView === 'admin' && isAuthenticated && user?.role === 'admin' && (
              <AdminPanel onBack={() => handleViewChange('library')} />
            )}

            {/* Unauthorized Access */}
            {currentView === 'admin' && (!isAuthenticated || user?.role !== 'admin') && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                <p className="text-gray-600 mb-8">You don't have permission to access the admin panel</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
                  <p className="text-red-800">
                    Admin access is required to view this section. Please contact your administrator.
                  </p>
                </div>
                <button
                  onClick={() => handleViewChange('library')}
                  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Return to Library
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <BookProvider>
        <AppContent />
      </BookProvider>
    </UserProvider>
  );
}

export default App;