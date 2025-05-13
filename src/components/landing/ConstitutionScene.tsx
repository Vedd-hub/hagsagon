import React, { useEffect, useRef } from 'react';

// Generate an array of random star positions
const STAR_COUNT = 180;
const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() < 0.92 ? Math.random() * 2 + 1 : Math.random() * 6 + 3, // a few larger stars
  color:
    Math.random() < 0.93
      ? 'white'
      : Math.random() < 0.5
      ? '#aee7ff' // blue
      : '#ffe066', // yellow
  glow: Math.random() > 0.92,
  delay: Math.random() * 3,
}));

// Shooting star state
const SHOOTING_STAR_INTERVAL = 9000; // ms
const SHOOTING_STAR_DURATION = 1200; // ms

// Particle system config
const PARTICLE_COUNT = 60;
const PARTICLE_RADIUS = 3;
const REPULSE_RADIUS = 80;
const REPULSE_STRENGTH = 0.13;

const ConstitutionScene: React.FC = () => {
  // Shooting star state
  const shootingStarRef = useRef<null | { key: number; top: number; left: number; angle: number }>(null);
  const [shootingStar, setShootingStar] = React.useState<null | { key: number; top: number; left: number; angle: number }>(null);

  // Particle system refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  // Shooting star effect
  useEffect(() => {
    const interval = setInterval(() => {
      shootingStarRef.current = {
        key: Date.now(),
        top: Math.random() * 60 + 10,
        left: Math.random() * 60 + 10,
        angle: Math.random() * 40 - 20,
      };
      setShootingStar(shootingStarRef.current);
      setTimeout(() => setShootingStar(null), SHOOTING_STAR_DURATION);
    }, SHOOTING_STAR_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Particle system effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    // Initialize particles
    if (!particlesRef.current.length && canvas) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
        });
      }
    }

    // Animation loop
    let running = true;
    function animate() {
      if (!running || !canvas) return;
      ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let p of particlesRef.current) {
        // Repulsion from mouse
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPULSE_RADIUS) {
          const angle = Math.atan2(dy, dx);
          const force = (REPULSE_RADIUS - dist) * REPULSE_STRENGTH;
          p.vx += Math.cos(angle) * force;
          p.vy += Math.sin(angle) * force;
        }
        // Move
        p.x += p.vx;
        p.y += p.vy;
        // Friction
        p.vx *= 0.96;
        p.vy *= 0.96;
        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      requestAnimationFrame(animate);
    }
    animate();
    return () => {
      running = false;
      window.removeEventListener('resize', setSize);
    };
  }, []);

  // Mouse move handler
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <div className="h-screen w-full bg-gradient-to-b from-[#080D17] to-[#0F172A] relative overflow-hidden">
      {/* Starfield */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {stars.map((star, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: '50%',
              background: star.color,
              opacity: star.glow ? 0.9 : 0.7,
              filter: star.glow ? 'blur(2.5px)' : 'blur(0.5px)',
              boxShadow: star.glow
                ? `0 0 12px 4px ${star.color}`
                : undefined,
              animation: `twinkle 2.5s infinite ease-in-out`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
        {/* Shooting star */}
        {shootingStar && (
          <span
            key={shootingStar.key}
            style={{
              position: 'absolute',
              top: `${shootingStar.top}%`,
              left: `${shootingStar.left}%`,
              width: '120px',
              height: '2px',
              background: 'linear-gradient(90deg, #fff, #fff0)',
              borderRadius: '2px',
              opacity: 0.8,
              transform: `rotate(${shootingStar.angle}deg)`,
              boxShadow: '0 0 16px 4px #fff',
              animation: `shooting-star 1200ms linear`,
            }}
          />
        )}
        {/* Twinkle and shooting star keyframes */}
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 0.2; }
          }
          @keyframes shooting-star {
            0% { transform: translateX(0) scaleX(0.7) scaleY(1) rotate(var(--angle, 0deg)); opacity: 0.8; }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateX(180px) scaleX(1.1) scaleY(0.7) rotate(var(--angle, 0deg)); opacity: 0; }
          }
        `}</style>
      </div>
      {/* Particle repulsion canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default ConstitutionScene; 