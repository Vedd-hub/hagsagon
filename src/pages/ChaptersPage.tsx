import React, { useState } from 'react';
import MainLayout from '../components/main/MainLayout';
import { fundamentalRightsData } from '../data/fundamental-rights-data';

interface Article {
  id: string;
  title: string;
  shortDescription: string;
  fullContent: string;
}

const ChaptersPage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <div className="min-h-screen flex flex-row bg-gradient-to-br from-[#232b39] via-[#181e26] to-[#1a2233]">
      {/* Sidebar is rendered by MainLayout, so just render main content flush */}
      <MainLayout>
        <div className="relative w-full p-0 overflow-x-hidden">
          {/* Decorative blurred background */}
          <div className="absolute -z-10 top-10 left-1/2 transform -translate-x-1/2 w-[350px] h-[350px] sm:w-[700px] sm:h-[700px] bg-gradient-to-br from-[#ffe066]/30 via-[#f5e1a0]/20 to-[#232b39]/10 rounded-full blur-3xl opacity-40" />

          <div className="w-full max-w-6xl px-2 sm:px-8 pt-10 pb-20 mx-0">
            {/* Sticky header */}
            <header className="mb-10 flex flex-col items-center text-center sticky top-0 z-20 bg-transparent pb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl">⚖️</span>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-[#ffe066] drop-shadow-lg font-serif tracking-tight">Fundamental Rights</h1>
              </div>
              <p className="text-lg sm:text-2xl text-gray-200 mt-2 max-w-2xl font-medium">
                Part III (Articles 12-35) of the Constitution of India
              </p>
            </header>

            {/* Section intro card */}
            <div className="bg-[#ffe066]/10 backdrop-blur-md border-l-8 border-[#ffe066] rounded-2xl shadow-xl p-8 mb-12 flex flex-col items-center max-w-3xl mx-auto">
              <span className="text-2xl sm:text-3xl mb-2 text-[#ffe066] font-serif italic text-center">“Rights are not given; they exist by reason of the fact that we are human beings.”</span>
              <span className="text-base text-[#bfa77a] font-semibold mt-2">— Dr. B.R. Ambedkar</span>
            </div>

            <section>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-[#ffe066] font-serif tracking-tight text-center drop-shadow">Explore the Fundamental Rights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {fundamentalRightsData.map((article: Article, idx) => (
                  <div
                    key={article.id}
                    className="bg-white/20 backdrop-blur-lg border-l-8 border-[#ffe066] rounded-2xl shadow-2xl p-7 flex flex-col justify-between hover:scale-[1.025] hover:shadow-3xl transition-transform duration-200 min-h-[240px] group relative"
                  >
                    {/* Optional emoji/icon for first few articles */}
                    <div className="absolute -top-6 left-6 text-3xl select-none pointer-events-none">
                      {idx === 0 && '🏛️'}
                      {idx === 1 && '⚖️'}
                      {idx === 2 && '🟨'}
                      {idx === 3 && '🚫'}
                      {idx === 4 && '💼'}
                      {idx === 5 && '❌'}
                      {idx === 6 && '🎖️'}
                      {idx === 7 && '🗣️'}
                      {idx === 8 && '🔒'}
                      {idx === 9 && '❤️'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#ffe066] font-serif mb-2 drop-shadow-sm group-hover:text-white transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-100 mb-4 text-base min-h-[48px] font-medium">
                        {article.shortDescription}
                      </p>
                    </div>
                    <button
                      className="mt-auto px-4 py-2 bg-[#ffe066] text-[#232b39] font-bold rounded-lg shadow hover:bg-[#fff3b0] transition-colors text-base"
                      onClick={() => setSelectedArticle(article)}
                    >
                      Read More
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Modal for full article */}
          {selectedArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="relative bg-gradient-to-br from-[#232b39] via-[#181e26] to-[#1a2233] border-2 border-[#ffe066]/60 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8 animate-fade-in">
                <button
                  className="absolute top-4 right-4 text-[#ffe066] text-3xl font-bold hover:text-white transition-colors bg-white/10 rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                  onClick={() => setSelectedArticle(null)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h3 className="text-2xl font-bold text-[#ffe066] font-serif mb-4 drop-shadow">{selectedArticle.title}</h3>
                <div
                  className="prose prose-invert max-w-none text-white"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.fullContent }}
                />
              </div>
            </div>
          )}
          <style>{`
            .animate-fade-in { animation: fadeIn 0.3s; }
            @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
          `}</style>
        </div>
      </MainLayout>
    </div>
  );
};

export default ChaptersPage;