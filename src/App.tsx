import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BadgeProvider } from './contexts/BadgeContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/main/MainLayout';
import MainPage from './components/main/MainPage';
import LearnPageExample from './components/examples/LearnPageExample';
import QuizPageExample from './components/examples/QuizPageExample';
import GamesPage from './components/games/GamesPage';
import ConstitutionChronicles from './components/games/ConstitutionChronicles';
import Leaderboard from './components/leaderboard/Leaderboard';
import CommunityPageExample from './components/examples/CommunityPageExample';
import ProfilePageExample from './components/examples/ProfilePageExample';
import AnnouncementPageExample from './components/examples/AnnouncementPageExample';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute from './components/admin/AdminRoute';
import ErrorPage from './pages/ErrorPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Game Components
import ArticleHunt from './components/games/ArticleHunt';
import LexIQWordGame from './components/games/LexIQWordGame';
import TimelineChallenge from './components/games/TimelineChallenge';

// Admin Page Components
import ChapterList from './components/admin/chapters/ChapterList';
import ChapterForm from './components/admin/chapters/ChapterForm';
import QuizList from './components/admin/quizzes/QuizList';
import QuizForm from './components/admin/quizzes/QuizForm';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BadgeProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/404" element={<ErrorPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes inside Main Layout */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/main" element={<MainPage />} />
            <Route path="/learn" element={<LearnPageExample />} />
            <Route path="/quiz" element={<QuizPageExample />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games/article-hunt" element={<ArticleHunt />} />
            <Route path="/games/lexiq-word" element={<LexIQWordGame />} />
            <Route path="/games/timeline-challenge" element={<TimelineChallenge />} />
            <Route path="/games/constitution-chronicles" element={<ConstitutionChronicles />} />
            <Route path="/leaderboard/:gameId" element={<Leaderboard />} />
            <Route path="/community" element={<CommunityPageExample />} />
            <Route path="/profile" element={<ProfilePageExample />} />
            <Route path="/announcements" element={<AnnouncementPageExample />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/chapters" element={<AdminRoute><ChapterList /></AdminRoute>} />
          <Route path="/admin/chapters/:id" element={<AdminRoute><ChapterForm /></AdminRoute>} />
          <Route path="/admin/chapters/new" element={<AdminRoute><ChapterForm /></AdminRoute>} />
          <Route path="/admin/quizzes" element={<AdminRoute><QuizList /></AdminRoute>} />
          <Route path="/admin/quizzes/:id" element={<AdminRoute><QuizForm /></AdminRoute>} />
          <Route path="/admin/quizzes/new" element={<AdminRoute><QuizForm /></AdminRoute>} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BadgeProvider>
    </AuthProvider>
  );
};

export default App;
