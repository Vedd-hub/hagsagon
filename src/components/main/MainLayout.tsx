import React from 'react';
import Navigation from '../navigation/Navigation';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-[#232b39]">
      {/* Navigation */}
      <Navigation />
      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default MainLayout; 