import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookCheck, Play, Download } from "lucide-react";
import { INITIAL_SUBJECTS } from "../mockData";
import { useAppContext } from "../AppContext";
import PdfViewer from "../components/PdfViewer";
import QuizView from "../components/QuizView";

export default function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const ctx = useAppContext();
  const {
    videos, papers, books, quizzes,
    activeClassroomTab, setActiveClassroomTab,
    activePaper, activeQuiz, setActivePaper, setActiveQuiz,
    setPlayingVideo,
    currentUser, handleToggleBookmark, handleIncrementDownloads, handleQuizSubmit,
    handleIncrementBookDownloads, getSubjectIconComponent,
  } = ctx;

  const subject = INITIAL_SUBJECTS.find((s) => s.id === subjectId);

  if (!subject) {
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
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-2">
        <button
          onClick={() => navigate("/")}
          className="p-1 px-3 bg-slate-900 border border-slate-800 rounded-lg text-xs hover:text-white transition-all active:scale-95"
        >
          &larr; Home
        </button>
        <span className="text-xs text-slate-400 font-mono">/ Classroom</span>
      </div>

      {/* Subject Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${subject.color} flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl`}>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-bold">
            {getSubjectIconComponent(subject.icon)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black">{subject.name} Classroom</h1>
            <p className="text-xs opacity-80 mt-1 max-w-sm">{subject.description}</p>
          </div>
        </div>
        <span className="text-[10px] bg-white/15 py-1 px-3 rounded-full font-mono border border-white/10 uppercase tracking-widest font-bold self-start sm:self-auto">
          CURRICULUM READY
        </span>
      </div>

      {/* Classroom Categories Navigation tabs */}
      <div className="flex flex-wrap border-b border-slate-800 gap-1 sm:gap-2">
        {(["notes", "videos", "books", "papers", "quizzes"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveClassroomTab(tab)}
            className={`py-2.5 px-4 rounded-t-xl text-xs font-bold transition-all ${
              activeClassroomTab === tab
                ? "bg-slate-900 border-t border-x border-slate-800 text-blue-400 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab === "notes" && "Syllabus Notes"}
            {tab === "videos" && "Streaming Video"}
            {tab === "books" && "Library Manuals"}
            {tab === "papers" && "Exam Papers"}
            {tab === "quizzes" && "Tests"}
          </button>
        ))}
      </div>

      {/* Classroom specific content compartments */}
      <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-850 min-h-[160px]">
        {activeClassroomTab === "notes" && (
          <div className="space-y-5 py-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
              <BookCheck className="w-4 h-4 mr-2 text-blue-500" /> Syllabus Core Notes Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-350">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <p className="font-bold text-white text-sm">Theme 1: Core Definitions & Terminology</p>
                <p className="text-slate-400">Master the primary variables and structured laws assessed in typical Paper 1 revisions. Familiarize yourself with constants, formulas, and structural boundaries of standard modules.</p>
                <span className="text-[10px] text-blue-400 font-mono inline-block mt-2">Recommended: Standard 2 Hours Revision</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <p className="font-bold text-white text-sm">Theme 2: Analytical Practice & Practical Tasks</p>
                <p className="text-slate-400">Understanding experiments, essay-writing setups, or truth tables is optimal for Paper 2 solutions. Focus heavily on structure blocks and mark guidelines to optimize results.</p>
                <span className="text-[10px] text-indigo-400 font-mono inline-block mt-2">Includes: Step-by-step marking guidelines</span>
              </div>
            </div>
          </div>
        )}

        {activeClassroomTab === "videos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.filter((v) => v.subject === subject.name).length === 0 ? (
              <div className="p-6 text-center text-slate-400 col-span-3">No streaming lessons uploaded for this classroom yet.</div>
            ) : (
              videos.filter((v) => v.subject === subject.name).map((v) => (
                <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col group hover:border-slate-700 transition-all">
                  <div className="relative aspect-video">
                    <img src={v.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="" referrerPolicy="no-referrer" />
                    <button
                      onClick={() => setPlayingVideo(v)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="w-10 h-10 text-white bg-blue-600 p-2.5 rounded-full" />
                    </button>
                    <span className="absolute bottom-2 right-2 bg-black/75 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-200">{v.duration}</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm line-clamp-1">{v.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{v.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800">
                      <span className="text-[10px] text-slate-500 font-mono">{v.level}</span>
                      <button onClick={() => setPlayingVideo(v)} className="text-[11px] text-blue-400 font-bold hover:underline">Watch now</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeClassroomTab === "books" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.filter((b) => b.subject === subject.name).length === 0 ? (
              <div className="p-6 text-center text-slate-400 col-span-3">No textbook modules currently logged.</div>
            ) : (
              books.filter((b) => b.subject === subject.name).map((b) => (
                <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-3 hover:border-slate-700 transition-colors">
                  <img src={b.coverImage} className="w-16 h-20 rounded-lg object-cover bg-slate-800 shadow" alt="" referrerPolicy="no-referrer" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm line-clamp-1">{b.title}</h4>
                      <p className="text-[11px] text-slate-400">By {b.author}</p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span>{b.fileSize}</span>
                      <button
                        onClick={() => {
                          handleIncrementBookDownloads(b.id);
                          alert("Document downloaded and stored in revision companions ledger!");
                        }}
                        className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" /> PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeClassroomTab === "papers" && (
          <div className="space-y-3">
            {papers.filter((p) => p.subject === subject.name).length === 0 ? (
              <div className="p-6 text-center text-slate-400">No school past papers logged.</div>
            ) : (
              papers.filter((p) => p.subject === subject.name).map((p) => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-white text-sm">{p.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{p.level} • {p.examType} Syllabus • {p.year}</p>
                  </div>
                  <button
                    onClick={() => setActivePaper(p)}
                    className="px-4 py-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:text-white hover:bg-blue-600 text-xs font-bold rounded-xl transition-all self-end sm:self-auto"
                  >
                    Access Exam Workspace
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeClassroomTab === "quizzes" && (
          <div className="space-y-3">
            {quizzes.filter((q) => q.subject === subject.name).length === 0 ? (
              <div className="p-6 text-center text-slate-400">No revision tests loaded.</div>
            ) : (
              quizzes.filter((q) => q.subject === subject.name).map((q) => (
                <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-white text-sm">{q.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{q.durationMinutes} Minutes • {q.questions.length} questions to challenge</p>
                  </div>
                  <button
                    onClick={() => setActiveQuiz(q)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all self-end sm:self-auto shadow-md"
                  >
                    Challenge Test
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
