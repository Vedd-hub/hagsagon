import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services';
import { UserProfile } from '../../models/UserProfile';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { useNavigate, Link } from 'react-router-dom';

// Performance optimization - reduce mock data size
const mockUsers = [
  {
    id: 'user1',
    username: 'ConstitutionExpert',
    badges: ['novice', 'intermediate', 'expert'],
    level: 15,
    profession: 'UPSC Aspirant',
    avatarColor: '#4f46e5'
  },
  {
    id: 'user2',
    username: 'LegalEagle',
    badges: ['novice', 'intermediate', 'master'],
    level: 23,
    profession: 'Law Student',
    avatarColor: '#16a34a'
  },
  {
    id: 'user3',
    username: 'HistoryBuff',
    badges: ['novice', 'intermediate'],
    level: 8,
    profession: 'History Student',
    avatarColor: '#ea580c'
  }
];

const mockMessages = [
  {
    id: 'msg1',
    userId: 'user2',
    username: 'LegalEagle',
    text: 'Just earned the Expert badge on Article 21! So happy with my progress.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    likes: 3,
    avatarColor: '#16a34a'
  },
  {
    id: 'msg2',
    userId: 'user4',
    username: 'RightsCrusader',
    text: 'Anyone want to discuss the recent amendments? I just completed a quiz on this topic.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    likes: 7,
    avatarColor: '#8b5cf6'
  },
  {
    id: 'msg3',
    userId: 'user1',
    username: 'ConstitutionExpert',
    text: 'Reached level 15 today! The fundamental rights quiz was challenging but worth it.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    likes: 12,
    avatarColor: '#4f46e5'
  },
  {
    id: 'msg4',
    userId: 'user5',
    username: 'PreambleScholar',
    text: 'I\'m new here! Just starting my journey to learn about the constitution. Any tips?',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    likes: 5,
    avatarColor: '#ec4899'
  }
];

interface Message {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: any;
  likes: number;
  avatarColor: string;
  likedBy?: string[];
}

// Simple Badge component for better performance
const BadgeDisplay: React.FC<{badgeName: string, size?: 'sm' | 'md' | 'lg'}> = ({ badgeName, size = 'md' }) => {
  const getBadgeIcon = (name: string) => {
    switch (name) {
      case 'novice': return '🥉';
      case 'intermediate': return '🥈';
      case 'expert': return '🥇';
      case 'master': return '👑';
      default: return '🏅';
    }
  };
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };
  
  return (
    <span className={`bg-[#f5e1a0]/20 ${sizeClasses[size]} rounded-full text-[#f5e1a0] inline-flex items-center mr-1 mb-1`}>
      <span className="mr-1">{getBadgeIcon(badgeName)}</span>
      {badgeName.charAt(0).toUpperCase() + badgeName.slice(1)}
    </span>
  );
};

