import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const QuillIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
    <path d="M40 8L8 40" stroke="#C19A6B" strokeWidth="3" strokeLinecap="round"/>
    <path d="M32 8L40 8L40 16" stroke="#C19A6B" strokeWidth="3" strokeLinecap="round"/>
    <ellipse cx="14" cy="34" rx="2" ry="5" fill="#C19A6B" fillOpacity="0.5"/>
  </svg>
);

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();
  const { signup, currentUser } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to main page
    if (currentUser) {
      console.log("User already logged in, redirecting to main page");
      navigate('/main');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setLoading(true);
      console.log("Submitting signup form...");
      const user = await signup(email, password, name, username);
      console.log("Signup successful, user:", user.email);
      setSignupSuccess(true);
      
      // Navigate to login after a delay to allow time for registration
      setTimeout(() => {
        navigate('/main');
      }, 1000);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5e1a0] via-[#e2d8c0] to-[#bfa77a] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Constitution book watermark prints */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {[
          { x: '12%', y: '18%', rotate: '-18deg', size: 44 },
          { x: '68%', y: '12%', rotate: '12deg', size: 38 },
          { x: '28%', y: '62%', rotate: '-10deg', size: 36 },
          { x: '58%', y: '72%', rotate: '8deg', size: 40 },
          { x: '82%', y: '48%', rotate: '-14deg', size: 42 },
          { x: '40%', y: '78%', rotate: '6deg', size: 34 },
        ].map((item, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              transform: `rotate(${item.rotate})`,
              opacity: 0.22,
              userSelect: 'none',
              pointerEvents: 'none',
              display: 'block',
            }}
          >
            <svg width={item.size} height={item.size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="7" width="24" height="18" rx="4" fill="#fffbe6" stroke="#bfa77a" strokeWidth="1.5"/>
              <rect x="7" y="10" width="8" height="12" rx="2" fill="#e2c275" stroke="#e2d8c0" strokeWidth="1"/>
              <rect x="17" y="10" width="8" height="12" rx="2" fill="#e2c275" stroke="#e2d8c0" strokeWidth="1"/>
              <line x1="11" y1="12" x2="11" y2="20" stroke="#bfa77a" strokeWidth="0.7"/>
              <line x1="21" y1="12" x2="21" y2="20" stroke="#bfa77a" strokeWidth="0.7"/>
            </svg>
          </span>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="max-w-md w-full space-y-8 bg-white/40 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-yellow-200 relative overflow-hidden"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center"
        >
          <QuillIcon />
          <h2 className="text-3xl font-bold text-amber-800 font-serif">LexIQ</h2>
        </motion.div>
        <div>
          <h2 className="mt-2 text-center text-2xl font-extrabold text-primary font-serif drop-shadow-md">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-700">
            Or{' '}
            <Link to="/login" className="font-medium text-accent hover:text-accent/80 underline">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        {signupSuccess ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-6 rounded shadow-sm text-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-4xl mb-3"
            >
              ✅
            </motion.div>
            <h3 className="font-bold text-lg mb-2">Account Created Successfully!</h3>
            <p>You will be redirected to the main page shortly...</p>
          </motion.div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-sm"
              >
                {error}
              </motion.div>
            )}
            <div className="space-y-4 rounded-md">
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="transition-all duration-300 appearance-none rounded-md relative block w-full px-3 py-2 border border-yellow-300 placeholder-yellow-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent focus:z-10 sm:text-sm bg-white/70 backdrop-blur-md shadow-inner hover:shadow-lg"
                  placeholder="Full Name"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="transition-all duration-300 appearance-none rounded-md relative block w-full px-3 py-2 border border-yellow-300 placeholder-yellow-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent focus:z-10 sm:text-sm bg-white/70 backdrop-blur-md shadow-inner hover:shadow-lg"
                  placeholder="Username (will be displayed publicly)"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-all duration-300 appearance-none rounded-md relative block w-full px-3 py-2 border border-yellow-300 placeholder-yellow-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent focus:z-10 sm:text-sm bg-white/70 backdrop-blur-md shadow-inner hover:shadow-lg"
                  placeholder="Email address"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-all duration-300 appearance-none rounded-md relative block w-full px-3 py-2 border border-yellow-300 placeholder-yellow-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent focus:z-10 sm:text-sm bg-white/70 backdrop-blur-md shadow-inner hover:shadow-lg"
                  placeholder="Password"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="transition-all duration-300 appearance-none rounded-md relative block w-full px-3 py-2 border border-yellow-300 placeholder-yellow-700 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent focus:z-10 sm:text-sm bg-white/70 backdrop-blur-md shadow-inner hover:shadow-lg"
                  placeholder="Confirm Password"
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 8px #C19A6B' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-500 hover:from-yellow-600 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent shadow-lg transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </motion.button>
            </div>
          </form>
        )}
        
        <div className="mt-4 text-center">
          <Link to="/" className="font-medium text-accent hover:text-accent/80 text-sm underline">
            Back to Home
          </Link>
        </div>
        {/* Animated border accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute -inset-1 rounded-3xl border-4 border-yellow-300 pointer-events-none z-0"
          style={{ filter: 'blur(2px)' }}
        />
      </motion.div>
    </div>
  );
};

export default SignUp; 