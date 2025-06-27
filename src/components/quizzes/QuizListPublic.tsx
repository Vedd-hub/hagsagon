import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../main/MainLayout';

const quizzes = [
  {
    id: 'fundamental-rights',
    title: 'Fundamental Rights',
    description: 'A comprehensive quiz on the Fundamental Rights of the Indian Constitution.',
    questionsCount: 300,
    difficulty: 'Easy/Medium/Hard',
    topic: 'Fundamental Rights',
  },
  {
    id: 'fundamental-duties',
    title: 'Fundamental Duties',
    description: 'Test your knowledge of the Fundamental Duties in the Indian Constitution.',
    questionsCount: 100,
    difficulty: 'Easy/Medium/Hard',
    topic: 'Fundamental Duties',
  },
  {
    id: 'citizenship',
    title: 'Citizenship',
    description: 'Quiz on the Citizenship provisions and articles in the Indian Constitution.',
    questionsCount: 100,
    difficulty: 'Easy/Medium/Hard',
    topic: 'Citizenship',
  },
];

function shuffleArray(array: any[]) {
  // Fisher-Yates shuffle
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const QuizListPublic: React.FC = () => {
  const randomQuizzes = useMemo(() => shuffleArray(quizzes), []);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleStartBattle = async (questions: any[]) => {
    if (!currentUser) return;
    const docRef = await addDoc(collection(db, 'battles'), {
      createdBy: currentUser.uid,
      players: {
        user1: { uid: currentUser.uid, displayName: currentUser.displayName, score: 0, answers: [], ready: false }
      },
      questions,
      currentQuestion: 0,
      timer: 10,
      status: 'waiting',
      winner: null,
      createdAt: serverTimestamp()
    });
    navigate(`/battle/${docRef.id}`);
  };

  return (
    <MainLayout>
      <div className="relative w-full px-2 sm:px-8 pt-4 sm:pt-8 pb-12 flex flex-col items-center justify-start overflow-hidden">
        {/* Decorative blurred background shape */}
        <div className="absolute -z-10 top-0 left-1/2 transform -translate-x-1/2 w-[250px] h-[250px] sm:w-[600px] sm:h-[600px] bg-gradient-to-br from-[#ffe066]/40 via-[#f5e1a0]/30 to-[#232b39]/10 rounded-full blur-3xl opacity-60" />
        <h1 className="text-2xl sm:text-5xl font-extrabold mb-6 sm:mb-14 text-center text-gray-900 dark:text-white tracking-tight drop-shadow-lg mt-0 break-words">Quizzes</h1>
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <button
            className="flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-extrabold text-lg sm:text-xl bg-gradient-to-r from-[#ffe066] via-[#f5e1a0] to-[#ffe066] text-[#232b39] shadow-lg hover:brightness-110 hover:scale-105 transition-all duration-200 border-2 border-[#f5e1a0]/60 outline-none focus:ring-2 focus:ring-[#f5e1a0] w-full sm:w-auto"
            onClick={() => handleStartBattle(quizzes)}
          >
            <span className="text-2xl">🤝</span>
            Challenge a Friend
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10 w-full overflow-hidden">
          {randomQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="relative flex flex-col items-start bg-white/30 dark:bg-[#232b39]/60 backdrop-blur-lg border-l-8 border-[#f5e1a0] shadow-xl rounded-2xl p-3 sm:p-6 min-h-[180px] sm:min-h-[220px] transition-transform hover:-translate-y-2 duration-200 group overflow-hidden w-full max-w-full"
            >
              {/* Floating icon/emoji */}
              <div className="absolute -top-5 sm:-top-7 left-3 sm:left-6 text-3xl sm:text-5xl drop-shadow-lg select-none pointer-events-none max-w-full overflow-hidden">
                {quiz.id === 'fundamental-rights' && '⚖️'}
                {quiz.id === 'fundamental-duties' && '📝'}
                {quiz.id === 'citizenship' && '🪪'}
              </div>
              <h3 className="text-lg sm:text-2xl font-extrabold mb-2 text-gray-900 dark:text-[#ffe066] drop-shadow-sm mt-6 break-words w-full max-w-full overflow-hidden">
                {quiz.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-200 mb-3 sm:mb-6 text-xs sm:text-base min-h-[28px] sm:min-h-[48px] break-words w-full max-w-full overflow-hidden">
                {quiz.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-8 w-full">
                <span className="bg-[#f5e1a0]/30 text-[#bfa77a] text-xs font-semibold px-3 py-1 rounded-full shadow break-words">{quiz.questionsCount} Questions</span>
                <span className="bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full shadow break-words">{quiz.topic}</span>
                <span className="bg-green-500/10 text-green-700 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full shadow break-words">{quiz.difficulty}</span>
              </div>
              <button
                className="mt-auto flex items-center gap-2 bg-[#232b39] dark:bg-[#ffe066] text-[#ffe066] dark:text-[#232b39] px-3 sm:px-5 py-2 rounded-full font-bold text-sm sm:text-base shadow hover:bg-[#181e26] hover:dark:bg-[#f5e1a0] hover:scale-105 transition-all w-full"
                onClick={() => {
                  if (quiz.id === 'citizenship') {
                    navigate('/quiz/citizenship');
                  } else if (quiz.id === 'fundamental-rights') {
                    navigate('/quiz/fundamental-rights');
                  } else {
                    navigate(`/quiz/${quiz.id}`);
                  }
                }}
              >
                Take Quiz <span className="text-lg">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default QuizListPublic; 