import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import MainPage from './components/main/MainPage';
import FirestoreExample from './components/examples/FirestoreExample';
import UserEngagementExample from './components/examples/UserEngagementExample';
import ProfilePageExample from './components/examples/ProfilePageExample';
import CommunityPageExample from './components/examples/CommunityPageExample';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/admin/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ChapterList from './components/admin/chapters/ChapterList';
import ChapterForm from './components/admin/chapters/ChapterForm';
import QuizList from './components/admin/quizzes/QuizList';
import QuizForm from './components/admin/quizzes/QuizForm';
import QuizListPublic from './components/quizzes/QuizListPublic';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ErrorPage from './pages/ErrorPage';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

// Simple 404 Not Found component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md w-full mx-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <div className="space-y-3">
        <button 
          onClick={() => window.history.back()}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/firestore-example" element={<FirestoreExample />} />
            <Route path="/user-engagement" element={<UserEngagementExample />} />
            <Route path="/quizzes" element={<QuizListPublic />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePageExample /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><CommunityPageExample /></ProtectedRoute>} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/error" element={<ErrorPage />} />
            
            {/* Admin routes - protected by AdminRoute */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboard />} />
              
              {/* Chapters */}
              <Route path="chapters">
                <Route index element={<ChapterList />} />
                <Route path="new" element={<ChapterForm />} />
                <Route path=":id" element={<ChapterForm />} />
              </Route>
              
              {/* Quizzes */}
              <Route path="quizzes">
                <Route index element={<QuizList />} />
                <Route path="new" element={<QuizForm />} />
                <Route path=":id" element={<QuizForm />} />
              </Route>
              
              {/* LexIQ Words */}
              <Route path="lexiq">
                <Route index element={<div>LexIQ Words List</div>} />
                <Route path="new" element={<div>New LexIQ Word Form</div>} />
                <Route path=":id" element={<div>Edit LexIQ Word Form</div>} />
              </Route>
              
              {/* Announcements */}
              <Route path="announcements">
                <Route index element={<div>Announcements List</div>} />
                <Route path="new" element={<div>New Announcement Form</div>} />
                <Route path=":id" element={<div>Edit Announcement Form</div>} />
              </Route>
              
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
