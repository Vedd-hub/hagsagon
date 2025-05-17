import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services';
import { auth } from '../../firebase/config';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        console.log("ProtectedRoute: Checking profile for user", currentUser.uid);
        const profile = await userService.getUserProfile(currentUser.uid);
        
        if (!profile) {
          console.log("ProtectedRoute: No profile found, creating one");
          // Create a basic profile with ALL required fields
          const now = Date.now();
          const defaultProfile = {
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
          
          await userService.createUserProfile(defaultProfile);
          console.log("ProtectedRoute: Profile created successfully");
          setHasProfile(true);
        } else {
          console.log("ProtectedRoute: Profile found");
          setHasProfile(true);
        }
      } catch (error) {
        console.error("ProtectedRoute: Error checking/creating profile:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserProfile();
  }, [currentUser]);

  if (loading) {
    // Loading state
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155]">
        <div className="text-center bg-white/10 backdrop-blur-md p-8 rounded-lg border border-[#f5e1a0]/20">
          <div className="inline-block w-10 h-10 border-4 border-[#f5e1a0]/30 border-t-[#f5e1a0] rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-semibold text-[#f5e1a0] mb-2">Setting Up Your Profile</h2>
          <p className="text-gray-300">Please wait while we prepare your experience...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Render children if authenticated and profile exists
  return <>{children}</>;
};

export default ProtectedRoute;
