import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { auth } from '../../firebase/config';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Navigation items for admin sidebar
  const navItems = [
    { to: '/admin', label: 'Dashboard', exact: true },
    { to: '/admin/chapters', label: 'Chapters' },
    { to: '/admin/quizzes', label: 'Quizzes' },
    { to: '/admin/lexiq', label: 'LexIQ Words' },
    { to: '/admin/announcements', label: 'Announcements' },
  ];
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
        </div>
        
        <div className="py-4">
          <nav>
            <ul>
              {navItems.map((item, index) => {
                const isActive = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);
                  
                return (
                  <li key={index}>
                    <Link
                      to={item.to}
                      className={`block px-4 py-2 text-sm ${
                        isActive
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 border-t p-4">
          <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 mb-2">
            Back to App
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-200"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {navItems.find(item => 
                item.exact 
                  ? location.pathname === item.to 
                  : location.pathname.startsWith(item.to)
              )?.label || 'Admin Panel'}
            </h1>
          </div>
        </header>
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 