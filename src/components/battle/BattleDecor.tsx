import React from 'react';

const BattleDecor: React.FC = () => (
  <>
    {/* Gold sparkles */}
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute pointer-events-none -z-10"
        style={{
          top: `${10 + Math.random() * 80}%`,
          left: `${5 + Math.random() * 90}%`,
          width: `${8 + Math.random() * 8}px`,
          height: `${8 + Math.random() * 8}px`,
          background: 'radial-gradient(circle, #ffe066 60%, #f5e1a0 100%)',
          borderRadius: '50%',
          opacity: 0.7 + Math.random() * 0.3,
          animation: `sparkle-float ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random()}s`,
        }}
      />
    ))}
    {/* Blurred floating shapes */}
    {[...Array(3)].map((_, i) => (
      <div
        key={100 + i}
        className="absolute pointer-events-none -z-10 blur-2xl"
        style={{
          top: `${20 + i * 25}%`,
          left: `${15 + i * 30}%`,
          width: `${120 + i * 40}px`,
          height: `${80 + i * 30}px`,
          background: `linear-gradient(135deg, #ffe06644, #f5e1a044, #232b39aa)`,
          borderRadius: '40%',
          opacity: 0.25,
          animation: `shape-float ${8 + i * 2}s ease-in-out infinite alternate ${i * 1.5}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes sparkle-float {
        0% { transform: translateY(0) scale(1); opacity: 0.8; }
        50% { transform: translateY(-16px) scale(1.2); opacity: 1; }
        100% { transform: translateY(0) scale(1); opacity: 0.8; }
      }
      @keyframes shape-float {
        0% { transform: translateY(0) scale(1); }
        100% { transform: translateY(-24px) scale(1.05); }
      }
    `}</style>
  </>
);

export default BattleDecor; 