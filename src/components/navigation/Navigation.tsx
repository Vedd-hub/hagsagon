import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Zap, Play, Users, BarChart2, Bell, User, X, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { path: '/main', label: 'Dashboard', icon: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
  ) },
  { path: '/learn', label: 'Learn', icon: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
  ) },
  { path: '/quiz', label: 'Quiz', icon: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ) },
  { path: '/games', label: 'Games', icon: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ) },
  { path: '/leaderboard/constitution-chronicles', label: 'Leaderboard', icon: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0 0V5m0 6v.01M12 18.5a7.5 7.5 0 01-7.5-7.5H2a10 10 0 1010-10v2.5a7.5 7.5 0 010 15v2.5a10 10 0 0010-10h-2.5a7.5 7.5 0 01-7.5 7.5z" /></svg>
  ) },
  { path: '/profile', label: 'Profile', icon: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  ) },
  { path: '/community', label: 'Community', icon: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
  ) },
];

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(2); // Example badge count
  const announcementsRef = useRef<HTMLDivElement>(null);
  // Mock announcements data
  const [announcements] = useState([
    { id: 1, title: 'New Feature: Daily Quizzes', content: 'Test your knowledge with our new daily quiz feature!', date: '2025-05-18', isNew: true },
    { id: 2, title: 'Maintenance Notice', content: 'Scheduled maintenance on May 20th, 2025 from 2:00 AM to 4:00 AM IST.', date: '2025-05-17', isNew: true },
    { id: 3, title: 'Welcome to LexIQ!', content: 'Thank you for joining LexIQ. Start your learning journey today!', date: '2025-05-15', isNew: false },
  ]);

  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    handleNavClick();
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Optionally show a toast or error message
    }
  };

  const toggleAnnouncements = () => {
    setShowAnnouncements(!showAnnouncements);
    if (!showAnnouncements && unreadAnnouncements > 0) {
      setUnreadAnnouncements(0);
    }
  };

  // Prevent background scroll when sidebar is open (mobile)
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-4/5 max-w-xs md:w-64 p-5 transition-transform duration-300 ease-in-out z-50
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{ boxShadow: isSidebarOpen ? '2px 0 16px rgba(0,0,0,0.2)' : undefined }}
      >
        <div className="flex justify-between items-center mb-10 relative">
          <h1 className="text-2xl font-bold">LexIQ</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-3 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#f5e1a0]"
            aria-label="Close sidebar"
            style={{ fontSize: 28 }}
          >
            <X size={28} />
          </button>
        </div>
        <nav className="flex flex-col gap-2 px-2 mt-4 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all text-lg font-medium mobile-touch-target
                  ${isActive ? 'bg-white/10 text-[#f5e1a0]' : 'hover:bg-white/5 text-white'}`}
                style={{ minHeight: 48 }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-2 mb-4">
          <div className="h-0.5 bg-white/60"></div>
        </div>
        <div className="mb-8 px-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-4 rounded-xl text-red-500 hover:bg-red-500/10 font-semibold text-lg w-full mobile-touch-target"
            style={{ minHeight: 48 }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </div>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#f5e1a0]"
          aria-label="Open sidebar"
        >
          <Menu size={28} />
        </button>
        <div className="flex-1 flex justify-center items-center">
          <span className="font-serif text-2xl font-extrabold tracking-wide drop-shadow-lg select-none">
            <span className="text-[#f5e1a0]">L</span>
            <span className="text-white">ex</span>
            <span className="text-[#f5e1a0]">IQ</span>
          </span>
        </div>
        <div className="w-6" /> {/* Placeholder for balance */}
      </div>
    </>
  );
};

export default Navigation; 