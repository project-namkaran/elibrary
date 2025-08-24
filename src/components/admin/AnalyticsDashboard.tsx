import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Download,
  ShoppingCart,
  Calendar,
  Eye,
  Star,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  totalBooks: number;
  totalDownloads: number;
  totalRevenue: number;
  activeUsers: number;
  newUsersThisMonth: number;
  popularBooks: Array<{
    id: string;
    title: string;
    author: string;
    downloads: number;
    rating: number;
  }>;
  revenueData: Array<{
    month: string;
    revenue: number;
    downloads: number;
  }>;
  userActivity: Array<{
    date: string;
    activeUsers: number;
    newUsers: number;
  }>;
}

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  
  // Mock analytics data
  const analyticsData: AnalyticsData = {
    totalUsers: 1247,
    totalBooks: 156,
    totalDownloads: 8934,
    totalRevenue: 12450.75,
    activeUsers: 342,
    newUsersThisMonth: 89,
    popularBooks: [
      {
        id: '1',
        title: 'Modern Web Development',
        author: 'Alex Chen',
        downloads: 1234,
        rating: 4.8
      },
      {
        id: '2',
        title: 'Business Strategy Essentials',
        author: 'Robert Kim',
        downloads: 987,
        rating: 4.4
      },
      {
        id: '3',
        title: 'The Art of Photography',
        author: 'Maria Rodriguez',
        downloads: 756,
        rating: 4.6
      },
      {
        id: '4',
        title: 'Climate Change Solutions',
        author: 'Dr. Lisa Green',
        downloads: 654,
        rating: 4.9
      },
      {
        id: '5',
        title: 'Mindful Living',
        author: 'Dr. Emily Watson',
        downloads: 543,
        rating: 4.7
      }
    ],
    revenueData: [
      { month: 'Jan', revenue: 8500, downloads: 1200 },
      { month: 'Feb', revenue: 9200, downloads: 1350 },
      { month: 'Mar', revenue: 10100, downloads: 1480 },
      { month: 'Apr', revenue: 11300, downloads: 1620 },
      { month: 'May', revenue: 10800, downloads: 1590 },
      { month: 'Jun', revenue: 12450, downloads: 1780 }
    ],
    userActivity: [
      { date: '2023-06-01', activeUsers: 245, newUsers: 12 },
      { date: '2023-06-02', activeUsers: 267, newUsers: 8 },
      { date: '2023-06-03', activeUsers: 289, newUsers: 15 },
      { date: '2023-06-04', activeUsers: 312, newUsers: 9 },
      { date: '2023-06-05', activeUsers: 298, newUsers: 11 },
      { date: '2023-06-06', activeUsers: 334, newUsers: 18 },
      { date: '2023-06-07', activeUsers: 342, newUsers: 14 }
    ]
  };

  const stats = [
    {
      name: 'Total Users',
      value: analyticsData.totalUsers.toLocaleString(),
      change: '+12.5%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-50 text-blue-700',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Books',
      value: analyticsData.totalBooks.toLocaleString(),
      change: '+8.2%',
      changeType: 'increase',
      icon: BookOpen,
      color: 'bg-emerald-50 text-emerald-700',
      bgColor: 'bg-emerald-100'
    },
    {
      name: 'Downloads',
      value: analyticsData.totalDownloads.toLocaleString(),
      change: '+23.1%',
      changeType: 'increase',
      icon: Download,
      color: 'bg-purple-50 text-purple-700',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Revenue',
      value: `$${analyticsData.totalRevenue.toLocaleString()}`,
      change: '+15.3%',
      changeType: 'increase',
      icon: ShoppingCart,
      color: 'bg-yellow-50 text-yellow-700',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Track performance and user engagement metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`h-4 w-4 mr-1 ${
                      stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color.split(' ').pop()}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Downloads</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {analyticsData.revenueData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900 w-8">{data.month}</span>
                  <div className="flex-1">
                    <div className="flex space-x-2">
                      <div className="bg-blue-200 rounded-full h-2 flex-1 max-w-32">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(data.revenue / 15000) * 100}%` }}
                        />
                      </div>
                      <div className="bg-emerald-200 rounded-full h-2 flex-1 max-w-32">
                        <div
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: `${(data.downloads / 2000) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${data.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.downloads} downloads
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Activity</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analyticsData.activeUsers}
                </div>
                <div className="text-sm text-blue-600">Active Users</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">
                  {analyticsData.newUsersThisMonth}
                </div>
                <div className="text-sm text-emerald-600">New This Month</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Recent Activity</h4>
              {analyticsData.userActivity.slice(-5).map((activity, index) => (
                <div key={activity.date} className="flex items-center justify-between py-2">
                  <div className="text-sm text-gray-600">
                    {new Date(activity.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">{activity.activeUsers}</span>
                      <span className="text-gray-500"> active</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-emerald-600">+{activity.newUsers}</span>
                      <span className="text-gray-500"> new</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Books */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Most Popular Books</h3>
          <Eye className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Book</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Author</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Downloads</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Trend</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.popularBooks.map((book, index) => (
                <tr key={book.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <div className="font-medium text-gray-900">{book.title}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{book.author}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Download className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="font-medium text-gray-900">
                        {book.downloads.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium text-gray-900">{book.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">+{Math.floor(Math.random() * 20 + 5)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};