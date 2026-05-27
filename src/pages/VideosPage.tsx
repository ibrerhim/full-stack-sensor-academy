import React from "react";
import { Search, Play } from "lucide-react";
import { useAppContext } from "../AppContext";
import PdfViewer from "../components/PdfViewer";
import QuizView from "../components/QuizView";

export default function VideosPage() {
  const ctx = useAppContext();
  const {
    activePaper, activeQuiz, setActivePaper, setActiveQuiz,
    currentUser, handleToggleBookmark, handleIncrementDownloads, handleQuizSubmit,
    filteredVideos, videoFilterSubject, setVideoFilterSubject,
    videoFilterLevel, setVideoFilterLevel, videoSearch, setVideoSearch,
    setPlayingVideo,
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
          <h2 className="text-lg font-black text-white">Curriculum Video Lessons Library</h2>
          <p className="text-xs text-slate-400">Stream comprehensive concept lectures anytime from your device.</p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search videos..."
            value={videoSearch}
            onChange={(e) => setVideoSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 pl-9 pr-3 py-2 rounded-xl text-xs text-white"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Video Filters bar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/50 p-4 border border-slate-850 rounded-2xl">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono uppercase text-slate-500">Classroom:</span>
          <select
            value={videoFilterSubject}
            onChange={(e) => setVideoFilterSubject(e.target.value)}
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
          <span className="text-[10px] font-mono uppercase text-slate-500">Level:</span>
          <select
            value={videoFilterLevel}
            onChange={(e) => setVideoFilterLevel(e.target.value)}
            className="bg-slate-950 border border-slate-800 py-1.5 px-3 rounded-lg text-xs"
          >
            <option value="All">All Levels</option>
            <option value="Form 1">Form 1</option>
            <option value="Form 2">Form 2</option>
            <option value="Form 3">Form 3</option>
            <option value="Form 4">Form 4</option>
            <option value="GCE">GCE</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>
        </div>
      </div>

      {/* Video list grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.length === 0 ? (
          <div className="p-10 text-center text-slate-400 col-span-3">No video lessons matched query details.</div>
        ) : (
          filteredVideos.map((v) => (
            <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow duration-300 hover:border-slate-700 flex flex-col group">
              <div className="relative aspect-video">
                <img src={v.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" referrerPolicy="no-referrer" />
                <button
                  onClick={() => setPlayingVideo(v)}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="w-10 h-10 text-white bg-blue-600 p-2.5 rounded-full" />
                </button>
                <span className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-250">{v.duration}</span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between text-left">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white line-clamp-1">{v.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{v.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] text-blue-400 bg-blue-900/20 px-2 py-0.5 rounded font-mono">{v.subject}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{v.level}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
