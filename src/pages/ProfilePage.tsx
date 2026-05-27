import React from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { useAppContext } from "../AppContext";
import PdfViewer from "../components/PdfViewer";
import QuizView from "../components/QuizView";

export default function ProfilePage() {
  const navigate = useNavigate();
  const ctx = useAppContext();
  const {
    currentUser, activePaper, activeQuiz, setActivePaper, setActiveQuiz,
    setActiveBook, handleToggleBookmark, handleIncrementDownloads, handleQuizSubmit,
    handleLogout, books, papers, resetDetailViews,
  } = ctx;

  if (!currentUser) {
    navigate("/");
    return null;
  }

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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-left">
      {/* Profile header */}
      <div className="bg-slate-900 border border-slate-850 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-3xl font-sans text-white border-2 border-slate-700 shadow-xl">
          {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "S"}
        </div>

        <div className="flex-1 space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-white">{currentUser.fullName}</h2>
          <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
          <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
            <span className="text-[10px] bg-slate-950 border border-slate-800 py-0.5 px-2.5 rounded font-mono uppercase text-slate-400">{currentUser.studentClass}</span>
            <span className="text-[10px] bg-blue-950/40 border border-blue-500/20 py-0.5 px-2.5 rounded font-mono text-blue-400">Since {new Date(currentUser.joinedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <button
          onClick={() => {
            handleLogout();
            navigate("/");
          }}
          className="sm:absolute sm:top-6 sm:right-6 text-xs text-rose-500 hover:text-white font-semibold py-1.5 px-3 hover:bg-rose-950/20 rounded-xl border border-rose-500/20 transition-all active:scale-95 shrink-0"
        >
          Logout Account
        </button>
      </div>

      {/* Stats board */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl">
          <p className="text-[10px] text-slate-500 font-mono uppercase">Completed Videos</p>
          <p className="text-xl font-bold text-white font-mono mt-0.5">{currentUser.completedVideos?.length || 0}</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl">
          <p className="text-[10px] text-slate-500 font-mono uppercase">Bookmarked Papers</p>
          <p className="text-xl font-bold text-white font-mono mt-0.5">{currentUser.bookmarks?.papers?.length || 0}</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl">
          <p className="text-[10px] text-slate-500 font-mono uppercase">Cumulative Tests</p>
          <p className="text-xl font-bold text-white font-mono mt-0.5">{currentUser.quizAttempts?.length || 0}</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl">
          <p className="text-[10px] text-slate-500 font-mono uppercase">Averages</p>
          <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
            {currentUser.quizAttempts?.length
              ? `${Math.round(currentUser.quizAttempts.reduce((acc, c) => acc + c.percentage, 0) / currentUser.quizAttempts.length)}%`
              : "N/A"
            }
          </p>
        </div>
      </div>

      {/* Bookmarked lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bookmarked Syllabus Books */}
        <div className="bg-slate-900 border border-slate-850 rounded-3xl p-5 space-y-4">
          <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-350">Bookmarked Study Books</h3>
          {currentUser.bookmarks?.books?.length === 0 ? (
            <p className="text-xs text-slate-500">No books marked in study library. Move to Library tab to browse!</p>
          ) : (
            <div className="space-y-2">
              {books.filter((b) => currentUser.bookmarks.books.includes(b.id)).map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setActiveBook(b);
                    navigate("/books");
                  }}
                  className="p-3 bg-slate-950/60 rounded-xl border border-slate-805 hover:border-slate-700 cursor-pointer flex items-center justify-between text-xs transition-transform hover:scale-[1.01]"
                >
                  <span>{b.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{b.subject}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookmarked Papers */}
        <div className="bg-slate-900 border border-slate-850 rounded-3xl p-5 space-y-4">
          <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-350">Bookmarked Exam Papers</h3>
          {currentUser.bookmarks?.papers?.length === 0 ? (
            <p className="text-xs text-slate-500">No exam papers bookmarked yet. Save papers in Exam Catalog!</p>
          ) : (
            <div className="space-y-2">
              {papers.filter((p) => currentUser.bookmarks.papers.includes(p.id)).map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setActivePaper(p);
                  }}
                  className="p-3 bg-slate-950/60 rounded-xl border border-slate-805 hover:border-slate-700 cursor-pointer flex items-center justify-between text-xs transition-transform hover:scale-[1.01]"
                >
                  <span>{p.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{p.subject}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quiz Attempts Ledger history list */}
      <div className="bg-slate-900 border border-slate-850 rounded-3xl p-5 space-y-4">
        <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-350 flex items-center">
          <ClipboardList className="w-4.5 h-4.5 mr-2 text-blue-500" /> TIMED Quizzes Attempts ledger
        </h3>

        {currentUser.quizAttempts?.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No tests completed yet. Begin testing in Quizzes tab!</p>
        ) : (
          <div className="divide-y divide-slate-800">
            {currentUser.quizAttempts.map((attempt) => (
              <div key={attempt.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-white text-sm">{attempt.quizTitle}</p>
                  <p className="text-slate-400 mt-0.5">
                    Subject: {attempt.subject} • Completed: {new Date(attempt.takenAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
                  <span className={`py-1 px-3.5 rounded-full font-bold font-mono text-[10px] ${
                    attempt.percentage >= 75 ? "bg-emerald-950/20 text-emerald-400" : attempt.percentage >= 50 ? "bg-indigo-950/20 text-indigo-400" : "bg-rose-950/20 text-rose-400"
                  }`}>
                    {attempt.score} / {attempt.totalQuestions} ({attempt.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
