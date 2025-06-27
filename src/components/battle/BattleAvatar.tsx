import React from 'react';

const getInitials = (name: string) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const colors = [
  '#ffe066', '#f5e1a0', '#a0e1f5', '#a0f5b8', '#e1a0f5', '#f5a0a0', '#a0f5e1', '#f5dca0'
];

const pickColor = (name: string | null | undefined) => {
  const safeName = typeof name === 'string' ? name : '';
  let hash = 0;
  for (let i = 0; i < safeName.length; i++) hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const BattleAvatar: React.FC<{ name: string | null | undefined; highlight?: boolean; size?: 'responsive' }> = ({ name, highlight, size }) => {
  const initials = getInitials(name || '');
  const bg = pickColor(name);
  const sizeClass = size === 'responsive' ? 'w-10 h-10 md:w-12 md:h-12' : 'w-12 h-12';
  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold text-lg md:text-xl select-none shadow-md transition-all duration-300 ${sizeClass} ${highlight ? 'ring-4 ring-[#ffe066] ring-opacity-80 animate-battle-glow' : 'ring-2 ring-[#f5e1a0]/40'}`}
      style={{ background: bg, color: '#232b39' }}
    >
      {initials}
      <style>{`
        @keyframes battle-glow {
          0% { box-shadow: 0 0 8px 2px #ffe06644; }
          50% { box-shadow: 0 0 16px 4px #ffe06688; }
          100% { box-shadow: 0 0 8px 2px #ffe06644; }
        }
        .animate-battle-glow { animation: battle-glow 2s infinite alternate; }
      `}</style>
    </div>
  );
};

export default BattleAvatar; 