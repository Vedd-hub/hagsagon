import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chapterService } from '../../../services';
import { Chapter } from '../../../models/Chapter';

const ChapterForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    content: '',
    order: 1,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      chapterService.getById(id).then((chapter) => {
        if (chapter) {
          setForm({
            title: chapter.title,
            content: chapter.content,
            order: chapter.order,
            isActive: chapter.isActive,
          });
        }
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEdit && id) {
        await chapterService.update(id, form);
      } else {
        await chapterService.add(form);
      }
      navigate('/admin/chapters');
    } catch (err) {
      setError('Failed to save chapter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded p-6">
      <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Edit' : 'Add'} Chapter</h2>
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
          <label className="block mb-1 font-medium">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded min-h-[120px]"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Order</label>
          <input
            type="number"
            name="order"
            value={form.order}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            min={1}
            required
          />
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
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            onClick={() => navigate('/admin/chapters')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChapterForm; 