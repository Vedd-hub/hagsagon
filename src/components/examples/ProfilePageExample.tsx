import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services';
import { UserProfile } from '../../models/UserProfile';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebase/config';

const ProfilePageExample: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'progress' | 'settings'>('overview');
  const [dailyNotifications, setDailyNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [profession, setProfession] = useState<string>('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(userProfile?.username || '');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [savingUsername, setSavingUsername] = useState(false);

  // Profession options
  const professionOptions = [
    'UPSC Aspirant',
    'Law Student',
    'Lawyer',
    'Teacher',
    'Professor',
    'Government Employee',
    'Civil Servant',
    'School Student',
    'College Student',
    'Researcher',
    'Journalist',
    'Professional',
    'Political Science Student',
    'History Student',
    'Other'
  ];

  useEffect(() => {
    console.log("ProfilePage: Auth state -", currentUser ? "Logged in" : "Not logged in");
    
    // Check authentication
    if (!currentUser) {
      console.log("ProfilePage: No authenticated user, redirecting to login");
      navigate('/login', { state: { from: '/profile' } });
      return;
    }
    
    const fetchUserProfile = async () => {
      if (currentUser?.uid) {
        try {
          console.log("ProfilePage: Fetching user profile for UID:", currentUser.uid);
          let profile = await userService.getUserProfile(currentUser.uid);
          
          if (!profile) {
            console.log("ProfilePage: No profile found, creating a new one");
            // Create a basic profile with ALL required fields
            const now = Date.now();
            const defaultProfile = {
              uid: currentUser.uid, // Important: Include the user ID
              username: currentUser.displayName || `User_${currentUser.uid.substring(0, 5)}`,
              email: currentUser.email || '',
              role: "user" as "user" | "admin", // Regular user role for standard users
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
            
            try {
              await userService.createUserProfile(defaultProfile);
              console.log("ProfilePage: Created new profile successfully");
              
              // Wait a moment for Firestore to update
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // Fetch the newly created profile
              profile = await userService.getUserProfile(currentUser.uid);
              console.log("ProfilePage: Loaded new profile:", profile?.username);
            } catch (createError) {
              console.error("ProfilePage: Error creating profile:", createError);
              // Try one more time with direct user service call
              try {
                console.log("ProfilePage: Trying alternative profile creation method...");
                await userService.updateUserProfile(currentUser.uid, defaultProfile);
                profile = await userService.getUserProfile(currentUser.uid);
              } catch (secondaryError) {
                console.error("ProfilePage: Secondary error creating profile:", secondaryError);
              }
            }
          } else {
            console.log("ProfilePage: Loaded existing profile:", profile.username);
          }
          
          if (profile) {
            setUserProfile(profile);
            
            // Set preferences from existing profile
            setDailyNotifications(profile.dailyNotifications ?? true);
            setSoundEffects(profile.soundEffects ?? true);
            setProfession(profile.profession || '');
          } else {
            console.error("ProfilePage: Failed to load or create profile after multiple attempts");
          }
        } catch (error) {
          console.error('ProfilePage: Error fetching user profile:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("ProfilePage: No current user UID available");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate level progress - ensure level is a number and default to 1 if not
  const safeLevel = userProfile && typeof userProfile.level === 'number' ? userProfile.level : 1;
  const levelProgress = (safeLevel % 1) * 100;
  
  // Get badge level based on count
  const getBadgeLevel = (count: number) => {
    if (count >= 20) return 'Legendary';
    if (count >= 15) return 'Master';
    if (count >= 10) return 'Expert';
    if (count >= 5) return 'Advanced';
    if (count >= 1) return 'Beginner';
    return 'None';
  };

  // Defensive: fallback to empty arrays if undefined
  const badges = userProfile?.badges ?? [];
  const chaptersCompleted = userProfile?.chaptersCompleted ?? [];

  // Mock achievements data
  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first chapter', icon: '🎯', earned: chaptersCompleted.length > 0 },
    { id: 2, name: 'Quiz Master', description: 'Score 100% on a quiz', icon: '🏆', earned: false },
    { id: 3, name: 'Dedicated Learner', description: 'Maintain a 7-day streak', icon: '🔥', earned: userProfile?.dailyQuizStreak ? userProfile.dailyQuizStreak >= 7 : false },
    { id: 4, name: 'Constitution Expert', description: 'Complete all chapters', icon: '📚', earned: false },
    { id: 5, name: 'Badge Collector', description: 'Earn 5 different badges', icon: '🏅', earned: badges.length >= 5 },
    { id: 6, name: 'Word Wizard', description: 'Achieve a LexIQ score of 400', icon: '🧠', earned: userProfile?.lexIQScore ? userProfile.lexIQScore >= 400 : false },
    { id: 7, name: 'Regular Player', description: 'Play 30 games', icon: '🎮', earned: userProfile?.gamesPlayed ? userProfile.gamesPlayed >= 30 : false },
    { id: 8, name: 'Early Adopter', description: 'Create an account in the first month', icon: '⏱️', earned: false },
  ];

  // Recent activity data
  const recentActivities = chaptersCompleted.slice(0, 3).map((chapter, index) => ({
    id: index,
    type: 'chapter',
    name: `Completed ${chapter}`,
    date: new Date(Date.now() - (index * 86400000)).toLocaleDateString(), // Mock dates
  }));

  // Toggle handlers
  const handleToggleDailyNotifications = async () => {
    const newValue = !dailyNotifications;
    setDailyNotifications(newValue);
    if (userProfile) {
      await userService.updateUserProfile(userProfile.uid, { dailyNotifications: newValue });
    }
  };
  const handleToggleSoundEffects = async () => {
    const newValue = !soundEffects;
    setSoundEffects(newValue);
    if (userProfile) {
      await userService.updateUserProfile(userProfile.uid, { soundEffects: newValue });
    }
  };

  // Handle profession change
  const handleProfessionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProfession = e.target.value;
    setProfession(newProfession);
    if (userProfile) {
      await userService.updateUserProfile(userProfile.uid, { profession: newProfession });
    }
  };

  // Handle edit username
  const handleEditUsername = () => {
    setNewUsername(userProfile?.username || '');
    setEditingUsername(true);
    setUsernameError(null);
  };
  const handleCancelEditUsername = () => {
    setEditingUsername(false);
    setUsernameError(null);
  };
  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      setUsernameError('Username cannot be empty');
      return;
    }
    if (newUsername.length < 3) {
      setUsernameError('Username must be at least 3 characters long');
      return;
    }
    if (!userProfile) return; // Guard clause to prevent null access
    setSavingUsername(true);
    try {
      await userService.updateUserProfile(userProfile.uid, { username: newUsername });
      setEditingUsername(false);
      setUsernameError(null);
      setUserProfile({ ...userProfile, username: newUsername });
    } catch (err) {
      setUsernameError('Failed to update username');
    } finally {
      setSavingUsername(false);
    }
  };

  // Handle various states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block w-10 h-10 border-4 border-[#f5e1a0]/30 border-t-[#f5e1a0] rounded-full animate-spin"></div>
        <span className="ml-3 text-white">Loading profile...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-white p-8">
        <h2 className="text-2xl font-bold mb-4">Error Loading Profile</h2>
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
        <p className="mb-4">Please log in to view your profile.</p>
        <Link 
          to="/login"
          className="px-4 py-2 bg-[#f5e1a0] text-[#0F172A] rounded hover:bg-[#f5e1a0]/80 transition-colors inline-block"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center text-white p-8">
        <h2 className="text-2xl font-bold mb-4">Profile Not Available</h2>
        <p className="mb-4">We couldn't load your profile information.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#f5e1a0] text-[#0F172A] rounded hover:bg-[#f5e1a0]/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-[#f5e1a0]/20"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#f5e1a0] to-[#f5e1a0]/50 flex items-center justify-center text-4xl border-4 border-[#f5e1a0]/30">
                {userProfile.username ? userProfile.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#f5e1a0] text-[#0F172A] rounded-full px-2 py-1 text-xs font-bold">
                Lvl {Math.floor(safeLevel)}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-serif font-bold text-white mb-2">{userProfile.username}</h2>
              {profession && (
                <div className="mb-3">
                  <span className="bg-[#f5e1a0]/20 px-3 py-1 rounded-full text-[#f5e1a0] text-sm">
                    {profession}
                  </span>
                </div>
              )}
              <p className="text-gray-400 mb-4">{userProfile.email || 'No email provided'}</p>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <div className="px-3 py-1 bg-[#f5e1a0]/20 rounded-full text-[#f5e1a0] text-sm flex items-center">
                  <span className="mr-1">🔥</span> {userProfile.dailyQuizStreak} day streak
                </div>
                <div className="px-3 py-1 bg-[#f5e1a0]/20 rounded-full text-[#f5e1a0] text-sm flex items-center">
                  <span className="mr-1">🏆</span> {badges.length} badges
                </div>
                <div className="px-3 py-1 bg-[#f5e1a0]/20 rounded-full text-[#f5e1a0] text-sm flex items-center">
                  <span className="mr-1">📚</span> {chaptersCompleted.length} chapters
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tab navigation */}
      <div className="mb-6 flex border-b border-[#f5e1a0]/20">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-[#f5e1a0] text-[#f5e1a0]'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`py-3 px-5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'achievements'
              ? 'border-[#f5e1a0] text-[#f5e1a0]'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Achievements
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`py-3 px-5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'progress'
              ? 'border-[#f5e1a0] text-[#f5e1a0]'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Progress
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'settings'
              ? 'border-[#f5e1a0] text-[#f5e1a0]'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Tab content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === 'overview' && (
          <>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 bg-white/10 backdrop-blur-md p-6 rounded-lg border border-[#f5e1a0]/20"
            >
              <h3 className="text-xl font-serif font-bold text-white mb-6">Your Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Current Level</div>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-white">{Math.floor(safeLevel)}</span>
                    <span className="text-[#f5e1a0] ml-2 mb-1">
                      {levelProgress.toFixed(0)}% to next
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-700 h-1 rounded-full">
                    <div
                      className="bg-[#f5e1a0] h-1 rounded-full"
                      style={{ width: `${levelProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Daily Streak</div>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-white">{userProfile.dailyQuizStreak}</span>
                    <span className="text-2xl ml-2">🔥</span>
                  </div>
                  <div className="mt-2 text-gray-400 text-sm">
                    {userProfile.dailyQuizStreak > 0
                      ? 'Keep it going!'
                      : 'Start your streak today!'}
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Badge Status</div>
                  <div className="text-2xl font-bold text-white">{getBadgeLevel(badges.length)}</div>
                  <div className="mt-2 text-gray-400 text-sm">
                    {badges.length} badges collected
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Games Played</div>
                  <div className="text-3xl font-bold text-white">{userProfile.gamesPlayed}</div>
                  <div className="mt-2 text-gray-400 text-sm">
                    Interactive learning games
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Chapters Completed</div>
                  <div className="text-3xl font-bold text-white">{chaptersCompleted.length}</div>
                  <div className="mt-2 text-gray-400 text-sm">
                    Learning modules finished
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-[#f5e1a0]/20"
            >
              <h3 className="text-xl font-serif font-bold text-white mb-6">Recent Activity</h3>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="bg-black/30 p-3 rounded-lg">
                      <div className="flex items-center">
                        <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                        <span className="text-gray-300">{activity.name}</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-400 ml-6">
                        {activity.date}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No recent activity to show.
                </div>
              )}
              
              <div className="mt-4 text-center">
                <button className="px-4 py-2 text-sm bg-[#f5e1a0]/20 text-[#f5e1a0] rounded hover:bg-[#f5e1a0]/30 transition-colors">
                  View All Activity
                </button>
              </div>
            </motion.div>
          </>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 bg-white/10 backdrop-blur-md p-6 rounded-lg border border-[#f5e1a0]/20"
          >
            <h3 className="text-xl font-serif font-bold text-white mb-6">Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg ${
                    achievement.earned
                      ? 'bg-[#f5e1a0]/20 text-white'
                      : 'bg-black/30 text-gray-500'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-3xl mr-3">{achievement.icon}</span>
                    <div>
                      <div className={achievement.earned ? 'text-white' : 'text-gray-500'}>
                        {achievement.name}
                      </div>
                      <div className="text-xs text-gray-400">{achievement.description}</div>
                    </div>
                  </div>
                  {achievement.earned ? (
                    <div className="mt-2 text-xs text-[#f5e1a0]">Achieved</div>
                  ) : (
                    <div className="mt-2 text-xs text-gray-500">Locked</div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'progress' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 bg-white/10 backdrop-blur-md p-6 rounded-lg border border-[#f5e1a0]/20"
          >
            <h3 className="text-xl font-serif font-bold text-white mb-6">Learning Progress</h3>
            
            <div className="mb-8">
              <h4 className="text-lg text-white mb-3">Badges Earned</h4>
              <div className="flex flex-wrap gap-3">
                {badges.length > 0 ? (
                  badges.map((badge, index) => (
                    <div
                      key={index}
                      className="bg-[#f5e1a0]/20 text-[#f5e1a0] px-3 py-2 rounded-lg flex items-center"
                    >
                      <span role="img" aria-label="badge" className="mr-2">
                        {badge === 'novice' ? '🥉' :
                         badge === 'intermediate' ? '🥈' :
                         badge === 'expert' ? '🥇' :
                         badge === 'master' ? '👑' : '🏅'}
                      </span>
                      {badge.charAt(0).toUpperCase() + badge.slice(1)}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">No badges earned yet.</div>
                )}
              </div>
            </div>
            
            <div className="mb-8">
              <h4 className="text-lg text-white mb-3">Completed Chapters</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {chaptersCompleted.length > 0 ? (
                  chaptersCompleted.map((chapter, index) => (
                    <div
                      key={index}
                      className="bg-black/30 p-3 rounded-lg text-white flex items-center"
                    >
                      <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                      <span>{chapter.charAt(0).toUpperCase() + chapter.slice(1)}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">No chapters completed yet.</div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg text-white mb-3">Stats Over Time</h4>
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-center text-gray-400 py-8">
                  Progress charts coming soon
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 bg-white/10 backdrop-blur-md p-6 rounded-lg border border-[#f5e1a0]/20"
          >
            <h3 className="text-xl font-serif font-bold text-white mb-6">Account Settings</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg text-white mb-4">Profile Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Username</label>
                    {editingUsername ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={newUsername}
                          onChange={e => setNewUsername(e.target.value)}
                          className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-[#f5e1a0]/50 focus:outline-none"
                          disabled={savingUsername}
                        />
                        <button
                          onClick={handleSaveUsername}
                          className="px-3 py-2 bg-[#f5e1a0] text-[#232b39] rounded font-bold hover:bg-[#ffe08a] transition-colors text-sm"
                          disabled={savingUsername}
                        >
                          {savingUsername ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancelEditUsername}
                          className="px-3 py-2 bg-gray-700 text-white rounded font-bold hover:bg-gray-600 transition-colors text-sm"
                          disabled={savingUsername}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={userProfile.username}
                          readOnly
                          className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-[#f5e1a0]/50 focus:outline-none"
                        />
                        <button
                          onClick={handleEditUsername}
                          className="px-3 py-2 bg-[#f5e1a0]/20 text-[#f5e1a0] rounded hover:bg-[#f5e1a0]/30 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                    {usernameError && <div className="text-red-400 text-xs mt-1">{usernameError}</div>}
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Email</label>
                    <input
                      type="email"
                      value={userProfile.email || ''}
                      readOnly
                      className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-[#f5e1a0]/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Your Role/Profession</label>
                    <select
                      value={profession}
                      onChange={handleProfessionChange}
                      className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-[#f5e1a0]/50 focus:outline-none"
                      style={{ color: 'white' }}
                    >
                      <option value="" style={{ backgroundColor: '#1E293B', color: 'white' }}>Select your role</option>
                      {professionOptions.map((option) => (
                        <option key={option} value={option} style={{ backgroundColor: '#1E293B', color: 'white' }}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="pt-4">
                    <button className="px-4 py-2 bg-[#f5e1a0]/20 text-[#f5e1a0] rounded hover:bg-[#f5e1a0]/30 transition-colors text-sm font-medium">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg text-white mb-4">Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-black/30 border border-gray-700 rounded-lg p-3">
                    <div>
                      <div className="text-white">Daily Notifications</div>
                      <div className="text-sm text-gray-400">Get reminders for daily quizzes</div>
                    </div>
                    <button onClick={handleToggleDailyNotifications} className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors duration-200 ${dailyNotifications ? 'bg-[#f5e1a0]/50 justify-end' : 'bg-gray-700 justify-start'}`}> <span className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${dailyNotifications ? '' : ''}`}></span> </button>
                  </div>
                  
                  <div className="flex items-center justify-between bg-black/30 border border-gray-700 rounded-lg p-3">
                    <div>
                      <div className="text-white">Sound Effects</div>
                      <div className="text-sm text-gray-400">Play sounds on achievements</div>
                    </div>
                    <button onClick={handleToggleSoundEffects} className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors duration-200 ${soundEffects ? 'bg-[#f5e1a0]/50 justify-end' : 'bg-gray-700 justify-start'}`}> <span className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${soundEffects ? '' : ''}`}></span> </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h4 className="text-lg text-white mb-4">Account Actions</h4>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-[#f5e1a0]/20 text-[#f5e1a0] rounded hover:bg-[#f5e1a0]/30 transition-colors text-sm font-medium">
                  Change Password
                </button>
                <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors text-sm font-medium">
                  Deactivate Account
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePageExample; 