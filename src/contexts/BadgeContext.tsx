import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Badge } from '../models/Badge';

interface BadgeContextType {
  showBadgeNotification: (badge: Badge) => void;
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export const useBadge = () => {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error('useBadge must be used within a BadgeProvider');
  }
  return context;
};

interface BadgeProviderProps {
  children: ReactNode;
}

export const BadgeProvider: React.FC<BadgeProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<Badge | null>(null);

  const showBadgeNotification = (badge: Badge) => {
    setNotification(badge);
    setTimeout(() => {
      setNotification(null);
    }, 5000); // Hide after 5 seconds
  };

  return (
    <BadgeContext.Provider value={{ showBadgeNotification }}>
      {children}
      {notification && <BadgeNotification badge={notification} />}
    </BadgeContext.Provider>
  );
};

// This is a placeholder for the actual notification component
const BadgeNotification: React.FC<{ badge: Badge }> = ({ badge }) => {
  return (
    <div className="fixed bottom-5 right-5 bg-gradient-to-r from-[#f5e1a0] to-[#e2d8c0] text-[#1a2233] p-4 rounded-lg shadow-2xl z-[1001] border-2 border-[#f5e1a0]/50 animate-slide-in">
      <h4 className="font-bold text-lg font-playfair">🎉 Badge Unlocked!</h4>
      <p className="font-semibold">{badge.name}</p>
    </div>
  );
};

// Add CSS for the animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slide-in {
    animation: slide-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style); 