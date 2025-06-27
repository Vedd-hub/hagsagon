import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services';
import { UserProfile } from '../../models/UserProfile';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

interface ResumableQuizProps {
  quizId: string;
  questions: Question[];
}

const ResumableQuiz: React.FC<ResumableQuizProps> = ({ quizId, questions }) => {
  const { currentUser, userData } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Restore progress on mount
  useEffect(() => {
    const quizzes = (userData as UserProfile)?.quizzes || {};
    if (quizzes[quizId]) {
      const saved = quizzes[quizId];
      setCurrentQuestion(saved.currentQuestion || 0);
      setAnswers(saved.answers || []);
      setScore(saved.score || 0);
      setFinished(saved.finished || false);
    }
  }, [userData, quizId]);

  // Save progress on every change
  useEffect(() => {
    if (currentUser) {
      const quizzes = (userData as UserProfile)?.quizzes || {};
      userService.updateUserProfile(currentUser.uid, {
        quizzes: {
          ...quizzes,
          [quizId]: { currentQuestion, answers, score, finished }
        }
      });
    }
  }, [currentUser, userData, quizId, currentQuestion, answers, score, finished]);

  const handleAnswer = (optionIndex: number) => {
    if (finished) return;
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    if (questions[currentQuestion].correctIndex === optionIndex) {
      setScore(score + 1);
    }
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
    setFinished(false);
  };

  if (questions.length === 0) {
    return <div>No questions available.</div>;
  }

  if (finished) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white/10 rounded-lg border border-[#f5e1a0]/20 text-center">
        <h2 className="text-2xl font-bold text-[#f5e1a0] mb-4">Quiz Complete!</h2>
        <p className="text-lg text-white mb-2">Your Score: {score} / {questions.length}</p>
        <button
          onClick={handleRestart}
          className="mt-4 px-6 py-2 bg-[#f5e1a0] text-[#0F172A] rounded hover:bg-[#ffe08a] font-semibold"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="max-w-xl mx-auto p-6 bg-white/10 rounded-lg border border-[#f5e1a0]/20">
      <h2 className="text-xl font-bold text-[#f5e1a0] mb-4">Question {currentQuestion + 1} / {questions.length}</h2>
      <p className="text-white text-lg mb-6">{q.text}</p>
      <div className="space-y-3">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            className="w-full text-left px-4 py-3 bg-black/30 rounded-lg border border-[#f5e1a0]/10 text-white hover:bg-[#f5e1a0]/10 transition-colors"
            disabled={finished}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="mt-6 text-gray-400">Score: {score}</div>
    </div>
  );
};

export default ResumableQuiz; 