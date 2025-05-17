import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { chapterService } from '../../../services';
import { Chapter } from '../../../models/Chapter';
import AdminTable from '../common/AdminTable';

const ChapterList: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const data = await chapterService.getAll(true);
      setChapters(data);
    } catch (error) {
      alert('Failed to fetch chapters');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (chapter: Chapter) => {
    if (!chapter.id) return;
    if (!window.confirm(`Delete chapter "${chapter.title}"?`)) return;
    try {
      await chapterService.delete(chapter.id);
      setChapters(chapters.filter(c => c.id !== chapter.id));
    } catch (error) {
      alert('Failed to delete chapter');
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' as keyof Chapter },
    { header: 'Order', accessor: 'order' as keyof Chapter },
    { header: 'Status', accessor: (c: Chapter) => c.isActive ? 'Active' : 'Inactive' },
    { header: 'Created', accessor: (c: Chapter) => new Date(c.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Chapters</h2>
        <Link to="/admin/chapters/new" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Add New Chapter
        </Link>
      </div>
      <AdminTable<Chapter>
        data={chapters}
        columns={columns}
        keyField="id"
        loading={loading}
        baseEditUrl="/admin/chapters"
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ChapterList; 