import React from "react";
import { CheckSquare, Clock } from "lucide-react";
import { useAppContext } from "../AppContext";
import PdfViewer from "../components/PdfViewer";
import QuizView from "../components/QuizView";

export default function QuizzesPage() {
  const ctx = useAppContext();
  const {
    activePaper, activeQuiz, setActivePaper, setActiveQuiz,
    currentUser, handleToggleBookmark, handleIncrementDownloads, handleQuizSubmit,
    quizzes,
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
      <div className="text-left">
        <h2 className="text-lg font-black text-white">Online TIMED Quizzes & Testing Engine</h2>
        <p className="text-xs text-slate-400">Attempt interactive assessments, complete automatic grading, and study feedback.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((q) => (
          <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-left hover:border-slate-700 transition-colors flex flex-col justify-between group space-y-5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-amber-950/40 text-amber-400 border border-amber-500/10 py-0.5 px-2 rounded font-mono uppercase">{q.subject}</span>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider">{q.level} • TIMED</span>
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">{q.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">This quiz features **{q.questions.length} multiple-choice question sets** with an assessment time allocation of **{q.durationMinutes} minutes**.</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 mt-2">
              <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{q.durationMinutes} Mins</span>
              </div>
              <button
                onClick={() => setActiveQuiz(q)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-1"
              >
                <span>Challenge Test</span>
                <CheckSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
