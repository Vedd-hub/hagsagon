import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chapter } from '../../models/Chapter';
import { firestoreService } from '../../services';
import { where, orderBy } from 'firebase/firestore';

const LearnPageExample: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch chapters added by admin
    const fetchChapters = async () => {
      try {
        const chaptersData = await firestoreService.query<Chapter>(
          'chapters',
          where('isActive', '==', true),
          orderBy('order', 'asc')
        );
        setChapters(chaptersData);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-lg border border-[#f5e1a0]/20 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-serif font-bold text-white mb-6">
            Available Chapters
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-[#f5e1a0]/30 border-t-[#f5e1a0] rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-400">Loading chapters...</p>
            </div>
          ) : chapters.length === 0 ? (
            <div className="text-center py-8 bg-white/5 rounded-lg">
              <p className="text-gray-400">No chapters available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chapters.map((chapter) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-black/30 backdrop-blur-sm border border-[#f5e1a0]/10 rounded-lg overflow-hidden hover:border-[#f5e1a0]/30 transition-colors group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-[#f5e1a0]/20 text-[#f5e1a0] text-xs font-medium px-2 py-1 rounded">
                        Chapter {chapter.order}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(chapter.updatedAt)}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-[#f5e1a0] transition-colors">
                      {chapter.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {chapter.content.substring(0, 150)}...
                    </p>
                    <button className="mt-4 text-[#f5e1a0] text-sm font-medium hover:text-white transition-colors flex items-center">
                      Start Learning
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnPageExample; 