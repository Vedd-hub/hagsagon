import React, { useEffect, useState } from 'react';
import { quizService } from '../../services';
import { Quiz } from '../../models/Quiz';

const QuizListPublic: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await quizService.getAll(); // Only active quizzes
      setQuizzes(data);
    } catch (error) {
      alert('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Quizzes</h1>
      {loading ? (
        <div>Loading...</div>
      ) : quizzes.length === 0 ? (
        <div>No quizzes available.</div>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="bg-white shadow rounded p-4">
              <h2 className="text-lg font-semibold mb-1">{quiz.title}</h2>
              <p className="text-gray-700 mb-2">{quiz.description}</p>
              {quiz.chapterId && (
                <p className="text-sm text-gray-500 mb-1">Chapter ID: {quiz.chapterId}</p>
              )}
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                {quiz.isActive ? 'Active' : 'Inactive'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuizListPublic; 