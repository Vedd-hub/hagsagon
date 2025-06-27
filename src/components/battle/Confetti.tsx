import React from 'react';

const colors = ['#ffe066', '#f5e1a0', '#a0e1f5', '#a0f5b8', '#e1a0f5', '#f5a0a0', '#a0f5e1', '#f5dca0'];

const Confetti: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none -z-10">
    {[...Array(36)].map((_, i) => {
      const left = Math.random() * 100;
      const delay = Math.random() * 0.8;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 8 + Math.random() * 10;
      return (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${left}%`,
            top: '-5%',
            width: size,
            height: size,
            background: color,
            borderRadius: '50%',
            opacity: 0.85,
            animation: `confetti-fall 2.5s cubic-bezier(.62,.01,.36,1) forwards`,
            animationDelay: `${delay}s`,
          }}
        />
      );
    })}
    <style>{`
      @keyframes confetti-fall {
        0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
        80% { opacity: 1; }
        100% { transform: translateY(110vh) scale(0.8) rotate(360deg); opacity: 0; }
      }
    `}</style>
  </div>
);

export default Confetti; 