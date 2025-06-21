import React, { useState } from 'react';
import Navigation from '../navigation/Navigation';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans" style={{ background: '#232b39' }}>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-[1001]">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-[#1a2233] text-[#f5e1a0] p-3 rounded-lg shadow-lg border border-[#f5e1a0]/20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[1000] bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Navigation */}
      <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Navigation onMobileClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout; 