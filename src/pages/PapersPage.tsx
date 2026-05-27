import React from "react";
import { Search, Bookmark } from "lucide-react";
import { useAppContext } from "../AppContext";
import PdfViewer from "../components/PdfViewer";
import QuizView from "../components/QuizView";

export default function PapersPage() {
  const ctx = useAppContext();
  const {
    activePaper, activeQuiz, setActivePaper, setActiveQuiz,
    currentUser, handleToggleBookmark, handleIncrementDownloads, handleQuizSubmit,
    filteredPapers, paperFilterSubject, setPaperFilterSubject,
    paperFilterType, setPaperFilterType, paperSearch, setPaperSearch,
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
          <h2 className="text-lg font-black text-white">National & Mock Past Papers Center</h2>
          <p className="text-xs text-slate-400">Review real exam structured questions and mark solutions.</p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search past papers..."
            value={paperSearch}
            onChange={(e) => setPaperSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 rounded-xl text-xs text-white"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-slate-900/50 p-4 border border-slate-850 rounded-2xl">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono uppercase text-slate-500">Subject:</span>
          <select
            value={paperFilterSubject}
            onChange={(e) => setPaperFilterSubject(e.target.value)}
            className="bg-slate-950 border border-slate-800 py-1.5 px-3 rounded-lg text-xs"
          >
            <option value="All">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English Language">English Language</option>
            <option value="Biology">Biology</option>
            <option value="Chemistry">Chemistry</option>
            <option value="ICT">ICT</option>
            <option value="Physical Science">Physical Science</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono uppercase text-slate-500">Exam Board:</span>
          <select
            value={paperFilterType}
            onChange={(e) => setPaperFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-800 py-1.5 px-3 rounded-lg text-xs"
          >
            <option value="All">All Exam Boards</option>
            <option value="GCE">GCE Assessment</option>
            <option value="ZIMSEC">ZIMSEC Syllabus</option>
            <option value="Cambridge">Cambridge Revision</option>
            <option value="National Exams">National Exams</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredPapers.length === 0 ? (
          <div className="p-10 text-center text-slate-400">No past papers found matching query categories.</div>
        ) : (
          filteredPapers.map((p) => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] bg-blue-900/30 text-blue-450 border border-blue-500/20 px-2 py-0.5 rounded font-mono font-semibold uppercase">{p.examType}</span>
                  <span className="text-xs text-slate-500 font-mono">Published {p.year}</span>
                </div>
                <h3 className="font-bold text-white text-base leading-snug">{p.title}</h3>
                <p className="text-xs text-slate-450 line-clamp-1">{p.description}</p>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
                <button
                  onClick={() => handleToggleBookmark("papers", p.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    currentUser?.bookmarks?.papers?.includes(p.id)
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-500"
                      : "bg-slate-950 border-slate-800 text-slate-450 hover:text-white"
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
                <button
                  onClick={() => setActivePaper(p)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center space-x-1 shadow transition-colors active:scale-95"
                >
                  <span>Open Exam Workspace</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
