import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { userService } from '../../services';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';

// Component to protect admin routes
const AdminRoute: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        if (authUser) {
          const hasAdminAccess = await userService.isCurrentUserAdmin();
          setIsAdmin(hasAdminAccess);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Checking permissions...</p>
        </div>
      </div>
    );
  }
  
  return isAdmin ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default AdminRoute; 