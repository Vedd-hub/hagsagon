import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Announcement } from '../../models/Announcement';
import { firestoreService } from '../../services';
import { where, orderBy } from 'firebase/firestore';

const AnnouncementPageExample: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch announcements
    const fetchAnnouncements = async () => {
      try {
        const now = Date.now();
        const announcementsData = await firestoreService.query<Announcement>(
          'announcements',
          where('isActive', '==', true),
          where('publishDate', '<=', now),
          orderBy('publishDate', 'desc')
        );
        
        // Filter out expired announcements
        const activeAnnouncements = announcementsData.filter(
          announcement => !announcement.expiryDate || announcement.expiryDate > now
        );
        
        setAnnouncements(activeAnnouncements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Get prioritized class for announcements
  const getPriorityClass = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-500/10';
      case 'medium':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'low':
      default:
        return 'border-blue-500 bg-blue-500/10';
    }
  };

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
            Announcements & Updates
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-[#f5e1a0]/30 border-t-[#f5e1a0] rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-400">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-8 bg-white/5 rounded-lg">
              <p className="text-gray-400">No announcements at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-black/30 backdrop-blur-sm border-l-4 rounded-lg overflow-hidden ${getPriorityClass(announcement.priority)}`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-serif font-bold text-white">
                        {announcement.title}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {formatDate(announcement.publishDate)}
                      </span>
                    </div>
                    <p className="text-gray-300 whitespace-pre-line">
                      {announcement.content}
                    </p>
                    {announcement.expiryDate && (
                      <div className="mt-4 text-xs text-gray-400">
                        Valid until: {formatDate(announcement.expiryDate)}
                      </div>
                    )}
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

export default AnnouncementPageExample; 