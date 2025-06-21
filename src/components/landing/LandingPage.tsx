import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConstitutionScene from './ConstitutionScene';
import { Link } from 'react-router-dom';
import CustomCursor from './CustomCursor';

const LandingPage: React.FC = () => {
  const [showContent, setShowContent] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Show content after the 3D animation has had time to play
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden" style={{ cursor: 'none' }}>
      <CustomCursor />
      {/* Background 3D scene */}
      <ConstitutionScene />

      {/* Content overlays */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {/* Top navigation */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center"
        >
          <div className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide flex items-center">
            <span className="text-[#f5e1a0]">L</span>
            <span className="text-white">ex</span>
            <span className="text-[#f5e1a0]">IQ</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 text-white">
            <button className="hover:text-[#f5e1a0] transition-all">About</button>
            <button className="hover:text-[#f5e1a0] transition-all">Features</button>
            <button className="hover:text-[#f5e1a0] transition-all">Contact</button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-[#f5e1a0] transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </motion.div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-[#0F172A]/90 backdrop-blur-md border-b border-[#f5e1a0]/20 md:hidden"
          >
            <div className="flex flex-col space-y-2 p-4">
              <button className="text-white hover:text-[#f5e1a0] transition-all text-left py-2">About</button>
              <button className="text-white hover:text-[#f5e1a0] transition-all text-left py-2">Features</button>
              <button className="text-white hover:text-[#f5e1a0] transition-all text-left py-2">Contact</button>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="w-full h-full flex flex-col md:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ 
              opacity: showContent ? 1 : 0, 
              x: showContent ? 0 : -50 
            }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full md:w-1/2 p-6 md:p-8 lg:p-16 flex flex-col justify-center"
          >
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight font-serif">
              Discover the <span className="text-[#f5e1a0]">Constitution</span> in a New Light
            </h1>
            <p className="text-gray-300 text-base md:text-lg lg:text-xl mb-8 md:mb-12 max-w-2xl">
              An immersive exploration of democratic principles that shaped our nation, brought to life through interactive technology.
            </p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 md:gap-4"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: showContent ? 1 : 0,
              }}
              transition={{ duration: 0.7, delay: 1.2 }}
            >
              <Link to="/login">
                <button className="w-full sm:w-auto py-3 px-6 md:px-8 bg-[#f5e1a0] text-[#0F172A] rounded-md font-medium hover:bg-opacity-90 transition-all shadow-lg hover:shadow-[#f5e1a0]/20">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="w-full sm:w-auto py-3 px-6 md:px-8 bg-transparent text-[#f5e1a0] border border-[#f5e1a0] rounded-md font-medium hover:bg-[#f5e1a0]/10 transition-all">
                  Sign Up
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right side - constitution-themed illustration and quote */}
          <div className="hidden md:flex w-1/2 items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 40 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-col items-center"
            >
              {/* Parchment/Quill SVG Illustration */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
                className="mb-6"
              >
                <svg width="150" height="150" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="lg:w-[180px] lg:h-[180px]">
                  <rect x="20" y="40" width="140" height="100" rx="18" fill="#f5e1a0" stroke="#bfa77a" strokeWidth="4"/>
                  <rect x="30" y="50" width="120" height="80" rx="12" fill="#fffbe6" stroke="#e2d8c0" strokeWidth="2"/>
                  <path d="M50 70 Q90 90 130 70" stroke="#bfa77a" strokeWidth="2" fill="none"/>
                  <path d="M50 90 Q90 110 130 90" stroke="#bfa77a" strokeWidth="2" fill="none"/>
                  <path d="M50 110 Q90 130 130 110" stroke="#bfa77a" strokeWidth="2" fill="none"/>
                  <g>
                    <rect x="120" y="120" width="30" height="8" rx="4" fill="#C19A6B"/>
                    <rect x="140" y="122" width="8" height="20" rx="4" fill="#C19A6B"/>
                    <ellipse cx="144" cy="142" rx="6" ry="4" fill="#C19A6B" fillOpacity="0.7"/>
                  </g>
                </svg>
              </motion.div>
              {/* Famous Constitution Quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{ duration: 1, delay: 1.3 }}
                className="bg-white/70 backdrop-blur-md border-l-4 border-[#f5e1a0] px-4 md:px-6 py-3 md:py-4 rounded-lg shadow-md max-w-xs text-center"
              >
                <span className="italic text-base md:text-lg text-[#0F172A] font-serif">
                  "We the People of India, in Order to form a more perfect Union..."
                </span>
                <div className="mt-2 text-xs text-[#bfa77a] font-semibold">— Preamble, Indian Constitution</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <motion.div 
        className="absolute bottom-10 left-5 md:left-10 w-20 md:w-40 h-20 md:h-40 bg-[#f5e1a0]/5 rounded-full blur-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
      
      <motion.div 
        className="absolute top-20 right-5 md:right-20 w-30 md:w-60 h-30 md:h-60 bg-[#f5e1a0]/5 rounded-full blur-xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: 'reverse',
          delay: 1
        }}
      />

      {/* Bottom info bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 0.9 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-0 left-0 right-0 bg-[#0F172A]/80 backdrop-blur-sm p-3 md:p-4 text-center text-white text-xs md:text-sm border-t border-[#f5e1a0]/20"
      >
        Experience the principles of democracy with our interactive platform. Explore historical documents and learn about the foundation of our nation.
      </motion.div>
    </div>
  );
};

export default LandingPage; 