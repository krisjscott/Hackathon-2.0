import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  Clock, 
  BookmarkCheck,
  FileText,
  MapPin,
  Calendar,
  ChevronRight
} from 'lucide-react';

const UserDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('searches');

  // Mock data - in a real app, this would come from an API
  const savedSearches = [
    {
      id: 1,
      criteria: {
        propertyId: 'PROP123456',
        area: 'Urban',
        date: '2025-05-15'
      }
    },
    {
      id: 2,
      criteria: {
        registrationNumber: 'REG789012',
        area: 'Rural',
        date: '2025-05-14'
      }
    }
  ];

  const recentSearches = [
    {
      id: 1,
      propertyId: 'PROP345678',
      address: '123 Main Street, New Delhi',
      date: '2025-05-15 14:30'
    },
    {
      id: 2,
      propertyId: 'PROP901234',
      address: 'Plot 45, Industrial Area, Mumbai',
      date: '2025-05-15 12:15'
    },
    {
      id: 3,
      propertyId: 'PROP567890',
      address: 'Village Ambala, Punjab',
      date: '2025-05-14 16:45'
    }
  ];

  const notifications = [
    {
      id: 1,
      type: 'info',
      message: 'Your saved search "Delhi Properties" has new matches',
      date: '2025-05-15 10:30'
    },
    {
      id: 2,
      type: 'update',
      message: 'Property PROP123456 details have been updated',
      date: '2025-05-14 15:45'
    },
    {
      id: 3,
      type: 'alert',
      message: 'Your search alert for "Mumbai Commercial" will expire soon',
      date: '2025-05-14 09:15'
    }
  ];

  return (
    <div className="fade-in py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <User size={32} className="text-primary-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {t('dashboard.welcome', { name: 'John Doe' })}
                  </h1>
                  <p className="text-gray-600">Last login: Today at 10:30 AM</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="btn btn-outline flex items-center">
                  <Settings size={18} className="mr-2" />
                  {t('dashboard.settings')}
                </button>
                <button className="btn btn-primary flex items-center">
                  <Search size={18} className="mr-2" />
                  New Search
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('searches')}
                  className={`px-6 py-4 text-sm font-medium flex items-center ${
                    activeTab === 'searches'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Search size={18} className="mr-2" />
                  Recent & Saved Searches
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`px-6 py-4 text-sm font-medium flex items-center ${
                    activeTab === 'notifications'
                      ? 'border-b-2 border-primary-600 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Bell size={18} className="mr-2" />
                  Notifications
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'searches' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Saved Searches */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <BookmarkCheck size={20} className="mr-2 text-primary-600" />
                        {t('dashboard.savedSearches')}
                      </h2>
                      <button className="text-sm text-primary-600 hover:text-primary-800">
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {savedSearches.map(search => (
                        <div 
                          key={search.id}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-800">
                                {search.criteria.propertyId || search.criteria.registrationNumber}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Area: {search.criteria.area}
                              </p>
                              <p className="text-sm text-gray-500">
                                Saved on {search.criteria.date}
                              </p>
                            </div>
                            <button className="text-primary-600 hover:text-primary-800">
                              <ChevronRight size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Searches */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Clock size={20} className="mr-2 text-primary-600" />
                        {t('dashboard.recentSearches')}
                      </h2>
                      <button className="text-sm text-primary-600 hover:text-primary-800">
                        Clear History
                      </button>
                    </div>
                    <div className="space-y-4">
                      {recentSearches.map(search => (
                        <div 
                          key={search.id}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-800 flex items-center">
                                <FileText size={16} className="mr-2 text-primary-600" />
                                {search.propertyId}
                              </h3>
                              <p className="text-sm text-gray-600 flex items-center mt-1">
                                <MapPin size={14} className="mr-1" />
                                {search.address}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <Calendar size={14} className="mr-1" />
                                {search.date}
                              </p>
                            </div>
                            <button className="text-primary-600 hover:text-primary-800">
                              <ChevronRight size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Bell size={20} className="mr-2 text-primary-600" />
                      {t('dashboard.notifications')}
                    </h2>
                    <button className="text-sm text-primary-600 hover:text-primary-800">
                      Mark All as Read
                    </button>
                  </div>
                  <div className="space-y-4">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full mr-4 ${
                            notification.type === 'info' 
                              ? 'bg-blue-100 text-blue-600'
                              : notification.type === 'update'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {notification.type === 'info' && <Bell size={20} />}
                            {notification.type === 'update' && <FileText size={20} />}
                            {notification.type === 'alert' && <Clock size={20} />}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800">{notification.message}</p>
                            <p className="text-sm text-gray-500 mt-1">{notification.date}</p>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Searches</p>
                  <h3 className="text-2xl font-bold text-gray-800">24</h3>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <Search size={24} className="text-primary-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Saved Properties</p>
                  <h3 className="text-2xl font-bold text-gray-800">8</h3>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <BookmarkCheck size={24} className="text-primary-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">↑ 3 new this week</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Alerts</p>
                  <h3 className="text-2xl font-bold text-gray-800">5</h3>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <Bell size={24} className="text-primary-600" />
                </div>
              </div>
              <p className="text-sm text-yellow-600 mt-2">2 updates pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;