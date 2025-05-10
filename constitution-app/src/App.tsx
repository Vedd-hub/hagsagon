import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import MainPage from './components/main/MainPage';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
