import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, FileText, Video as VideoIcon, CheckSquare,
  BookOpen, ShieldAlert, ChevronRight, User, Sparkles
} from "lucide-react";
import { INITIAL_SUBJECTS } from "../mockData";
import { useAppContext } from "../AppContext";
import PdfViewer from "../components/PdfViewer";
import QuizView from "../components/QuizView";

export default function HomePage() {
  const navigate = useNavigate();
  const ctx = useAppContext();
  const {
    currentUser, bypassedGuest,
    announcements, activePaper, activeQuiz,
    setActivePaper, setActiveQuiz, setPlayingVideo,
    setIsRegisterMode, setAuthFullName, setAuthEmail, setShowAuthModal,
    handleToggleBookmark, handleIncrementDownloads, handleQuizSubmit,
    getSubjectIconComponent,
  } = ctx;

  const handleNav = (tab: string) => {
    ctx.resetDetailViews();
    switch (tab) {
      case "past-papers": navigate("/papers"); break;
      case "videos": navigate("/videos"); break;
      case "books": navigate("/books"); break;
      case "quizzes": navigate("/quizzes"); break;
      case "ai-assistant": navigate("/ai-assistant"); break;
      default: navigate("/"); break;
    }
  };

  // If showing a paper or quiz detail, render those instead
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
    <div className="space-y-10 animate-fade-in font-sans">
      {/* Custom Welcomer or Guest Alert Warning Alert */}
      {bypassedGuest && !currentUser && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Guest Observation Mode Active</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                Register your free student file or log in to preserve custom scores, save exam bookmarks, and chat with the AI Revision Companion!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsRegisterMode(true);
              setAuthFullName("");
              setAuthEmail("");
              setShowAuthModal(true);
            }}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs rounded-xl active:scale-95 transition-transform"
          >
            Enroll Free Account
          </button>
        </div>
      )}

      {/* Hero section or Personalized Student Dashboard Hub */}
      {currentUser ? (
        /* Active Student Dashboard Panel Card */
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 border border-slate-800/80 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden shadow-2xl text-left">
          <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Welcome and primary workspace commands */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-950 text-indigo-400 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full border border-indigo-500/20">
                STUDENT WORKSPACE ACTIVE
              </span>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Greetings, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{currentUser.fullName}</span>!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-lg">
                Your <strong className="text-white">{currentUser.studentClass} Syllabus</strong> workspace has been loaded. Track subject modules completion checklists, complete timing runs, or start typing questions in the AI Revision box.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    const classroomNode = document.getElementById("featured-subjects");
                    classroomNode?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center space-x-1.5 shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-center"
                >
                  <span>Browse Syllabus Classes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleNav("ai-assistant")}
                  className="px-5 py-3 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-extrabold text-xs rounded-2xl border border-slate-800 flex items-center justify-center space-x-1.5 transition-all active:scale-95 text-center"
                >
                  <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                  <span>Ask AI Revision Companion</span>
                </button>
              </div>
            </div>

            {/* Diagnostic Scorecard statistics columns */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl hover:border-slate-800 transition-colors">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">Interactive Runs</span>
                <span className="text-2xl font-black text-white font-mono block mt-1">{currentUser.quizAttempts?.length || 0}</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Tests graded</span>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl hover:border-slate-800 transition-colors">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">Correct Ratio</span>
                <span className="text-2xl font-black text-emerald-400 font-mono block mt-1">
                  {currentUser.quizAttempts?.length
                    ? `${Math.round(currentUser.quizAttempts.reduce((acc, c) => acc + c.percentage, 0) / currentUser.quizAttempts.length)}%`
                    : "N/A"
                  }
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Attempt average</span>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl hover:border-slate-800 transition-colors">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">Watched Lessons</span>
                <span className="text-2xl font-black text-blue-400 block mt-1">{currentUser.completedVideos?.length || 0}</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Finished videos</span>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl hover:border-slate-800 transition-colors">
                <span className="text-[9px] text-slate-500 font-mono block uppercase">Reference saved</span>
                <span className="text-2xl font-black text-indigo-400 block mt-1">
                  {((currentUser.bookmarks?.books?.length || 0) + (currentUser.bookmarks?.papers?.length || 0))}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Library bookmarks</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Visitor Public Hero section */
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 border border-slate-800/80 rounded-[2.5rem] p-6 sm:p-12 relative overflow-hidden shadow-xl font-sans">
          {/* Subtle Background Radial effects */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl space-y-5 relative z-10 text-left font-sans">
            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-900/40 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 fill-current animate-pulse mr-1" /> Mobile Learning System
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Learn Smarter With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Sensor Academy</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Instant mobile access to revision papers, step-by-step video classroom lessons, digital companion books, and timed multiple-choice tests.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  const classroomNode = document.getElementById("featured-subjects");
                  classroomNode?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl flex items-center justify-center space-x-1.5 shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-center"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleNav("ai-assistant")}
                className="px-6 py-3 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-2xl border border-slate-800 flex items-center justify-center space-x-1.5 transition-all active:scale-95 text-center"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Consult AI Study Mentor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Visitor Orientation Banner */}
      {!currentUser && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden text-left animate-fade-in">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Guest Classroom Mode</h3>
              <p className="text-xs text-slate-400 mt-1">
                You are currently browsing as a guest. Register your free student file or log in to track your scores, save bookmarked essays, and consult the AI Mentor profile.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => {
                setIsRegisterMode(true);
                setAuthFullName("");
                setAuthEmail("");
                setShowAuthModal(true);
              }}
              className="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl active:scale-95 transition-all text-center whitespace-nowrap cursor-pointer hover:shadow-lg hover:shadow-blue-500/10"
            >
              Register Student
            </button>
            <button
              onClick={() => {
                setIsRegisterMode(false);
                setAuthFullName("");
                setAuthEmail("");
                setShowAuthModal(true);
              }}
              className="flex-1 md:flex-none px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl active:scale-95 transition-all text-center whitespace-nowrap cursor-pointer"
            >
              Log In
            </button>
          </div>
        </div>
      )}

      {/* 2. Quick Navigate Feature Cards Grid */}
      <div id="quick-features" className="space-y-4">
        <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400 text-left">Primary Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div
            onClick={() => handleNav("past-papers")}
            className="bg-slate-900 border border-slate-800 hover:border-blue-500/35 rounded-3xl p-5 hover:bg-slate-850 cursor-pointer transition-all active:scale-95 flex flex-col justify-between h-40 group text-left"
          >
            <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white flex items-center justify-between">
                Past Papers <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">Complete exam catalog workspace.</p>
            </div>
          </div>

          <div
            onClick={() => handleNav("videos")}
            className="bg-slate-900 border border-slate-800 hover:border-indigo-500/35 rounded-3xl p-5 hover:bg-slate-850 cursor-pointer transition-all active:scale-95 flex flex-col justify-between h-40 group text-left"
          >
            <div className="w-10 h-10 bg-indigo-600/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <VideoIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white flex items-center justify-between">
                Video Lessons <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">High definition curriculum videos.</p>
            </div>
          </div>

          <div
            onClick={() => handleNav("books")}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/35 rounded-3xl p-5 hover:bg-slate-850 cursor-pointer transition-all active:scale-95 flex flex-col justify-between h-40 group text-left"
          >
            <div className="w-10 h-10 bg-emerald-600/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white flex items-center justify-between">
                Library Books <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">Digital coursebooks shelf.</p>
            </div>
          </div>

          <div
            onClick={() => handleNav("quizzes")}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/35 rounded-3xl p-5 hover:bg-slate-850 cursor-pointer transition-all active:scale-95 flex flex-col justify-between h-40 group text-left"
          >
            <div className="w-10 h-10 bg-amber-600/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white flex items-center justify-between">
                Quiz / Tests <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">Auto-graded multiple-choice runs.</p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. FEATURED SUBJECTS GRID */}
      <div id="featured-subjects" className="space-y-4">
        <div>
          <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400 text-left">Featured Subjects Classrooms</h3>
          <p className="text-[11px] text-slate-500 -mt-0.5 text-left">Click any subject class to browse notes, papers, videos, and quizzes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_SUBJECTS.map((sub) => (
            <div
              key={sub.id}
              onClick={() => navigate(`/subject/${sub.id}`)}
              className={`p-5 rounded-2xl cursor-pointer shadow-sm border flex items-center gap-4 transition-all hover:translate-y-[-2px] active:scale-95 ${sub.color} bg-opacity-70`}
            >
              <div className="p-3 bg-white/20 rounded-xl">
                {getSubjectIconComponent(sub.icon)}
              </div>
              <div className="text-left flex-1">
                <h4 className="font-bold text-slate-800 leading-tight mb-0.5">{sub.name}</h4>
                <p className="text-[11px] text-slate-650 line-clamp-1">{sub.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Latest Broadcast info bulletin */}
      <div className="space-y-4 text-left">
        <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400">Announcements bulletin</h3>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 divide-y divide-slate-800">
          {announcements.length === 0 ? (
            <p className="text-xs text-slate-500 py-3">No official notices posted.</p>
          ) : (
            announcements.map((ann) => (
              <div key={ann.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex justify-between items-start gap-3">
                  <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-500/20 py-0.5 px-2 rounded font-mono uppercase">
                    {ann.category} Alert
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(ann.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white mt-1.5">{ann.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{ann.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
