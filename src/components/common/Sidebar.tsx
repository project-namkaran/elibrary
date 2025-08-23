import React from 'react';
import {
  Home,
  BookOpen,
  ShoppingBag,
  Repeat,
  User,
  Settings,
  Shield,
  X
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentView,
  onViewChange
}) => {
  const { user, isAuthenticated } = useUser();

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, requireAuth: true },
    { id: 'library', name: 'Digital Library', icon: BookOpen, requireAuth: false },
    { id: 'physical', name: 'Buy Books', icon: ShoppingBag, requireAuth: false },
    { id: 'exchange', name: 'Book Exchange', icon: Repeat, requireAuth: true },
    { id: 'profile', name: 'Profile', icon: User, requireAuth: true },
    { id: 'settings', name: 'Settings', icon: Settings, requireAuth: true }
  ];

  const adminNavigation = [
    { id: 'admin', name: 'Admin Panel', icon: Shield, requireAuth: true }
  ];

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId);
    onClose();
  };

  const isAdmin = user?.email === 'admin@example.com'; // Simple admin check

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:h-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">E-Library</h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                if (item.requireAuth && !isAuthenticated) return null;

                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 mr-3 ${
                        isActive ? 'text-blue-700' : 'text-gray-400'
                      }`}
                    />
                    {item.name}
                  </button>
                );
              })}
            </div>

            {/* Admin Section */}
            {isAuthenticated && isAdmin && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Administration
                </p>
                <div className="space-y-1">
                  {adminNavigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                          isActive
                            ? 'bg-red-50 text-red-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 mr-3 ${
                            isActive ? 'text-red-700' : 'text-gray-400'
                          }`}
                        />
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </nav>

          {/* User Info */}
          {isAuthenticated && user && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">
                    Member since {new Date(user.joinedDate).getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};