import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import MainPage from './components/main/MainPage';
import FirestoreExample from './components/examples/FirestoreExample';
import UserEngagementExample from './components/examples/UserEngagementExample';
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import Unauthorized from './components/auth/Unauthorized';
import ChapterList from './components/admin/chapters/ChapterList';
import ChapterForm from './components/admin/chapters/ChapterForm';
import QuizList from './components/admin/quizzes/QuizList';
import QuizForm from './components/admin/quizzes/QuizForm';
import QuizListPublic from './components/quizzes/QuizListPublic';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/firestore-example" element={<FirestoreExample />} />
        <Route path="/user-engagement" element={<UserEngagementExample />} />
        <Route path="/quizzes" element={<QuizListPublic />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Admin routes - protected by AdminRoute */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            
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
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
