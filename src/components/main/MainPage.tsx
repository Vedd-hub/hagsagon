import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import gsap from 'gsap';
import LearnPageExample from '../examples/LearnPageExample';
import QuizPageExample from '../examples/QuizPageExample';
import AnnouncementPageExample from '../examples/AnnouncementPageExample';
import ProfilePageExample from '../examples/ProfilePageExample';
import CommunityPageExample from '../examples/CommunityPageExample';

const constitutionArticles = [
  {
    id: 1,
    title: 'Part I',
    subtitle: 'Union and its Territory',
    content: 'Details the territory of India, admission, establishment or formation of new States, and alteration of areas, boundaries or names of existing States.',
    image: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    title: 'Part II',
    subtitle: 'Citizenship',
    content: 'Defines who are citizens of India, provides for acquisition and termination of citizenship, and Parliament\'s power to regulate citizenship by law.',
    image: 'https://plus.unsplash.com/premium_photo-1661776608612-0441a3e00aa7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    title: 'Part III',
    subtitle: 'Fundamental Rights',
    content: 'Guarantees civil liberties such as right to equality, freedom of speech and expression, freedom of religion, right to constitutional remedies for the protection of these rights.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 4,
    title: 'Part IV',
    subtitle: 'Directive Principles',
    content: 'The Directive Principles of State Policy are guidelines to the central and state governments of India, to be kept in mind while framing laws and policies.',
    image: 'https://images.unsplash.com/photo-1533709752211-118fcaf03312?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 5,
    title: 'Article 32',
    subtitle: 'Right to Constitutional Remedies',
    content: 'Empowers citizens to approach the Supreme Court directly for the enforcement of Fundamental Rights. Dr. B.R. Ambedkar called it the "heart and soul" of the Constitution.',
    image: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 6,
    title: 'Article 21',
    subtitle: 'Right to Life and Liberty',
    content: 'No person shall be deprived of his life or personal liberty except according to procedure established by law. This has been interpreted to include various rights such as right to live with dignity.',
    image: 'https://images.unsplash.com/photo-1453945619913-79ec89a82c51?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 7,
    title: 'Preamble',
    subtitle: 'Soul of Constitution',
    content: 'The Preamble to the Constitution of India declares India to be a sovereign, socialist, secular, democratic republic, assuring its citizens justice, equality, and liberty.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 8,
    title: 'Part IVA',
    subtitle: 'Fundamental Duties',
    content: 'Added by the 42nd Amendment in 1976, these are moral obligations of all citizens to help promote a spirit of patriotism and to uphold the unity of India.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }
];

// Icons for the dashboard
const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const GameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const QuizIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CommunityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const AnnouncementIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, userData, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Debugging
    console.log("MainPage mounted, currentUser:", currentUser);
    console.log("userData:", userData);
    
    // Check if user is authenticated
    if (!currentUser && !loading) {
      console.log("No current user, redirecting to login");
      navigate('/login');
    } else {
      setLoading(false);
    }
    
    // Animate the header with GSAP
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });
    }
  }, [currentUser, loading, navigate]);
  
  // Add debugging effect to log when userData changes
  useEffect(() => {
    console.log("userData changed:", userData);
    console.log("displayName available:", userData?.displayName ? "Yes" : "No");
  }, [userData]);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Show loading state instead of redirecting immediately
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155]">
        <div className="text-center bg-white/10 backdrop-blur-md p-8 rounded-lg border border-[#f5e1a0]/20">
          <h2 className="text-2xl font-serif font-bold text-[#f5e1a0] mb-4">Loading...</h2>
          <p className="text-gray-300">Please wait while we set up your dashboard</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155]">
        <div className="text-center bg-white/10 backdrop-blur-md p-8 rounded-lg border border-[#f5e1a0]/20">
          <h2 className="text-2xl font-serif font-bold text-[#f5e1a0] mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">Please log in to access this page</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-[#f5e1a0] text-[#0F172A] rounded-lg hover:bg-opacity-90 transition-all shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Dashboard content data
  const completedChapters = 0;
  const totalChapters = 12;
  const progressPercentage = (completedChapters / totalChapters) * 100;
  
  // Display user's name from database
  const userName = userData?.displayName || (currentUser?.displayName || (currentUser.email?.split('@')[0] || 'User'));
  console.log("Rendered userName:", userName);
  
  const achievements = [
    { id: 1, name: 'First Login', icon: '🎉', earned: false },
    { id: 2, name: 'Complete Preamble', icon: '📜', earned: false },
    { id: 3, name: 'Perfect Quiz', icon: '🏆', earned: false },
    { id: 4, name: 'Fundamental Rights Master', icon: '⚖️', earned: false },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155]">
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute bottom-10 left-10 w-40 h-40 bg-[#f5e1a0]/5 rounded-full blur-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
      
      <motion.div 
        className="absolute top-20 right-20 w-60 h-60 bg-[#f5e1a0]/5 rounded-full blur-xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: 'reverse',
          delay: 1
        }}
      />

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-20 lg:w-64 bg-black/40 backdrop-blur-md text-white flex flex-col border-r border-[#f5e1a0]/20">
          <div className="p-4 flex items-center justify-center lg:justify-start font-serif">
            <span className="hidden lg:inline text-xl font-bold text-[#f5e1a0]">LexIQ</span>
            <span className="lg:hidden text-xl font-bold text-[#f5e1a0]">LQ</span>
          </div>
          
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-2 p-2">
              <li>
                <button 
                  onClick={() => setActiveSection('dashboard')}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeSection === 'dashboard' ? 'bg-[#f5e1a0]/20' : 'hover:bg-white/10'}`}
                >
                  <BookIcon />
                  <span className="ml-3 hidden lg:inline">Dashboard</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveSection('learn')}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeSection === 'learn' ? 'bg-[#f5e1a0]/20' : 'hover:bg-white/10'}`}
                >
                  <BookIcon />
                  <span className="ml-3 hidden lg:inline">Learn</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveSection('quiz')}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeSection === 'quiz' ? 'bg-[#f5e1a0]/20' : 'hover:bg-white/10'}`}
                >
                  <QuizIcon />
                  <span className="ml-3 hidden lg:inline">Quiz</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveSection('announcements')}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeSection === 'announcements' ? 'bg-[#f5e1a0]/20' : 'hover:bg-white/10'}`}
                >
                  <AnnouncementIcon />
                  <span className="ml-3 hidden lg:inline">Announcements</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveSection('games')}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeSection === 'games' ? 'bg-[#f5e1a0]/20' : 'hover:bg-white/10'}`}
                >
                  <GameIcon />
                  <span className="ml-3 hidden lg:inline">Games</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveSection('profile')}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeSection === 'profile' ? 'bg-[#f5e1a0]/20' : 'hover:bg-white/10'}`}
                >
                  <ProfileIcon />
                  <span className="ml-3 hidden lg:inline">Profile</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveSection('community')}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeSection === 'community' ? 'bg-[#f5e1a0]/20' : 'hover:bg-white/10'}`}
                >
                  <CommunityIcon />
                  <span className="ml-3 hidden lg:inline">Community</span>
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="p-4">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center p-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <LogoutIcon />
              <span className="ml-3 hidden lg:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto">
          {/* Header */}
          <div ref={headerRef} className="p-4 backdrop-blur-md bg-black/30 border-b border-[#f5e1a0]/20">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-serif font-bold text-white">
                Welcome <span className="text-[#f5e1a0]">{userName}</span>
              </h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="text-white hover:text-[#f5e1a0] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Content sections */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-[#f5e1a0]/20"
                >
                  <h2 className="text-2xl font-serif font-bold text-white mb-4">Your Progress</h2>
                  <div className="mb-2 flex justify-between">
                    <span className="text-gray-300">Completed chapters: {completedChapters}/{totalChapters}</span>
                    <span className="text-[#f5e1a0]">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full">
                    <div 
                      className="bg-[#f5e1a0] h-2 rounded-full" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-[#f5e1a0]/20"
                  >
                    <h2 className="text-2xl font-serif font-bold text-white mb-4">Recent Activity</h2>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-300">
                        <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                        <span>Completed Preamble module</span>
                        <span className="ml-auto text-xs text-gray-400">2 days ago</span>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <span className="w-3 h-3 bg-blue-400 rounded-full mr-3"></span>
                        <span>Quiz on Fundamental Rights</span>
                        <span className="ml-auto text-xs text-gray-400">5 days ago</span>
                      </li>
                      <li className="flex items-center text-gray-300">
                        <span className="w-3 h-3 bg-purple-400 rounded-full mr-3"></span>
                        <span>Started Article III</span>
                        <span className="ml-auto text-xs text-gray-400">1 week ago</span>
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-[#f5e1a0]/20"
                  >
                    <h2 className="text-2xl font-serif font-bold text-white mb-4">Achievements</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {achievements.map(achievement => (
                        <div 
                          key={achievement.id} 
                          className={`p-3 rounded-lg flex items-center ${achievement.earned ? 'bg-[#f5e1a0]/20 text-white' : 'bg-gray-700/30 text-gray-500'}`}
                        >
                          <span className="text-2xl mr-3">{achievement.icon}</span>
                          <span>{achievement.name}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-[#f5e1a0]/20"
                >
                  <h2 className="text-2xl font-serif font-bold text-white mb-4">Continue Learning</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {constitutionArticles.map(article => (
                      <div key={article.id} className="bg-black/20 border border-[#f5e1a0]/10 rounded-lg overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="w-full h-32 object-cover" 
                        />
                        <div className="p-4">
                          <h3 className="text-[#f5e1a0] font-bold">{article.title}</h3>
                          <p className="text-sm text-gray-300 mb-2">{article.subtitle}</p>
                          <p className="text-sm text-gray-400 line-clamp-2">{article.content}</p>
                          <button className="mt-3 text-xs font-medium text-[#f5e1a0] hover:underline">
                            Continue
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Learn Section */}
            {activeSection === 'learn' && (
              <LearnPageExample />
            )}

            {/* Quiz Section */}
            {activeSection === 'quiz' && (
              <QuizPageExample />
            )}

            {/* Announcements Section */}
            {activeSection === 'announcements' && (
              <AnnouncementPageExample />
            )}

            {/* Profile Section */}
            {activeSection === 'profile' && (
              <ProfilePageExample />
            )}

            {/* Community Section */}
            {activeSection === 'community' && (
              <CommunityPageExample />
            )}

            {/* Other content sections */}
            {activeSection !== 'dashboard' && 
             activeSection !== 'learn' && 
             activeSection !== 'quiz' && 
             activeSection !== 'announcements' && 
             activeSection !== 'profile' && 
             activeSection !== 'community' && (
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-[#f5e1a0]/20">
                <h2 className="text-2xl font-serif font-bold text-white mb-4">
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </h2>
                <p className="text-gray-300">
                  This section is currently under development. Check back soon for updates!
                </p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-4 text-center text-white text-sm bg-black/30 backdrop-blur-sm border-t border-[#f5e1a0]/20">
            Experience the principles of democracy with LexIQ. Explore historical documents and learn about the foundation of our nation.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage; 