import React from "react";
import { Search, Download } from "lucide-react";
import { useAppContext } from "../AppContext";
import PdfViewer from "../components/PdfViewer";
import QuizView from "../components/QuizView";

export default function BooksPage() {
  const ctx = useAppContext();
  const {
    activePaper, activeQuiz, setActivePaper, setActiveQuiz,
    currentUser, handleToggleBookmark, handleIncrementDownloads, handleQuizSubmit,
    filteredBooks, bookFilterSubject, setBookFilterSubject,
    bookSearch, setBookSearch, handleIncrementBookDownloads,
  } = ctx;

  if (activePaper) {
    return (
      <PdfViewer
        paper={activePaper}
        isBookmarked={currentUser?.bookmarks?.papers?.includes(activePaper.id) || false}
        onToggleBookmark={() => handleToggleBookmark("papers", activePaper.id)}
        onBack={() => setActivePaper(null)}
        onIncrementDownloads={handleIncrementDownloads}
      />
    );
  }

  if (activeQuiz) {
    return (
      <QuizView
        quiz={activeQuiz}
        onBack={() => setActiveQuiz(null)}
        onQuizSubmit={handleQuizSubmit}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h2 className="text-lg font-black text-white">Digital Library Bookshelves</h2>
          <p className="text-xs text-slate-400">Download curriculum textbooks and modular handbook companions offline.</p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search books..."
            value={bookSearch}
            onChange={(e) => setBookSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 rounded-xl text-xs text-white"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Library Subject Filters */}
      <div className="flex items-center space-x-2 bg-slate-900/50 p-4 border border-slate-850 rounded-2xl">
        <span className="text-[10px] font-mono uppercase text-slate-500">Subject Class:</span>
        <select
          value={bookFilterSubject}
          onChange={(e) => setBookFilterSubject(e.target.value)}
          className="bg-slate-955 border border-slate-800 py-1.5 px-3 rounded-lg text-xs"
        >
          <option value="All">All Subjects</option>
          <option value="Mathematics">Mathematics</option>
          <option value="English Language">English Language</option>
          <option value="Biology">Biology</option>
          <option value="Chemistry">Chemistry</option>
          <option value="ICT">ICT</option>
        </select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.length === 0 ? (
          <div className="p-10 text-center text-slate-400 col-span-3">No textbooks available for this category.</div>
        ) : (
          filteredBooks.map((b) => (
            <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors text-left space-y-4">
              <div className="flex gap-4">
                <img src={b.coverImage} className="w-20 h-28 object-cover rounded-xl shadowbg-slate-950" alt="" referrerPolicy="no-referrer" />
                <div className="space-y-1">
                  <span className="text-[9px] bg-slate-950 border border-slate-850 py-0.5 px-2 rounded-full font-mono text-slate-400 block w-max uppercase">{b.subject}</span>
                  <h3 className="font-bold text-white text-sm line-clamp-2 mt-1">{b.title}</h3>
                  <p className="text-[11px] text-slate-500">Author: {b.author}</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{b.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-500">{b.fileSize} / {b.downloadCount} downloads</span>
                <button
                  onClick={() => {
                    handleIncrementBookDownloads(b.id);
                    alert("Textbook downloaded successfully and synchronized in memory logs!");
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-xl flex items-center shadow transition-transform active:scale-95"
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> PDF Ebook
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
