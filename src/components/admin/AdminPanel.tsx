import React, { useState } from 'react';
import {
  Plus,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Upload,
  Save,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { AddBookForm } from './AddBookForm';
import { BookManagement } from './BookManagement';
import { UserManagement } from './UserManagement';
import { SystemSettings } from './SystemSettings';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('books');

  const tabs = [
    { id: 'books', name: 'Book Management', icon: BookOpen },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'System Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-1">
              Manage books, users, and system settings
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Back to Library
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'books' && <BookManagement />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Analytics and reporting functionality would be implemented here.
              </p>
            </div>
          )}
          {activeTab === 'settings' && <SystemSettings />}
        </div>
      </div>
    </div>
  );
};