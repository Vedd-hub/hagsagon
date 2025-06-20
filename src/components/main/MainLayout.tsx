import React from 'react';
import Navigation from '../navigation/Navigation';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => (
  <div className="min-h-screen flex font-sans" style={{ background: '#232b39' }}>
    <Navigation />
    <div className="hidden md:block w-px bg-white/10 h-screen" />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);

export default MainLayout; 