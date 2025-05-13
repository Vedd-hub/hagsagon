import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { quizService } from '../../../services';
import { Quiz } from '../../../models/Quiz';
import AdminTable from '../common/AdminTable';

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await quizService.getAll(true);
      setQuizzes(data);
    } catch (error) {
      alert('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quiz: Quiz) => {
    if (!quiz.id) return;
    if (!window.confirm(`Delete quiz "${quiz.title}"?`)) return;
    try {
      await quizService.delete(quiz.id);
      setQuizzes(quizzes.filter(q => q.id !== quiz.id));
    } catch (error) {
      alert('Failed to delete quiz');
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' as keyof Quiz },
    { header: 'Description', accessor: 'description' as keyof Quiz },
    { header: 'Status', accessor: (q: Quiz) => q.isActive ? 'Active' : 'Inactive' },
    { header: 'Created', accessor: (q: Quiz) => new Date(q.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Quizzes</h2>
        <Link to="/admin/quizzes/new" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Add New Quiz
        </Link>
      </div>
      <AdminTable<Quiz>
        data={quizzes}
        columns={columns}
        keyField="id"
        loading={loading}
        baseEditUrl="/admin/quizzes"
        onDelete={handleDelete}
      />
    </div>
  );
};

export default QuizList; 