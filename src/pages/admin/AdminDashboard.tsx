import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email || '');
      } else {
        navigate('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {userEmail}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">1,234</p>
            <p className="mt-2 text-sm text-gray-500">+12% from last month</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Active Today</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">456</p>
            <p className="mt-2 text-sm text-gray-500">+8% from yesterday</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Avg. Session</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">4m 32s</p>
            <p className="mt-2 text-sm text-gray-500">+2% from last week</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/chapters')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h3 className="font-medium text-gray-900">Manage Chapters</h3>
              <p className="text-sm text-gray-500 mt-1">Add, edit, or remove learning chapters</p>
            </button>

            <button
              onClick={() => navigate('/admin/quizzes')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h3 className="font-medium text-gray-900">Manage Quizzes</h3>
              <p className="text-sm text-gray-500 mt-1">Create and edit quiz questions</p>
            </button>

            <button
              onClick={() => navigate('/admin/announcements')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h3 className="font-medium text-gray-900">Post Announcement</h3>
              <p className="text-sm text-gray-500 mt-1">Share updates with all users</p>
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                    {item}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">New user registered</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
