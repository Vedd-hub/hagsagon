import React, { useState, useEffect } from 'react';
import { 
  chapterService, 
  quizService, 
  lexiqService, 
  announcementService, 
  userService 
} from '../../services';
import { UserProfile } from '../../models/UserProfile';
import { auth } from '../../firebase/config';

// Minimal SVG icons for navigation and stats
const NavIcon = ({ path, className = '' }: { path: string; className?: string }) => (
  <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={path} /></svg>
);

const navLinks = [
  { label: 'Dashboard', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6' },
  { label: 'Chapters', href: '/admin/chapters', icon: 'M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z' },
  { label: 'Quizzes', href: '/admin/quizzes', icon: 'M12 20h9' },
  { label: 'LexIQ Words', href: '/admin/lexiq', icon: 'M8 17l4 4 4-4m0-5V3a1 1 0 00-1-1H9a1 1 0 00-1 1v9m0 0l4 4 4-4' },
  { label: 'Announcements', href: '/admin/announcements', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { label: 'Settings', href: '/admin/settings', icon: 'M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' },
];

const statIcons = {
  chapters: 'M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z',
  quizzes: 'M12 20h9',
  lexiq: 'M8 17l4 4 4-4m0-5V3a1 1 0 00-1-1H9a1 1 0 00-1 1v9m0 0l4 4 4-4',
  announcements: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
};

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    chapters: 0,
    quizzes: 0,
    lexiqWords: 0,
    announcements: 0,
    users: 0
  });
  const [adminUser, setAdminUser] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState({ total: 0, today: 0 });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get current admin user
        const currentUser = auth.currentUser;
        if (currentUser) {
          const user = await userService.getUserProfile(currentUser.uid);
          setAdminUser(user);
        }
        
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

        // Fetch all users for stats
        const users = await userService.getAllUsers();
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - 1;
        const todayUsers = users.filter(u => (u.lastLogin >= start && u.lastLogin <= end) || (u.createdAt >= start && u.createdAt <= end));
        setUserStats({ total: users.length, today: todayUsers.length });
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-constitution to-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-constitution to-secondary font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur border-r border-secondary flex flex-col justify-between py-8 px-6 hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
              {adminUser?.username ? adminUser.username[0].toUpperCase() : 'A'}
            </div>
            <div>
              <div className="font-semibold text-primary text-lg">{adminUser?.username || 'Admin'}</div>
              <div className="text-xs text-gray-400">{adminUser?.email || 'admin@example.com'}</div>
            </div>
          </div>
          <nav className="flex flex-col gap-2 mt-8">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary hover:bg-primary/10 transition-colors font-medium">
                <NavIcon path={link.icon} />
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="text-xs text-gray-400 mt-10">&copy; {new Date().getFullYear()} Constitution Admin</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-4 md:px-12 py-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <a href="/admin/chapters/new" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg shadow hover:bg-primary/90 transition-colors font-semibold">
            <NavIcon path={statIcons.chapters} className="w-5 h-5" /> Add Chapter
          </a>
          <a href="/admin/quizzes/new" className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition-colors font-semibold">
            <NavIcon path={statIcons.quizzes} className="w-5 h-5" /> New Quiz
          </a>
          <a href="/admin/lexiq/new" className="inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-700 transition-colors font-semibold">
            <NavIcon path={statIcons.lexiq} className="w-5 h-5" /> Add LexIQ Word
          </a>
          <a href="/admin/announcements/new" className="inline-flex items-center gap-2 bg-yellow-500 text-white px-5 py-2 rounded-lg shadow hover:bg-yellow-600 transition-colors font-semibold">
            <NavIcon path={statIcons.announcements} className="w-5 h-5" /> Post Announcement
          </a>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <div className="bg-white/90 rounded-2xl shadow p-6 flex items-center gap-4 border-l-4 border-blue-500">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <div>
              <div className="text-3xl font-bold text-blue-500">{userStats.today}</div>
              <div className="text-gray-500 text-sm">Users Today</div>
              <div className="text-xs text-gray-400">Total: {userStats.total}</div>
            </div>
          </div>
          <div className="bg-white/90 rounded-2xl shadow p-6 flex items-center gap-4 border-l-4 border-primary">
            <NavIcon path={statIcons.chapters} className="w-8 h-8 text-primary" />
            <div>
              <div className="text-3xl font-bold text-primary">{stats.chapters}</div>
              <div className="text-gray-500 text-sm">Chapters</div>
            </div>
          </div>
          <div className="bg-white/90 rounded-2xl shadow p-6 flex items-center gap-4 border-l-4 border-green-600">
            <NavIcon path={statIcons.quizzes} className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-3xl font-bold text-green-600">{stats.quizzes}</div>
              <div className="text-gray-500 text-sm">Quizzes</div>
            </div>
          </div>
          <div className="bg-white/90 rounded-2xl shadow p-6 flex items-center gap-4 border-l-4 border-purple-600">
            <NavIcon path={statIcons.lexiq} className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-3xl font-bold text-purple-600">{stats.lexiqWords}</div>
              <div className="text-gray-500 text-sm">LexIQ Words</div>
            </div>
          </div>
          <div className="bg-white/90 rounded-2xl shadow p-6 flex items-center gap-4 border-l-4 border-yellow-500">
            <NavIcon path={statIcons.announcements} className="w-8 h-8 text-yellow-500" />
            <div>
              <div className="text-3xl font-bold text-yellow-500">{stats.announcements}</div>
              <div className="text-gray-500 text-sm">Announcements</div>
            </div>
          </div>
        </div>

        {/* Welcome Title */}
        <div className="mb-8 z-0">
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Welcome, {adminUser?.username || 'Admin'}!</h1>
          <p className="text-gray-500 text-lg">Here's a quick overview of your platform's activity and shortcuts to manage content.</p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
