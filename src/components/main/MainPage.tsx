import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import QuizListPublic from '../quizzes/QuizListPublic';

const Gold = '#f5e1a0';
const CardBg = 'bg-black/40 backdrop-blur-md';
const CardBorder = 'border border-[#f5e1a0]/20';
const CardShadow = 'shadow-lg';
const CardRadius = 'rounded-2xl';
const CardPad = 'p-6';
const CardHover = 'hover:bg-white/10 hover:border-[#f5e1a0]/40 transition-all';
const SectionTitle = `text-xl font-bold text-[${Gold}] mb-4 tracking-tight`;
const SectionSub = 'text-gray-400 text-sm';
const Button = `px-5 py-2 bg-[${Gold}] text-[#0F172A] rounded-lg font-semibold shadow hover:bg-opacity-90 transition-all`;
const IconCircle = `inline-flex items-center justify-center w-10 h-10 rounded-full bg-[${Gold}]/10 text-[${Gold}] border border-[${Gold}]/30`;

const BookIcon = () => (
  <span className={IconCircle}>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={Gold}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  </span>
);
const QuizIcon = () => (
  <span className={IconCircle}>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={Gold}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  </span>
);
const GameIcon = () => (
  <span className={IconCircle}>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={Gold}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </span>
);
const CommunityIcon = () => (
  <span className={IconCircle}>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={Gold}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  </span>
);
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={Gold}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const constitutionArticles = [
  {
    id: 1,
    title: 'Article 14jhblhvbljawfn: Right to Equality',
    subtitle: 'Equality before law and equal protection of laws'
  },
  {
    id: 2,
    title: 'Article 19: Freedom of Speech',
    subtitle: 'Protection of certain rights regarding freedom of speech, etc.'
  },
  {
    id: 3,
    title: 'Article 21: Right to Life',
    subtitle: 'Protection of life and personal liberty'
  }
];

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  isNew: boolean;
}

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userData, loading: authLoading, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(3);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const announcementsRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const [announcements] = useState<Announcement[]>([
    { id: 1, title: 'New Feature: Daily Quizzes', content: 'Test your knowledge with our new daily quiz feature!', date: '2025-05-18', isNew: true },
    { id: 2, title: 'Maintenance Notice', content: 'Scheduled maintenance on May 20th, 2025 from 2:00 AM to 4:00 AM IST.', date: '2025-05-17', isNew: true },
    { id: 3, title: 'Welcome to LexIQ!', content: 'Thank you for joining LexIQ. Start your learning journey today!', date: '2025-05-15', isNew: false },
  ]);

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        navigate('/login');
      } else {
        setLoading(false);
      }
    }
  }, [currentUser, authLoading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleAnnouncements = () => {
    setShowAnnouncements(!showAnnouncements);
    if (!showAnnouncements && unreadAnnouncements > 0) {
      setUnreadAnnouncements(0);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155]">
        <div className={`${CardBg} ${CardBorder} ${CardShadow} ${CardRadius} p-8 text-center`}>
          <h2 className="text-3xl font-serif font-bold text-[${Gold}] mb-4">Loading...</h2>
          <p className="text-gray-300">Please wait while we set up your dashboard</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155]">
        <div className={`${CardBg} ${CardBorder} ${CardShadow} ${CardRadius} p-8 text-center`}>
          <h2 className="text-3xl font-serif font-bold text-[${Gold}] mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">Please log in to access this page</p>
          <button onClick={() => navigate('/login')} className={Button}>Go to Login</button>
        </div>
      </div>
    );
  }

  const completedChapters = 0;
  const totalChapters = 12;
  const progressPercentage = (completedChapters / totalChapters) * 100;
  const userName = userData?.displayName || currentUser?.displayName || currentUser.email?.split('@')[0] || 'User';
  const achievements = [
    { id: 1, name: 'First Login', icon: '🎉', earned: false },
    { id: 2, name: 'Complete Preamble', icon: '📜', earned: false },
    { id: 3, name: 'Perfect Quiz', icon: '🏆', earned: false },
    { id: 4, name: 'Fundamental Rights Master', icon: '⚖️', earned: false },
  ];
  const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(userName)}`;

  return (
    <div className="min-h-screen font-sans" style={{
      background: '#232b39',
    }}>
      {/* Welcome Bar - responsive positioning */}
      {!(location.pathname === '/quiz' || location.pathname.startsWith('/quiz/')) && (
        <div className="fixed top-0 left-0 md:left-64 right-0 z-10 h-16 flex items-center px-4 md:px-8" style={{background: '#1a2233', borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
          <div className="flex justify-between items-center w-full h-full">
            <div className="flex items-center gap-4">
              <img src={avatarUrl} alt="User avatar" className="w-10 h-10 rounded-full border-2 border-[#f5e1a0]/60 shadow" />
              <div className="flex flex-col justify-center">
                <span className="text-white text-base md:text-lg font-semibold leading-tight">Welcome, <span className="text-[#f5e1a0] font-bold">{userName}</span></span>
                <span className="text-xs md:text-sm text-white/60 mt-0.5">Glad to see you back!</span>
              </div>
            </div>
            {/* Bell icon for announcements */}
            <div className="relative ml-4">
              <button
                onClick={toggleAnnouncements}
                className="relative p-2 text-white hover:text-[#f5e1a0] transition-colors rounded-full hover:bg-white/10"
                aria-label="Announcements"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#f5e1a0">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadAnnouncements > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadAnnouncements}
                  </span>
                )}
              </button>
              {/* Announcements Dropdown */}
              {showAnnouncements && (
                <div ref={announcementsRef} className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                  <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Announcements</h3>
                    <button
                      onClick={() => setShowAnnouncements(false)}
                      className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                      aria-label="Close announcements"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  {announcements.length > 0 ? (
                    <ul className="divide-y divide-gray-700">
                      {announcements.map((announcement) => (
                        <li key={announcement.id} className="p-3 hover:bg-gray-700 transition-colors">
                          <div className="flex items-start">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-white">{announcement.title}</h4>
                                {announcement.isNew && (
                                  <span className="inline-block h-2 w-2 bg-red-500 rounded-full ml-2"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-300 mt-1">{announcement.content}</p>
                              <span className="text-xs text-gray-400 mt-1 block">{new Date(announcement.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      No announcements yet
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <main className="flex-1 pt-0 px-4 md:px-6 lg:px-10 pb-4 md:pb-10 bg-transparent max-w-6xl mx-auto w-full mt-16">
        {location.pathname === '/quiz' ? (
          <QuizListPublic />
        ) : (
          <>
            {/* Top Divider Line */}
            <div className="w-full h-px bg-white/10 mb-4 md:mb-6" />
            {/* Progress Bar (full width) */}
            <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 shadow flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 md:mb-8 border border-white/10 w-full">
              <div className="flex-1 w-full">
                <div className="text-base md:text-lg font-serif font-extrabold text-white mb-2">Your Progress</div>
                <div className="text-sm md:text-base text-white/70 mb-2">Completed chapters: {completedChapters}/{totalChapters}</div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-[#f5e1a0] h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col items-end min-w-[60px] md:min-w-[70px]">
                <span className="text-xl md:text-2xl font-serif font-extrabold text-[#f5e1a0] leading-none">{Math.round(progressPercentage)}%</span>
              </div>
            </div>
            {/* Cards Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-10">
              {/* Recent Activity */}
              <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 shadow border border-white/10 flex flex-col justify-between min-h-[200px] md:min-h-[220px]">
                <h2 className="text-xl md:text-2xl font-serif font-extrabold text-white mb-4 tracking-tight">Recent Activity</h2>
                <ul className="space-y-2 text-sm md:text-base font-normal">
                  <li className="flex items-center justify-between text-white/90"><span><span className="inline-block w-2 md:w-3 h-2 md:h-3 bg-green-400 rounded-full mr-2"></span>Completed Preamble module</span><span className="text-xs text-white/50">2 days ago</span></li>
                  <li className="flex items-center justify-between text-white/90"><span><span className="inline-block w-2 md:w-3 h-2 md:h-3 bg-blue-400 rounded-full mr-2"></span>Quiz on Fundamental Rights</span><span className="text-xs text-white/50">5 days ago</span></li>
                  <li className="flex items-center justify-between text-white/90"><span><span className="inline-block w-2 md:w-3 h-2 md:h-3 bg-purple-400 rounded-full mr-2"></span>Started Article III</span><span className="text-xs text-white/50">1 week ago</span></li>
                </ul>
              </div>
              {/* Achievements */}
              <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 shadow border border-white/10 flex flex-col justify-between min-h-[200px] md:min-h-[220px]">
                <h2 className="text-xl md:text-2xl font-serif font-extrabold text-white mb-4 tracking-tight">Achievements</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="flex items-center gap-2 text-white/80 text-base md:text-lg font-serif font-semibold opacity-70"><span className="text-xl md:text-2xl">🎉</span> First Login</div>
                  <div className="flex items-center gap-2 text-white/80 text-base md:text-lg font-serif font-semibold opacity-70"><span className="text-xl md:text-2xl">📄</span> Complete Preamble</div>
                  <div className="flex items-center gap-2 text-white/80 text-base md:text-lg font-serif font-semibold opacity-70"><span className="text-xl md:text-2xl">🏆</span> Perfect Quiz</div>
                  <div className="flex items-center gap-2 text-white/80 text-base md:text-lg font-serif font-semibold opacity-70"><span className="text-xl md:text-2xl">⚖️</span> Fundamental Rights Master</div>
                </div>
              </div>
            </div>
            {/* Continue Learning */}
            <div className="mt-8 md:mt-10">
              <h2 className="text-xl md:text-2xl font-serif font-extrabold text-white mb-4 tracking-tight">Continue Learning</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white/10 rounded-xl md:rounded-2xl overflow-hidden shadow flex flex-col">
                  <img src="https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80" alt="Union and its Territory" className="h-24 md:h-32 w-full object-cover" />
                  <div className="p-3 md:p-4 text-white font-serif font-semibold text-base md:text-lg">Part I: The Union and its Territory</div>
                </div>
                <div className="bg-white/10 rounded-xl md:rounded-2xl overflow-hidden shadow flex flex-col">
                  <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" alt="Citizenship" className="h-24 md:h-32 w-full object-cover" />
                  <div className="p-3 md:p-4 text-white font-serif font-semibold text-base md:text-lg">Part II: Citizenship</div>
                </div>
                <div className="bg-white/10 rounded-xl md:rounded-2xl overflow-hidden shadow flex flex-col sm:col-span-2 lg:col-span-1">
                  <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="Fundamental Rights" className="h-24 md:h-32 w-full object-cover" />
                  <div className="p-3 md:p-4 text-white font-serif font-semibold text-base md:text-lg">Part III: Fundamental Rights</div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MainPage; 