const CommunityPageExample: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users] = useState(mockUsers);

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log("CommunityPage: Auth state -", currentUser ? "Logged in" : "Not logged in");
    
    if (!authLoading && !currentUser) {
      console.log("CommunityPage: No authenticated user, redirecting to login");
      navigate('/login', { state: { from: '/community' } });
    }
  }, [currentUser, authLoading, navigate]);
  
  // Simplified profile loading
  useEffect(() => {
    let mounted = true;
    
    const fetchUserProfile = async () => {
      if (!currentUser?.uid || !mounted) return;
      
      try {
        console.log("CommunityPage: Fetching user profile for UID:", currentUser.uid);
        const profile = await userService.getUserProfile(currentUser.uid);
        
        if (!profile && mounted) {
          console.log("CommunityPage: No profile found, creating a new one");
          // Create basic profile with ALL required fields
          const now = Date.now();
          const newProfile = {
            uid: currentUser.uid,
            username: currentUser.displayName || `User_${currentUser.uid.substring(0, 5)}`,
            email: currentUser.email || '',
            role: "user" as "user" | "admin",
            level: 1,
            badges: [],
            chaptersCompleted: [],
            dailyQuizStreak: 0,
            gamesPlayed: 0,
            lexIQScore: 0,
            lastLogin: now,
            createdAt: now,
            updatedAt: now,
            dailyNotifications: true,
            soundEffects: true,
            profession: ''
          };
          
          await userService.createUserProfile(newProfile);
          const createdProfile = await userService.getUserProfile(currentUser.uid);
          if (mounted) setUserProfile(createdProfile);
        } else if (mounted) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    if (currentUser?.uid) {
      fetchUserProfile();
    } else if (!authLoading) {
      setLoading(false);
    }
    
    return () => { mounted = false; };
  }, [currentUser, authLoading]);

  // Optimized message loading with cleanup
  useEffect(() => {
    if (!currentUser) return;
    
    let mounted = true;
    let unsubscribe: () => void;
    
    setMessagesLoading(true);
    
    const setupMessagesListener = async () => {
      try {
        // Set up real-time listener with limit for better performance
        const messagesQuery = query(
          collection(db, 'community_messages'),
          orderBy('timestamp', 'desc'),
          limit(10) // Reduced limit for faster loading
        );

        unsubscribe = onSnapshot(
          messagesQuery, 
          (snapshot) => {
            if (!mounted) return;
            
            const newMessages = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Message[];
            
            setMessages(newMessages);
            setMessagesLoading(false);
          },
          (error) => {
            console.error("Error in messages snapshot listener:", error);
            if (mounted) setMessagesLoading(false);
          }
        );
      } catch (error) {
        console.error("Error setting up messages listener:", error);
        if (mounted) setMessagesLoading(false);
      }
    };
    
    setupMessagesListener();
    
    return () => { 
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);
  
  // Format message time - optimized
  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    
    try {
      const messageDate = timestamp.toDate();
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
      
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffMinutes < 24 * 60) return `${Math.floor(diffMinutes / 60)}h ago`;
      return messageDate.toLocaleDateString();
    } catch (error) {
      return 'Unknown time';
    }
  };
  
  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userProfile || !currentUser) return;
    
    setPosting(true);
    setError(null);
    
    try {
      const username = userProfile.username || 
                       currentUser.displayName || 
                       `User_${currentUser.uid.substring(0, 5)}`;
                       
      const messageData = {
        userId: currentUser.uid,
        username: username,
        text: newMessage.trim(),
        timestamp: serverTimestamp(),
        likes: 0,
        avatarColor: '#f5e1a0',
        likedBy: []
      };
      
      await addDoc(collection(db, 'community_messages'), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to post message. Please try again.');
    } finally {
      setPosting(false);
    }
  };
  
  // Handle liking a message
  const handleLikeMessage = async (messageId: string) => {
    if (!currentUser) return;
    
    try {
      const messageRef = doc(db, 'community_messages', messageId);
      const message = messages.find(m => m.id === messageId);
      
      if (!message) return;
      
      const likedBy = message.likedBy || [];
      const hasLiked = likedBy.includes(currentUser.uid);
      
      const newLikedBy = hasLiked 
        ? likedBy.filter(id => id !== currentUser.uid)
        : [...likedBy, currentUser.uid];
      
      await updateDoc(messageRef, {
        likes: hasLiked ? message.likes - 1 : message.likes + 1,
        likedBy: newLikedBy
      });
    } catch (error) {
      console.error('Error liking message:', error);
    }
  };
  
  // Handle various states
  if (authLoading || (loading && currentUser)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="inline-block w-10 h-10 border-4 border-[#f5e1a0]/30 border-t-[#f5e1a0] rounded-full animate-spin"></div>
        <span className="ml-3 text-white">Loading community...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-white p-8">
        <h2 className="text-2xl font-bold mb-4">Error Loading Community</h2>
        <p className="mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#f5e1a0] text-[#0F172A] rounded hover:bg-[#f5e1a0]/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center text-white p-8">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="mb-4">Please log in to access the community.</p>
        <Link 
          to="/login"
          className="px-4 py-2 bg-[#f5e1a0] text-[#0F172A] rounded hover:bg-[#f5e1a0]/80 transition-colors inline-block"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  // Wait for profile
  if (!userProfile) {
    // Provide a robust fallback profile to prevent UI breakage
    const fallbackProfile = {
      uid: currentUser?.uid || 'unknown',
      username: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User',
      email: currentUser?.email || '',
      role: 'user' as 'user',
      level: 1,
      badges: [],
      chaptersCompleted: [],
      dailyQuizStreak: 0,
      gamesPlayed: 0,
      lexIQScore: 0,
      lastLogin: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      dailyNotifications: true,
      soundEffects: true,
      profession: ''
    };
    setUserProfile(fallbackProfile);
    return (
      <div className="text-center text-white p-8">
        <h2 className="text-2xl font-bold mb-4">Setting Up Your Profile</h2>
        <p className="mb-4">Please wait while we prepare your community experience...</p>
        <div className="inline-block w-8 h-8 border-4 border-[#f5e1a0]/30 border-t-[#f5e1a0] rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#181e26] via-[#232b39] to-[#1a2233] py-8 px-2 md:px-4">
      <div className="w-full max-w-6xl h-[90vh] flex gap-4 md:gap-6">
        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-md border border-[#f5e1a0]/20 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#f5e1a0]/20">
            <h1 className="text-2xl font-bold font-playfair text-[#f5e1a0]">Community Hub</h1>
          </div>
          
          <div className="flex-1 flex flex-col p-4 overflow-y-auto">
              {/* Chat Feed */}
              <div className="space-y-4">
                {messagesLoading ? (
                  <div className="text-center py-10 text-[#f5e1a0]">Loading messages...</div>
                ) : (
                  messages.map(message => (
                    <div key={message.id} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg" style={{ backgroundColor: message.avatarColor }}>
                        {message.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-[#f5e1a0]">{message.username}</span>
                          <span className="text-xs text-white/50">{formatMessageTime(message.timestamp)}</span>
                        </div>
                        <p className="text-white/90 mt-1">{message.text}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <button onClick={() => handleLikeMessage(message.id)} className="flex items-center gap-1 text-sm text-white/60 hover:text-[#f5e1a0] transition-colors">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 18.75l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg>
                            <span>{message.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-[#f5e1a0]/20">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={currentUser ? "Share your progress..." : "Login to chat"}
                disabled={!currentUser || posting}
                className="flex-1 bg-white/10 border border-[#f5e1a0]/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#f5e1a0]"
              />
              <button
                type="submit"
                disabled={!currentUser || posting || !newMessage.trim()}
                className="bg-[#f5e1a0] text-[#1a2233] font-bold px-6 py-2 rounded-lg hover:bg-[#e2d8c0] transition-colors disabled:opacity-50"
              >
                {posting ? '...' : 'Post'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/3 hidden lg:flex flex-col gap-4">
          {/* Current User Card */}
          <div className="bg-black/40 backdrop-blur-md border border-[#f5e1a0]/20 rounded-2xl shadow-lg p-4 flex flex-col items-center text-center">
            {loading ? (
              <div className="py-10 text-white/80">Loading profile...</div>
            ) : userProfile ? (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#667eea] to-[#764ba2] flex items-center justify-center font-bold text-white text-4xl mb-3 border-2 border-white/20">
                  {userProfile.username.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-[#f5e1a0]">{userProfile.username}</h2>
                <p className="text-sm text-white/60 mb-2">{userProfile.profession || 'Constitutional Enthusiast'}</p>
                <div className="text-lg text-white font-semibold">Level {userProfile.level || 1}</div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-1 mb-3">
                  <div className="bg-[#f5e1a0] h-1.5 rounded-full" style={{ width: `${(userProfile.level % 10) * 10}%` }}></div>
                </div>
                <div className="flex flex-wrap justify-center">
                  {userProfile.badges && userProfile.badges.length > 0 ? (
                    userProfile.badges.map(badge => <BadgeDisplay key={badge} badgeName={badge} size="sm" />)
                  ) : (
                    <p className="text-xs text-white/50">No badges yet. Play games to earn them!</p>
                  )}
                </div>
              </>
            ) : (
              <div className="py-10 text-red-500">Could not load profile.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPageExample; 