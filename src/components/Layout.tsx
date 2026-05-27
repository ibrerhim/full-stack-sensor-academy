import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { Video as VideoIcon, Check } from "lucide-react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { useAppContext } from "../AppContext";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const ctx = useAppContext();

  const {
    currentUser, activePaper, activeQuiz, playingVideo,
    setPlayingVideo, handleCompleteVideo, handleToggleBookmark,
    showAuthModal, setShowAuthModal, isRegisterMode, setIsRegisterMode,
    showPassword, setShowPassword, authEmail, setAuthEmail,
    authFullName, setAuthFullName, authPassword, setAuthPassword,
    authClass, setAuthClass, handleAuthSubmit,
    notifications, markNotificationsAsRead,
    papers, videos, books, quizzes,
    setActivePaper, setActiveQuiz, setActiveBook,
    resetDetailViews,
  } = ctx;

  // Map route path to a "tab" id for BottomNav highlighting
  const getActiveTab = (): string => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path === "/videos") return "videos";
    if (path === "/papers") return "past-papers";
    if (path === "/books") return "books";
    if (path === "/quizzes") return "quizzes";
    if (path === "/profile") return "profile";
    if (path === "/admin") return "admin";
    if (path === "/ai-assistant") return "ai-assistant";
    if (path.startsWith("/subject/")) return "home";
    return "home";
  };

  // Handle tab change by navigating to the proper route
  const handleTabChange = (tab: string) => {
    resetDetailViews();
    switch (tab) {
      case "home": navigate("/"); break;
      case "videos": navigate("/videos"); break;
      case "past-papers": navigate("/papers"); break;
      case "books": navigate("/books"); break;
      case "quizzes": navigate("/quizzes"); break;
      case "profile": navigate("/profile"); break;
      case "admin": navigate("/admin"); break;
      case "ai-assistant": navigate("/ai-assistant"); break;
      default: navigate("/"); break;
    }
  };

  const activeTab = getActiveTab();

  return (
    <div id="sensor-academy-root" className="bg-slate-950 text-slate-100 min-h-screen font-sans pb-24">
      {/* Premium Navigation Header */}
      <Header
        currentUser={currentUser}
        onLogout={() => {
          ctx.handleLogout();
          navigate("/");
        }}
        onLoginClick={() => {
          setIsRegisterMode(false);
          setShowAuthModal(true);
        }}
        onTabChange={handleTabChange}
        onSelectPaper={(p) => setActivePaper(p)}
        onSelectVideo={(v) => setPlayingVideo(v)}
        onSelectBook={(b) => setActiveBook(b)}
        onSelectQuiz={(q) => setActiveQuiz(q)}
        notifications={notifications}
        markNotificationsAsRead={markNotificationsAsRead}
        searchableContent={{ papers, videos, books, quizzes }}
      />

      {/* Main Core View Router */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Floating Action Button for direct AI Study Assistant access from any page */}
      {activeTab !== "ai-assistant" && !activePaper && !activeQuiz && (
        <button
          onClick={() => handleTabChange("ai-assistant")}
          className="fixed bottom-20 right-4 sm:right-6 z-35 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-full shadow-2xl shadow-blue-500/35 border border-blue-500 hover:border-blue-400 flex items-center space-x-1.5 transition-transform active:scale-90 hover:scale-[1.03] duration-200"
        >
          <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
          <span>Ask AI Mentor</span>
        </button>
      )}

      {/* Persistent responsive Bottom tab controls navigation bar */}
      {!activePaper && !activeQuiz && (
        <BottomNav
          currentTab={activeTab}
          onTabChange={handleTabChange}
          currentUser={currentUser}
        />
      )}

      {/* Interactive watch lessons Modal Frame when selected */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-2xl w-full flex flex-col shadow-2xl">
            {/* Header close button */}
            <div className="bg-slate-950 p-4 border-b border-slate-850 flex justify-between items-center text-left">
              <div>
                <span className="text-[10px] text-blue-400 font-mono font-bold tracking-wider rounded-full border border-blue-500/20 py-0.5 px-2.5 uppercase">{playingVideo.subject} Lesson</span>
                <h3 className="font-bold text-white text-sm line-clamp-1 mt-1">{playingVideo.title}</h3>
              </div>
              <button
                onClick={() => setPlayingVideo(null)}
                className="text-slate-400 hover:text-white font-bold text-lg font-mono px-2"
              >
                ×
              </button>
            </div>

            {/* Simulated frame or Youtube embed */}
            <div className="aspect-video bg-black flex items-center justify-center relative">
              {playingVideo.videoUrl.includes("youtube.com") ? (
                <iframe
                  title={playingVideo.title}
                  src={playingVideo.videoUrl}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-center p-10 space-y-4">
                  <VideoIcon className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Custom classroom stream loading. Preparing offline syllabus module...</p>
                </div>
              )}
            </div>

            {/* Description controls */}
            <div className="p-5 text-left bg-slate-950 space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-450 border-b border-slate-850 pb-3">
                <span>Duration: {playingVideo.duration}</span>
                <span>Instructor: {playingVideo.instructor || "Sensor Faculty"}</span>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Lesson details:</span>
                <p className="text-xs text-slate-305 leading-relaxed font-sans">{playingVideo.description}</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    handleCompleteVideo(playingVideo.id);
                    setPlayingVideo(null);
                    alert("Congratulations! Video tutorial marked as complete, increments logged to scorecard statistics!");
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark Lesson as Completed</span>
                </button>
                <button
                  onClick={() => handleToggleBookmark("videos", playingVideo.id)}
                  className={`w-full py-2 border text-xs font-bold rounded-xl transition-colors ${
                    currentUser?.bookmarks?.videos?.includes(playingVideo.id)
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-500"
                      : "bg-slate-900 border-slate-800 text-slate-350 hover:text-white"
                  }`}
                >
                  {currentUser?.bookmarks?.videos?.includes(playingVideo.id) ? "Bookmarked!" : "Save to Bookmarks"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Signup Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-left">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg font-mono focus:outline-none"
            >
              ×
            </button>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-white">
                {isRegisterMode ? "Register Student File" : "Student Login Profile"}
              </h3>
              <p className="text-xs text-slate-400">
                Authorized credentials synchronizes results, scorecard history, and bookmarks.
              </p>
              {!isRegisterMode && (
                <div className="p-3 bg-blue-950/20 border border-blue-500/25 rounded-xl text-[11px] text-blue-400 leading-relaxed font-sans mt-2">
                  <span className="font-bold">Pro-Tip:</span> Write any student name & email to log in instantly, or use <code className="bg-slate-950 px-1 py-0.5 rounded text-white font-mono">alebpeters@gmail.com</code> with any name to restore <strong className="text-white">Samuel Peters (Admin)</strong> study portfolio!
                </div>
              )}
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegisterMode && (
                <div className="space-y-1.5 text-xs">
                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Peters"
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="space-y-1.5 text-xs">
                <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alebpeters@gmail.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-3 pr-10 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                    title={showPassword ? "Hide Password" : "Show Password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {isRegisterMode && (
                <div className="space-y-1.5 text-xs">
                  <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Syllabus Academic Level</label>
                  <select
                    value={authClass}
                    onChange={(e) => setAuthClass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none"
                  >
                    <option value="GCE">GCE Syllabus</option>
                    <option value="Form 1">Form 1 Secondary</option>
                    <option value="Form 2">Form 2 Secondary</option>
                    <option value="Form 3">Form 3 Secondary</option>
                    <option value="Form 4">Form 4 Secondary (ZIMSEC)</option>
                    <option value="Grade 11">Grade 11 (High School)</option>
                    <option value="Grade 12">Grade 12 (High School)</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-blue-500/20 active:scale-95 mt-2"
              >
                {isRegisterMode ? "Complete Registration" : "Log In Student Profile"}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold focus:outline-none"
              >
                {isRegisterMode
                  ? "Already have an account? Log in"
                  : "Need to create a student file? Register instead"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
