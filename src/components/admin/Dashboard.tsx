import React, { useState, useEffect } from 'react';
import { 
  chapterService, 
  quizService, 
  lexiqService, 
  announcementService, 
  userService 
} from '../../services';
import { UserProfile } from '../../models/UserProfile';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    chapters: 0,
    quizzes: 0,
    lexiqWords: 0,
    announcements: 0,
    users: 0
  });
  const [adminUser, setAdminUser] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get current admin user
        const user = await userService.getCurrentUserProfile();
        setAdminUser(user);
        
        // Fetch counts for dashboard
        const [chapters, quizzes, words, announcements] = await Promise.all([
          chapterService.getAll(true),
          quizService.getAll(true),
          lexiqService.getAll(true),
          announcementService.getAll(true)
        ]);
        
        // Set stats
        setStats({
          chapters: chapters.length,
          quizzes: quizzes.length,
          lexiqWords: words.length,
          announcements: announcements.length,
          users: 0 // We don't have a method to get all users, would require admin SDK
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Welcome */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {adminUser?.username || 'Admin'}</h2>
        <p className="text-gray-600">
          You are logged in as an administrator with full access to manage content.
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Chapters', count: stats.chapters, color: 'bg-blue-500' },
          { label: 'Quizzes', count: stats.quizzes, color: 'bg-green-500' },
          { label: 'LexIQ Words', count: stats.lexiqWords, color: 'bg-purple-500' },
          { label: 'Announcements', count: stats.announcements, color: 'bg-yellow-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
            <div className={`${stat.color} h-2`}></div>
            <div className="p-4">
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick links */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a 
            href="/admin/chapters/new" 
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-3 px-4 rounded text-center"
          >
            Add New Chapter
          </a>
          <a 
            href="/admin/quizzes/new" 
            className="bg-green-100 hover:bg-green-200 text-green-800 py-3 px-4 rounded text-center"
          >
            Create New Quiz
          </a>
          <a 
            href="/admin/lexiq/new" 
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 py-3 px-4 rounded text-center"
          >
            Add LexIQ Word
          </a>
          <a 
            href="/admin/announcements/new" 
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 py-3 px-4 rounded text-center"
          >
            Post Announcement
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 