import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quiz } from '../../models/Quiz';
import { firestoreService } from '../../services';
import { where, orderBy } from 'firebase/firestore';

const QuizPageExample: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch quizzes
    const fetchQuizzes = async () => {
      try {
        const quizzesData = await firestoreService.query<Quiz>(
          'quizzes',
          where('isActive', '==', true),
          orderBy('createdAt', 'desc')
        );
        setQuizzes(quizzesData);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
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
            Available Quizzes
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-[#f5e1a0]/30 border-t-[#f5e1a0] rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-400">Loading quizzes...</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-8 bg-white/5 rounded-lg">
              <p className="text-gray-400">No quizzes available yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-black/30 backdrop-blur-sm border border-[#f5e1a0]/10 rounded-lg overflow-hidden hover:border-[#f5e1a0]/30 transition-colors group"
                >
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-start mb-3">
                      <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#f5e1a0] transition-colors">
                        {quiz.title}
                      </h3>
                      <div className="flex space-x-2">
                        {quiz.isDaily && (
                          <span className="bg-purple-500/20 text-purple-300 text-xs font-medium px-2 py-1 rounded">
                            Daily
                          </span>
                        )}
                        <span className="bg-[#f5e1a0]/20 text-[#f5e1a0] text-xs font-medium px-2 py-1 rounded">
                          {quiz.questions.length} Questions
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      {quiz.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        Created: {formatDate(quiz.createdAt)}
                      </span>
                      <button className="px-4 py-2 bg-[#f5e1a0]/20 text-[#f5e1a0] rounded hover:bg-[#f5e1a0]/30 transition-colors text-sm font-medium">
                        Take Quiz
                      </button>
                    </div>
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

export default QuizPageExample; 