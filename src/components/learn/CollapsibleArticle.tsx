import { PlusCircle } from 'lucide-react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleArticleProps {
  title: string;
  shortDescription: string;
  children: React.ReactNode;
}

const CollapsibleArticle: React.FC<CollapsibleArticleProps> = ({ title, shortDescription, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-700/50 rounded-2xl overflow-hidden shadow-lg bg-white/5 backdrop-blur-sm mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 sm:p-6 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors duration-200"
      >
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-[#f5e1a0] font-playfair">{title}</h3>
          <p className="text-sm sm:text-base text-gray-300 mt-1">{shortDescription}</p>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-4"
        >
          <PlusCircle className={`w-6 h-6 sm:w-8 sm:h-8 text-[#f5e1a0] transition-transform duration-300`} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="prose prose-invert max-w-none p-4 sm:p-6 border-t border-gray-700/50 bg-black/20">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleArticle; 