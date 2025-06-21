import React, { useState, useEffect, ReactNode } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { userService } from '../../services';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebase/config';

interface AdminRouteProps {
  children: ReactNode;
}

// Component to protect admin routes
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const checkAdminStatus = React.useCallback(async (authUser: User | null) => {
    console.group('AdminRoute: checkAdminStatus');
    try {
      setLoading(true);
      setError(null);
      
      if (!authUser) {
        console.log('No authenticated user, redirecting to login');
        navigate('/login', { state: { from: location.pathname } });
        return false;
      }
      
      console.log('User authenticated with UID:', authUser.uid, 'Email:', authUser.email);
      
      try {
        // Force refresh the user token to ensure we have the latest claims
        console.log('Refreshing ID token...');
        const tokenResult = await auth.currentUser?.getIdTokenResult(true);
        console.log('Token claims:', tokenResult?.claims);
        
        console.log('Checking admin status...');
        const hasAdminAccess = await userService.isCurrentUserAdmin();
        console.log('Admin check result:', hasAdminAccess);
        
        if (!hasAdminAccess) {
          console.warn('User does not have admin access');
          navigate('/unauthorized', { replace: true });
          return false;
        }
        
        console.log('User has admin access');
        setIsAdmin(true);
        return true;
      } catch (error) {
        console.error('Error during admin check:', error);
        setError('An error occurred while checking permissions');
        navigate('/error', { 
          state: { 
            error: 'Failed to verify admin status',
            details: error instanceof Error ? error.message : String(error)
          },
          replace: true 
        });
        return false;
      }
    } finally {
      console.groupEnd();
      setLoading(false);
    }
  }, [navigate, location.pathname]);
  
  useEffect(() => {
    console.log('AdminRoute: Initializing auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed, user:', user?.uid || 'none');
      await checkAdminStatus(user);
    });
    
    // Cleanup subscription on unmount
    return () => {
      console.log('AdminRoute: Cleaning up auth listener');
      unsubscribe();
    };
  }, [checkAdminStatus]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Checking Permissions</h2>
          <p className="text-gray-600">Please wait while we verify your access...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return isAdmin ? <>{children}</> : <Navigate to="/unauthorized" replace />;
};

export default AdminRoute; 