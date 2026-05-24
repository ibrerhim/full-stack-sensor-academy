import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, User, LogIn, Shield, Check, BookOpen, Video, FileText, CheckSquare } from "lucide-react";
import { User as UserType, Notification, PastPaper, Video as VideoType, Book, Quiz } from "../types";

interface HeaderProps {
  currentUser: UserType | null;
  onLogout: () => void;
  onLoginClick: () => void;
  onTabChange: (tab: string) => void;
  onSelectPaper: (paper: PastPaper) => void;
  onSelectVideo: (video: VideoType) => void;
  onSelectBook: (book: Book) => void;
  onSelectQuiz: (quiz: Quiz) => void;
  notifications: Notification[];
  markNotificationsAsRead: () => void;
  searchableContent: {
    papers: PastPaper[];
    videos: VideoType[];
    books: Book[];
    quizzes: Quiz[];
  };
}

export default function Header({
  currentUser,
  onLogout,
  onLoginClick,
  onTabChange,
  onSelectPaper,
  onSelectVideo,
  onSelectBook,
  onSelectQuiz,
  notifications,
  markNotificationsAsRead,
  searchableContent
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotificationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter Search elements
  const getSearchResults = () => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();

    const papersMatch = searchableContent.papers.filter(
      (p) => p.title.toLowerCase().includes(query) || p.subject.toLowerCase().includes(query) || p.level.toLowerCase().includes(query)
    );
    const videosMatch = searchableContent.videos.filter(
      (v) => v.title.toLowerCase().includes(query) || v.subject.toLowerCase().includes(query) || v.level.toLowerCase().includes(query)
    );
    const booksMatch = searchableContent.books.filter(
      (b) => b.title.toLowerCase().includes(query) || b.subject.toLowerCase().includes(query) || b.level.toLowerCase().includes(query)
    );
    const quizzesMatch = searchableContent.quizzes.filter(
      (q) => q.title.toLowerCase().includes(query) || q.subject.toLowerCase().includes(query) || q.level.toLowerCase().includes(query)
    );

    const matchCount = papersMatch.length + videosMatch.length + booksMatch.length + quizzesMatch.length;
    if (matchCount === 0) return null;

    return { papersMatch, videosMatch, booksMatch, quizzesMatch };
  };

  const results = getSearchResults();

  const handleSearchResultClick = (type: "paper" | "video" | "book" | "quiz", item: any) => {
    setSearchQuery("");
    setShowSearchDropdown(false);
    if (type === "paper") {
      onSelectPaper(item);
      onTabChange("past-papers");
    } else if (type === "video") {
      onSelectVideo(item);
      onTabChange("videos");
    } else if (type === "book") {
      onSelectBook(item);
      onTabChange("books");
    } else if (type === "quiz") {
      onSelectQuiz(item);
      onTabChange("quizzes");
    }
  };

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div 
          onClick={() => onTabChange("home")} 
          className="flex items-center space-x-3 cursor-pointer group active:scale-95 transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:bg-blue-500 transition-colors">
            <span className="text-xl font-bold font-sans text-white">S</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight font-sans text-white group-hover:text-blue-400 transition-colors">
              Sensor Academy
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider -mt-1 hidden sm:block">
              EDUCATIONAL SYSTEM
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div ref={searchRef} className="flex-1 max-w-md mx-6 relative hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search papers, videos, books, quizzes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-full bg-slate-800/80 text-sm placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-800 transition-all font-sans"
            />
          </div>

          {/* Search Dropdown Panel */}
          {showSearchDropdown && results && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50 divide-y divide-slate-700 animate-fade-in">
              {results.papersMatch.length > 0 && (
                <div className="p-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-slate-400 px-3 py-1 flex items-center">
                    <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> Past Papers
                  </span>
                  {results.papersMatch.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSearchResultClick("paper", p)}
                      className="p-3 hover:bg-slate-750 rounded-xl cursor-pointer text-sm flex justify-between items-center text-slate-200 hover:text-white transition-colors"
                    >
                      <div>
                        <p className="font-semibold line-clamp-1">{p.title}</p>
                        <p className="text-xs text-slate-400">{p.subject} • {p.level} • {p.year}</p>
                      </div>
                      <span className="text-[10px] bg-blue-900/40 text-blue-300 font-mono py-0.5 px-2 rounded-full border border-blue-500/20">{p.examType}</span>
                    </div>
                  ))}
                </div>
              )}

              {results.videosMatch.length > 0 && (
                <div className="p-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-slate-400 px-3 py-1 flex items-center">
                    <Video className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Video Lessons
                  </span>
                  {results.videosMatch.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => handleSearchResultClick("video", v)}
                      className="p-3 hover:bg-slate-750 rounded-xl cursor-pointer text-sm flex justify-between items-center text-slate-200 hover:text-white transition-colors"
                    >
                      <div>
                        <p className="font-semibold line-clamp-1">{v.title}</p>
                        <p className="text-xs text-slate-400">{v.subject} • {v.level} • {v.duration}</p>
                      </div>
                      <span className="text-[10px] bg-indigo-900/40 text-indigo-300 font-mono py-0.5 px-2 rounded-full border border-indigo-500/20">Video</span>
                    </div>
                  ))}
                </div>
              )}

              {results.booksMatch.length > 0 && (
                <div className="p-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-slate-400 px-3 py-1 flex items-center">
                    <BookOpen className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Library Books
                  </span>
                  {results.booksMatch.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => handleSearchResultClick("book", b)}
                      className="p-3 hover:bg-slate-750 rounded-xl cursor-pointer text-sm flex justify-between items-center text-slate-200 hover:text-white transition-colors"
                    >
                      <div>
                        <p className="font-semibold line-clamp-1">{b.title}</p>
                        <p className="text-xs text-slate-400">By {b.author} • {b.subject} • {b.fileSize}</p>
                      </div>
                      <span className="text-[10px] bg-emerald-900/40 text-emerald-300 font-mono py-0.5 px-2 rounded-full border border-emerald-500/20">Book</span>
                    </div>
                  ))}
                </div>
              )}

              {results.quizzesMatch.length > 0 && (
                <div className="p-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-slate-400 px-3 py-1 flex items-center">
                    <CheckSquare className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Quizzes & Tests
                  </span>
                  {results.quizzesMatch.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => handleSearchResultClick("quiz", q)}
                      className="p-3 hover:bg-slate-750 rounded-xl cursor-pointer text-sm flex justify-between items-center text-slate-200 hover:text-white transition-colors"
                    >
                      <div>
                        <p className="font-semibold line-clamp-1">{q.title}</p>
                        <p className="text-xs text-slate-400">{q.subject} • {q.level} • {q.questions.length} questions</p>
                      </div>
                      <span className="text-[10px] bg-amber-900/40 text-amber-300 font-mono py-0.5 px-2 rounded-full border border-amber-500/20">Timed</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {showSearchDropdown && searchQuery.trim() && !results && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-4 text-center text-sm text-slate-400 z-50">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>

        {/* Right Corner Buttons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Notifications Dropdown */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => {
                setShowNotificationDropdown(!showNotificationDropdown);
                if (!showNotificationDropdown && unreadCount > 0) {
                  // Wait brief moment or mark as read instantly
                  markNotificationsAsRead();
                }
              }}
              className="relative p-2 text-slate-350 hover:text-white hover:bg-slate-800 focus:outline-none rounded-full transition-colors active:scale-95"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-slate-900" />
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-850 hover:bg-slate-850/98 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in select-none">
                <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-white">Latest Notifications</h3>
                  <button 
                    onClick={() => {
                      markNotificationsAsRead();
                      setShowNotificationDropdown(false);
                    }} 
                    className="text-xs text-blue-450 hover:text-blue-400 font-medium transition-colors"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-750">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-500 font-sans">
                      No notifications available
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 flex gap-3 transition-colors ${
                          notification.read ? "bg-transparent text-slate-350" : "bg-blue-950/20 text-white border-l-2 border-blue-500"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-sm font-semibold">{notification.title}</p>
                            {!notification.read && (
                              <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
                          <span className="text-[10px] text-slate-500 font-mono mt-2 block">
                            {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Navigation Area */}
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onTabChange("profile")}
                className="flex items-center space-x-2 p-1.5 pr-3 hover:bg-slate-850 border border-slate-750 hover:border-slate-700 rounded-full transition-all group active:scale-95 text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white border border-slate-600 shadow-sm group-hover:from-blue-500 group-hover:to-indigo-500 transition-all">
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "S"}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-white truncate max-w-[100px] leading-tight">
                    {currentUser.fullName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono leading-none">
                    {currentUser.studentClass || "Student"}
                  </p>
                </div>
              </button>
              {currentUser.isAdmin && (
                <button
                  onClick={() => onTabChange("admin")}
                  title="Admin Settings"
                  className="p-2 bg-indigo-950/40 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/40 border border-indigo-500/20 hover:border-indigo-500/40 rounded-full transition-all active:scale-95 shrink-0 hidden md:flex items-center"
                >
                  <Shield className="w-5 h-5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-full shadow-lg shadow-blue-500/25 border border-blue-500 hover:border-blue-400 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Login / Join</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
