import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CustomCursorProps {
  color?: string;
  trailsCount?: number;
}

const CustomCursor: React.FC<CustomCursorProps> = ({
  color = '#f5e1a0',
  trailsCount = 12,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [trails, setTrails] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    const addTrailPoint = (x: number, y: number) => {
      setTrails((prev) => [...prev.slice(-trailsCount + 1), { x, y }]);
    };

    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      addTrailPoint(e.clientX, e.clientY);
      setIsVisible(true);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    const handleLinkHoverStart = () => setLinkHovered(true);
    const handleLinkHoverEnd = () => setLinkHovered(false);

    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    const links = document.querySelectorAll('a, button, [role="button"]');
    links.forEach((link) => {
      link.addEventListener('mouseenter', handleLinkHoverStart);
      link.addEventListener('mouseleave', handleLinkHoverEnd);
    });

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);

      links.forEach((link) => {
        link.removeEventListener('mouseenter', handleLinkHoverStart);
        link.removeEventListener('mouseleave', handleLinkHoverEnd);
      });
    };
  }, [trailsCount]);

  return (
    <>
      {/* Comet trail effect */}
      {trails.map((trail, i) => (
        <motion.div
          key={i}
          className="pointer-events-none fixed z-50"
          style={{
            left: trail.x - 6,
            top: trail.y - 6,
            width: 12 - i * 0.7,
            height: 12 - i * 0.7,
            borderRadius: '50%',
            background: `radial-gradient(circle, #fff 60%, ${color} 100%)`,
            opacity: 0.18 + (i / trailsCount) * 0.22,
            filter: `blur(${(trailsCount - i) * 0.7}px) drop-shadow(0 0 6px ${color})`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.1 }}
        />
      ))}

      {/* Glowing cursor dot */}
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed z-50"
        style={{
          left: position.x - 10,
          top: position.y - 10,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: `radial-gradient(circle, #fff 60%, ${color} 100%)`,
          boxShadow: `0 0 24px 8px ${color}cc, 0 0 8px 2px #fff8`,
          opacity: isVisible ? 1 : 0,
          zIndex: 9999,
        }}
        animate={{
          scale: clicked ? 0.7 : linkHovered ? 1.3 : 1,
        }}
        transition={{
          scale: { duration: 0.18 },
        }}
      />
    </>
  );
};

export default CustomCursor;
