import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { quizService } from '../../../services';
import { Quiz, QuizQuestion } from '../../../models/Quiz';

const emptyQuestion: Omit<QuizQuestion, 'id'> = {
  question: '',
  options: ['', '', '', ''],
  correctOptionIndex: 0,
  explanation: '',
};

const QuizForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    chapterId: '',
    questions: [ { ...emptyQuestion } ],
    isDaily: false,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      quizService.getById(id).then((quiz) => {
        if (quiz) {
          setForm({
            title: quiz.title,
            description: quiz.description,
            chapterId: quiz.chapterId || '',
            questions: quiz.questions.length ? quiz.questions : [ { ...emptyQuestion } ],
            isDaily: quiz.isDaily,
            isActive: quiz.isActive,
          });
        }
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Question handlers
  const handleQuestionChange = (idx: number, field: keyof QuizQuestion, value: any) => {
    setForm((prev) => {
      const questions = [...prev.questions];
      questions[idx] = { ...questions[idx], [field]: value };
      return { ...prev, questions };
    });
  };
  const handleOptionChange = (qIdx: number, oIdx: number, value: string) => {
    setForm((prev) => {
      const questions = [...prev.questions];
      const options = [...questions[qIdx].options];
      options[oIdx] = value;
      questions[qIdx] = { ...questions[qIdx], options };
      return { ...prev, questions };
    });
  };
  const addQuestion = () => setForm((prev) => ({ ...prev, questions: [ ...prev.questions, { ...emptyQuestion } ] }));
  const removeQuestion = (idx: number) => setForm((prev) => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEdit && id) {
        await quizService.update(id, form);
      } else {
        await quizService.add(form);
      }
      navigate('/admin/quizzes');
    } catch (err) {
      setError('Failed to save quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded p-6">
      <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Edit' : 'Add'} Quiz</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded min-h-[60px]"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Chapter ID (optional)</label>
          <input
            type="text"
            name="chapterId"
            value={form.chapterId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isDaily"
            checked={form.isDaily}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="font-medium">Daily Quiz</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="font-medium">Active</label>
        </div>
        <div>
          <label className="block mb-2 font-medium">Questions</label>
          {form.questions.map((q, idx) => (
            <div key={idx} className="border rounded p-3 mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Question {idx + 1}</span>
                {form.questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(idx)} className="text-red-600">Remove</button>
                )}
              </div>
              <input
                type="text"
                placeholder="Question text"
                value={q.question}
                onChange={e => handleQuestionChange(idx, 'question', e.target.value)}
                className="w-full border px-2 py-1 rounded mb-2"
                required
              />
              <div className="grid grid-cols-2 gap-2 mb-2">
                {q.options.map((opt, oIdx) => (
                  <input
                    key={oIdx}
                    type="text"
                    placeholder={`Option ${oIdx + 1}`}
                    value={opt}
                    onChange={e => handleOptionChange(idx, oIdx, e.target.value)}
                    className="border px-2 py-1 rounded"
                    required
                  />
                ))}
              </div>
              <div className="mb-2">
                <label className="block text-sm">Correct Option</label>
                <select
                  value={q.correctOptionIndex}
                  onChange={e => handleQuestionChange(idx, 'correctOptionIndex', Number(e.target.value))}
                  className="border px-2 py-1 rounded"
                >
                  {q.options.map((_, oIdx) => (
                    <option key={oIdx} value={oIdx}>{`Option ${oIdx + 1}`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm">Explanation (optional)</label>
                <textarea
                  value={q.explanation || ''}
                  onChange={e => handleQuestionChange(idx, 'explanation', e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={addQuestion} className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded">
            Add Question
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            onClick={() => navigate('/admin/quizzes')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizForm; 