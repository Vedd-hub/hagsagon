import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services';
import { UserProfile } from '../../models/UserProfile';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';

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
  const [activeTab, setActiveTab] = useState<'chat' | 'leaderboard'>('chat');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [users] = useState(mockUsers); // Remove unnecessary useState calls

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, authLoading, navigate]);
  
  // Simplified profile loading
  useEffect(() => {
    let mounted = true;
    
    const fetchUserProfile = async () => {
      if (!currentUser?.uid || !mounted) return;
      
      try {
        const profile = await userService.getUserProfile(currentUser.uid);
        
        if (!profile && mounted) {
          // Create basic profile
          const newProfile = {
            username: currentUser.displayName || `User_${currentUser.uid.substring(0, 5)}`,
            email: currentUser.email || '',
            level: 1,
            badges: [],
            chaptersCompleted: [],
            dailyQuizStreak: 0,
            gamesPlayed: 0,
            lexIQScore: 0,
            lastLogin: Date.now()
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
  
  // Simplified loading state
  if (authLoading || (loading && currentUser)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="inline-block w-10 h-10 border-4 border-[#f5e1a0]/30 border-t-[#f5e1a0] rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Don't show auth required message, we'll redirect instead
  if (!currentUser) {
    return <div className="text-center p-4">Redirecting to login...</div>;
  }

  // Wait for profile
  if (!userProfile) {
    return <div className="text-center p-4">Setting up your profile...</div>;
  }

  // Simplified UI rendering with fewer animations for better performance
  return (
    <div className="container mx-auto p-4">
      {/* Tab navigation */}
      <div className="mb-6 flex border-b border-[#f5e1a0]/20">
        <button
          onClick={() => setActiveTab('chat')}
          className={`py-3 px-5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'chat'
              ? 'border-[#f5e1a0] text-[#f5e1a0]'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Community Chat
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`py-3 px-5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'leaderboard'
              ? 'border-[#f5e1a0] text-[#f5e1a0]'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Leaderboard
        </button>
      </div>
      
      {/* Chat Tab - Optimized */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-[#f5e1a0]/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif font-bold text-white">Community Chat</h2>
                <div className="text-sm text-gray-400">Share your achievements</div>
              </div>
              
              {/* Post new message */}
              <form onSubmit={handleSendMessage} className="mb-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 bg-[#f5e1a0]/50 rounded-full flex items-center justify-center text-lg">
                    {(userProfile?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Share an achievement or start a discussion..."
                      className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-[#f5e1a0]/50 focus:outline-none min-h-[80px]"
                      disabled={posting}
                    />
                    {error && (
                      <div className="text-red-500 text-sm mt-2">
                        {error}
                      </div>
                    )}
                    <div className="flex justify-between mt-2">
                      <div className="text-sm text-gray-400">
                        Share achievements!
                      </div>
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || posting}
                        className={`px-4 py-2 bg-[#f5e1a0]/20 text-[#f5e1a0] rounded hover:bg-[#f5e1a0]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          posting ? 'animate-pulse' : ''
                        }`}
                      >
                        {posting ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              
              {/* Message list - simplified */}
              <div className="space-y-4">
                {messagesLoading ? (
                  <div className="text-center py-4">
                    <div className="inline-block w-6 h-6 border-2 border-[#f5e1a0]/30 border-t-[#f5e1a0] rounded-full animate-spin mb-2"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-4 text-gray-400">
                    <p>No messages yet. Be the first!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="bg-black/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div 
                          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg"
                          style={{ backgroundColor: message.avatarColor + '80' }}
                        >
                          {message.username ? message.username.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <div className="font-medium text-white">{message.username}</div>
                            <div className="text-xs text-gray-400">{formatMessageTime(message.timestamp)}</div>
                          </div>
                          <div className="text-gray-300 mt-1 mb-3">{message.text}</div>
                          <div className="flex justify-between">
                            <button 
                              onClick={() => handleLikeMessage(message.id)}
                              className={`text-sm ${
                                message.likedBy?.includes(currentUser?.uid || '') 
                                  ? 'text-[#f5e1a0]' 
                                  : 'text-gray-400 hover:text-[#f5e1a0]'
                              } transition-colors flex items-center`}
                            >
                              <span className="mr-1">❤️</span> {message.likes} likes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar - lazy loaded */}
          <div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-[#f5e1a0]/20 mb-4">
              <h3 className="text-lg font-serif font-bold text-white mb-3">Your Badges</h3>
              <div className="flex flex-wrap mb-3">
                {userProfile.badges && userProfile.badges.length > 0 ? (
                  userProfile.badges.slice(0, 5).map((badge, index) => (
                    <BadgeDisplay key={index} badgeName={badge} size="sm" />
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">Complete challenges to earn badges!</p>
                )}
              </div>
            </div>
            
            {/* Community members - only show a few for performance */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-[#f5e1a0]/20">
              <h3 className="text-lg font-serif font-bold text-white mb-3">Community</h3>
              <div className="space-y-2">
                {users.slice(0, 3).map((user) => (
                  <div key={user.id} className="flex items-center gap-2 p-2 hover:bg-black/20 rounded-lg">
                    <div 
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: user.avatarColor + '80' }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="text-white text-sm font-medium truncate">{user.username}</div>
                      <div className="text-[#f5e1a0] text-xs">Level {user.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Leaderboard Tab - Simplified */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-[#f5e1a0]/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif font-bold text-white">Leaderboard</h2>
            <div className="text-sm text-gray-400">Top community members</div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="py-3 px-4 text-gray-400">Rank</th>
                  <th className="py-3 px-4 text-gray-400">User</th>
                  <th className="py-3 px-4 text-gray-400">Level</th>
                  <th className="py-3 px-4 text-gray-400">Badges</th>
                </tr>
              </thead>
              <tbody>
                {[...users].sort((a, b) => b.level - a.level).map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-800 hover:bg-black/20">
                    <td className="py-3 px-4 text-gray-300">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800">
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full mr-3 flex items-center justify-center"
                          style={{ backgroundColor: user.avatarColor + '80' }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{user.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[#f5e1a0] font-bold">Level {user.level}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap">
                        {user.badges.slice(0, 3).map((badge, badgeIndex) => (
                          <BadgeDisplay key={badgeIndex} badgeName={badge} size="sm" />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPageExample; 