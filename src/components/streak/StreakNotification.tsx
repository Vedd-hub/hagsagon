import React, { useEffect, useState } from 'react';

interface StreakNotificationProps {
  message: string;
  streak: number;
  bonus: number;
  isVisible: boolean;
  onClose: () => void;
}

const StreakNotification: React.FC<StreakNotificationProps> = ({
  message,
  streak,
  bonus,
  isVisible,
  onClose
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getStreakEmoji = (streak: number) => {
    if (streak >= 100) return '👑';
    if (streak >= 60) return '🔥🔥🔥';
    if (streak >= 30) return '🔥🔥';
    if (streak >= 7) return '🔥';
    return '💪';
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 100) return 'from-purple-500 to-pink-500';
    if (streak >= 60) return 'from-orange-500 to-red-500';
    if (streak >= 30) return 'from-yellow-500 to-orange-500';
    if (streak >= 7) return 'from-[#f5e1a0] to-yellow-500';
    return 'from-blue-500 to-green-500';
  };

  return (
    <div className="fixed top-4 right-4 z-[1001] animate-slide-in">
      <div className={`bg-gradient-to-r ${getStreakColor(streak)} p-4 rounded-lg shadow-lg border-2 border-white/20 max-w-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl animate-bounce">
              {getStreakEmoji(streak)}
            </div>
            <div className="text-white">
              <div className="font-bold text-lg">{message}</div>
              {bonus > 0 && (
                <div className="text-sm opacity-90">
                  +{bonus} bonus points!
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-xl font-bold"
          >
            ×
          </button>
        </div>
        
        {/* Streak progress bar */}
        <div className="mt-3 bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min((streak % 7) * 14.28, 100)}%` }}
          ></div>
        </div>
        
        <div className="text-white/80 text-xs mt-2 text-center">
          Day {streak} • {bonus > 0 ? `+${bonus} bonus` : 'Keep going!'}
        </div>
      </div>
    </div>
  );
};

export default StreakNotification; 