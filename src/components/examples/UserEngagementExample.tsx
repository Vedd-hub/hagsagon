import React, { useState, useEffect } from 'react';
import { userService } from '../../services';
import { auth } from '../../firebase/config';
import { UserProfile } from '../../models/UserProfile';
import { onAuthStateChanged } from 'firebase/auth';

const UserEngagementExample: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in and load profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          let userProfile = await userService.getUserProfile(authUser.uid);
          
          // If user profile doesn't exist, create one
          if (!userProfile) {
            await userService.createUserProfile({
              username: authUser.displayName || 'User'
            });
            userProfile = await userService.getUserProfile(authUser.uid);
          }
          
          // Update last login
          await userService.updateLastLogin(authUser.uid);
          
          setUser(userProfile);
        } catch (err) {
          console.error("Error loading user profile:", err);
          setError("Failed to load user profile");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Simulated engagement actions
  const handleLevelUp = async () => {
    if (!user) return;
    
    try {
      await userService.incrementLevel(user.uid);
      // Refresh user data
      const updated = await userService.getUserProfile(user.uid);
      setUser(updated);
    } catch (err) {
      console.error("Error updating level:", err);
      setError("Failed to update level");
    }
  };
  
  const handleAddBadge = async () => {
    if (!user) return;
    
    try {
      const badges = ["novice", "intermediate", "expert", "master"];
      const randomBadge = badges[Math.floor(Math.random() * badges.length)];
      
      await userService.addBadge(user.uid, randomBadge);
      // Refresh user data
      const updated = await userService.getUserProfile(user.uid);
      setUser(updated);
    } catch (err) {
      console.error("Error adding badge:", err);
      setError("Failed to add badge");
    }
  };
  
  const handleCompleteChapter = async () => {
    if (!user) return;
    
    try {
      const chapters = ["chapter1", "chapter2", "chapter3", "chapter4"];
      const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
      
      await userService.addCompletedChapter(user.uid, randomChapter);
      // Refresh user data
      const updated = await userService.getUserProfile(user.uid);
      setUser(updated);
    } catch (err) {
      console.error("Error completing chapter:", err);
      setError("Failed to complete chapter");
    }
  };
  
  const handlePlayGame = async () => {
    if (!user) return;
    
    try {
      await userService.incrementGamesPlayed(user.uid);
      // Refresh user data
      const updated = await userService.getUserProfile(user.uid);
      setUser(updated);
    } catch (err) {
      console.error("Error updating games played:", err);
      setError("Failed to update games played");
    }
  };
  
  const handleUpdateLexIQ = async () => {
    if (!user) return;
    
    try {
      const newScore = Math.floor(Math.random() * 500);
      await userService.updateLexIQScore(user.uid, newScore);
      // Refresh user data
      const updated = await userService.getUserProfile(user.uid);
      setUser(updated);
    } catch (err) {
      console.error("Error updating LexIQ score:", err);
      setError("Failed to update LexIQ score");
    }
  };
  
  const handleDailyStreak = async () => {
    if (!user) return;
    
    try {
      await userService.incrementDailyQuizStreak(user.uid);
      // Refresh user data
      const updated = await userService.getUserProfile(user.uid);
      setUser(updated);
    } catch (err) {
      console.error("Error updating daily streak:", err);
      setError("Failed to update daily streak");
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading user data...</div>;
  }
  
  if (!user) {
    return <div className="container mx-auto p-4">Please log in to see user engagement data.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Engagement Tracking</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p><span className="font-semibold">Username:</span> {user.username}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Level:</span> {user.level}</p>
            <p><span className="font-semibold">LexIQ Score:</span> {user.lexIQScore}</p>
            <p><span className="font-semibold">Daily Quiz Streak:</span> {user.dailyQuizStreak}</p>
          </div>
          <div>
            <p><span className="font-semibold">Games Played:</span> {user.gamesPlayed}</p>
            <p><span className="font-semibold">Last Login:</span> {new Date(user.lastLogin).toLocaleString()}</p>
            <p><span className="font-semibold">Created:</span> {new Date(user.createdAt).toLocaleString()}</p>
            <p><span className="font-semibold">Updated:</span> {new Date(user.updatedAt).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Badges</h3>
          {user.badges.length === 0 ? (
            <p>No badges yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Completed Chapters</h3>
          {user.chaptersCompleted.length === 0 ? (
            <p>No chapters completed yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.chaptersCompleted.map((chapter, index) => (
                <span 
                  key={index} 
                  className="bg-green-100 text-green-800 px-2 py-1 rounded"
                >
                  {chapter}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Simulate User Engagement</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button 
            onClick={handleLevelUp}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Level Up
          </button>
          <button 
            onClick={handleAddBadge}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Earn Badge
          </button>
          <button 
            onClick={handleCompleteChapter}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Complete Chapter
          </button>
          <button 
            onClick={handlePlayGame}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Play Game
          </button>
          <button 
            onClick={handleUpdateLexIQ}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Update LexIQ
          </button>
          <button 
            onClick={handleDailyStreak}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Daily Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEngagementExample; 