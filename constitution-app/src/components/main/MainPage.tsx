import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const constitutionArticles = [
  {
    id: 1,
    title: 'Article I',
    subtitle: 'Legislative Branch',
    content: 'All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives.',
    image: 'https://images.unsplash.com/photo-1581092921461-eab22b60c833?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    title: 'Article II',
    subtitle: 'Executive Branch',
    content: 'The executive Power shall be vested in a President of the United States of America. He shall hold his Office during the Term of four Years, and, together with the Vice President, chosen for the same Term, be elected, as follows...',
    image: 'https://images.unsplash.com/photo-1485394735640-56c0380fb711?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    title: 'Article III',
    subtitle: 'Judicial Branch',
    content: 'The judicial Power of the United States, shall be vested in one supreme Court, and in such inferior Courts as the Congress may from time to time ordain and establish.',
    image: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 4,
    title: 'Article IV',
    subtitle: "States' Relations",
    content: 'Full Faith and Credit shall be given in each State to the public Acts, Records, and judicial Proceedings of every other State.',
    image: 'https://images.unsplash.com/photo-1568752172811-a743915f09b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
];

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create a parchment-like background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#f5f0e6');
    gradient.addColorStop(1, '#e2d8c0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some noise texture
    for (let i = 0; i < canvas.width * canvas.height * 0.05; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 1;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fill();
    }
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
};

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animate the header with GSAP
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });
    }
  }, []);
  
  const handleLogout = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-constitution text-primary">
      <Background />
      
      {/* Header */}
      <header ref={headerRef} className="py-6 px-6 md:px-12 flex justify-between items-center backdrop-blur-sm bg-white/60 sticky top-0 z-50">
        <h1 className="text-2xl font-serif font-bold">Constitutional Explorer</h1>
        
        <nav className="hidden md:flex space-x-8">
          <button className="text-primary hover:text-accent transition-colors bg-transparent border-none cursor-pointer">Home</button>
          <button className="text-primary hover:text-accent transition-colors bg-transparent border-none cursor-pointer">Articles</button>
          <button className="text-primary hover:text-accent transition-colors bg-transparent border-none cursor-pointer">Amendments</button>
          <button className="text-primary hover:text-accent transition-colors bg-transparent border-none cursor-pointer">History</button>
        </nav>
        
        <button 
          onClick={handleLogout}
          className="py-2 px-4 rounded bg-primary text-white hover:bg-primary/80 transition-colors text-sm"
        >
          Log Out
        </button>
      </header>
      
      {/* Hero section */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="constitutional-heading mb-6">
            The Constitution of the United States
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Explore the document that established America's national government and fundamental laws, and guaranteed certain basic rights for its citizens.
          </p>
        </motion.div>
        
        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {constitutionArticles.map((article, index) => (
            <motion.div 
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6 flex-grow">
                <h3 className="font-serif text-2xl font-bold mb-2">{article.title}</h3>
                <h4 className="text-accent mb-4">{article.subtitle}</h4>
                <p className="text-gray-700">{article.content}</p>
              </div>
              <div className="p-6 pt-0">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full"
                >
                  Read More
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MainPage; 