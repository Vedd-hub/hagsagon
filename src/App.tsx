import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Eagerly load critical components
import LandingPage from './components/landing/LandingPage';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import MainLayout from './components/main/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorPage from './pages/ErrorPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import QuizListPublic from './components/quizzes/QuizListPublic';
import ProfilePageExample from './components/examples/ProfilePageExample';
import CommunityPageExample from './components/examples/CommunityPageExample';
import Leaderboard from './components/leaderboard/Leaderboard';

// Lazy load feature components
const MainPage = lazy(() => import('./components/main/MainPage'));
const GamesPage = lazy(() => import('./components/games/GamesPage'));
const LexIQWordGame = lazy(() => import('./components/games/LexIQWordGame'));
const ConstitutionChronicles = lazy(() => import('./components/games/ConstitutionChronicles'));
const TimelineChallenge = lazy(() => import('./components/games/TimelineChallenge'));
const WhoSaidIt = lazy(() => import('./components/games/WhoSaidIt'));
const ArticleHunt = lazy(() => import('./components/games/ArticleHunt'));
const ChaptersPage = lazy(() => import('./pages/ChaptersPage'));

// Lazy load battle components
const BattleLobby = lazy(() => import('./components/battle/BattleLobby'));
const BattleRoom = lazy(() => import('./components/battle/BattleRoom'));
const BattleLayout = lazy(() => import('./components/battle/BattleLayout'));

// Lazy load admin components
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ChapterList = lazy(() => import('./components/admin/chapters/ChapterList'));
const ChapterForm = lazy(() => import('./components/admin/chapters/ChapterForm'));
const QuizList = lazy(() => import('./components/admin/quizzes/QuizList'));
const QuizForm = lazy(() => import('./components/admin/quizzes/QuizForm'));

// Simple placeholder for missing pages
const Placeholder = ({ label }: { label: string }) => <div style={{ color: '#fff', padding: 40, fontSize: 32 }}>Coming soon: {label}</div>;

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/main" element={<MainPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/games/lex-iq" element={<LexIQWordGame />} />
            <Route path="/games/constitution-chronicles" element={<ConstitutionChronicles />} />
            <Route path="/games/timeline-challenge" element={<TimelineChallenge />} />
            <Route path="/games/who-said-it" element={<WhoSaidIt />} />
            <Route path="/games/article-hunt" element={<ArticleHunt />} />
            <Route path="/learn" element={<ChaptersPage />} />

            {/* Battle Routes */}
            <Route 
              path="/battle" 
              element={<Navigate to="/main" replace />} 
            />
            <Route 
              path="/battle/:battleId" 
              element={
                <BattleLayout>
                  <BattleRoom />
                </BattleLayout>
              } 
            />
            <Route path="/profile" element={<ProfilePageExample />} />
            <Route path="/community" element={<CommunityPageExample />} />
            <Route path="/leaderboard/constitution-chronicles" element={<Leaderboard />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="chapters" element={<ChapterList />} />
            <Route path="chapters/new" element={<ChapterForm />} />
            <Route path="chapters/edit/:id" element={<ChapterForm />} />
            <Route path="quizzes" element={<QuizList />} />
            <Route path="quizzes/new" element={<QuizForm />} />
            <Route path="quizzes/edit/:id" element={<QuizForm />} />
          </Route>

          <Route path="/quizzes" element={<QuizListPublic />} />
          <Route path="/quiz" element={<Navigate to="/quizzes" replace />} />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
