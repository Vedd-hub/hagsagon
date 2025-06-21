import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  onMobileClose?: () => void;
}

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
  { path: '/announcements', label: 'Announcements', icon: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
  ), badge: 3 },
];

const Navigation: React.FC<NavigationProps> = ({ onMobileClose }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleNavClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <aside className="fixed top-0 left-0 z-[1000] flex flex-col h-screen w-64 text-white font-sans shadow-xl overflow-y-auto bg-[#1a2233]">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between h-16 px-6 border-b border-white/10">
        <div className="font-playfair text-xl font-extrabold tracking-tight" style={{ color: '#f5e1a0' }}>
          LexIQ
        </div>
        <button
          onClick={onMobileClose}
          className="text-white/70 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center h-16 px-8 mt-2 font-playfair text-2xl font-extrabold tracking-tight" style={{ color: '#f5e1a0' }}>
        LexIQ
      </div>

      <nav className="flex flex-col gap-1 px-4 mt-4">
        {navItems.map((item) => {
          const isActive = currentPath.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-lg font-medium ${
                isActive ? 'bg-white/10 text-[#f5e1a0]' : 'hover:bg-white/5 text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="flex-1"></div>
      <div className="px-4 mb-4">
        <div className="h-0.5 bg-white/60"></div>
      </div>
      <div className="mb-8 px-4">
        <Link 
          to="/logout" 
          onClick={handleNavClick}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 font-semibold text-lg"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default Navigation; 