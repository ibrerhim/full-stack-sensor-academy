import React, { useState, useEffect } from "react";
import { 
  Calculator, BookOpen, Dna, FlaskConical, Laptop, Atom, 
  ArrowRight, FileText, Video as VideoIcon, CheckSquare, 
  Award, Play, Download, Search, Settings, ShieldAlert,
  ArrowUpRight, BookCheck, ClipboardList, Clock, Bookmark,
  ChevronRight, Calendar, User, Eye, EyeOff, ArrowLeft, Volume2, Sparkles, Check
} from "lucide-react";

import { 
  User as UserType, Subject, Video, PastPaper, Book, Quiz, 
  Notification, Announcement, QuizAttempt 
} from "./types";

import { 
  INITIAL_SUBJECTS, INITIAL_VIDEOS, INITIAL_PAPERS, 
  INITIAL_BOOKS, INITIAL_QUIZZES, INITIAL_NOTIFICATIONS, 
  INITIAL_ANNOUNCEMENTS 
} from "./mockData";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import PdfViewer from "./components/PdfViewer";
import QuizView from "./components/QuizView";
import AdminPanel from "./components/AdminPanel";
import AiStudyAssistant from "./components/AiStudyAssistant";

export default function App() {
  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState<string>("home");
  
  // Database States (Hydrated from LocalStorage or falling back to static preloaded definitions)
  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem("sensor_db_videos");
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [papers, setPapers] = useState<PastPaper[]>(() => {
    const saved = localStorage.getItem("sensor_db_papers");
    return saved ? JSON.parse(saved) : INITIAL_PAPERS;
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem("sensor_db_books");
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem("sensor_db_quizzes");
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem("sensor_db_notifications");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem("sensor_db_announcements");
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // Current Logged Student state (Defaults to null so new visitors can experience landing -> register -> login)
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem("sensor_student_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Guest bypass mode state for elegant onboarding first landing experience
  const [bypassedGuest, setBypassedGuest] = useState<boolean>(() => {
    const saved = localStorage.getItem("sensor_guest_bypassed");
    return saved === "true";
  });

  // Active Subject classroom selection state
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [activeClassroomTab, setActiveClassroomTab] = useState<"notes" | "videos" | "books" | "papers" | "quizzes">("notes");

  // Selection states for modal/full-view workspaces
  const [activePaper, setActivePaper] = useState<PastPaper | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [activeBook, setActiveBook] = useState<Book | null>(null);

  // Authentication Dialog Drawer
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authClass, setAuthClass] = useState("GCE");

  // Multi-Filter hooks
  const [videoFilterSubject, setVideoFilterSubject] = useState("All");
  const [videoFilterLevel, setVideoFilterLevel] = useState("All");
  const [videoSearch, setVideoSearch] = useState("");

  const [paperFilterSubject, setPaperFilterSubject] = useState("All");
  const [paperFilterType, setPaperFilterType] = useState("All");
  const [paperSearch, setPaperSearch] = useState("");

  const [bookFilterSubject, setBookFilterSubject] = useState("All");
  const [bookSearch, setBookSearch] = useState("");

  // Save states to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("sensor_db_videos", JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem("sensor_db_papers", JSON.stringify(papers));
  }, [papers]);

  useEffect(() => {
    localStorage.setItem("sensor_db_books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("sensor_db_quizzes", JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem("sensor_db_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("sensor_db_announcements", JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("sensor_student_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("sensor_student_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("sensor_guest_bypassed", bypassedGuest ? "true" : "false");
  }, [bypassedGuest]);

  // Load user session on boot if storage has a token
  useEffect(() => {
    const token = localStorage.getItem("sensor_student_token");
    if (token) {
      fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error("Invalid session token");
        return res.json();
      })
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(err => {
        console.warn("Session auto-refresh failed:", err);
        localStorage.removeItem("sensor_student_token");
        setCurrentUser(null);
      });
    }
  }, []);

  // Fetch admin student data roster if authenticated administrator logs in
  const [allStudents, setAllStudents] = useState<UserType[]>([]);
  useEffect(() => {
    if (currentUser?.isAdmin) {
      const token = localStorage.getItem("sensor_student_token");
      fetch("/api/admin/users", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.users) {
          setAllStudents(data.users);
        }
      })
      .catch(err => console.error("Could not fetch students list:", err));
    }
  }, [currentUser]);

  // Admin-driven trigger to toggle admin status
  const handleToggleAdminStatus = async (userId: string, currentIsAdmin: boolean) => {
    const token = localStorage.getItem("sensor_student_token");
    if (!token) return;
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isAdmin: !currentIsAdmin })
      });
      if (response.ok) {
        // Refresh the student list
        const refreshed = await fetch("/api/admin/users", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await refreshed.json();
        if (data.users) {
          setAllStudents(data.users);
        }
      }
    } catch (err) {
      console.error("Failed to toggle admin status:", err);
    }
  };

  // Admin-driven trigger to delete a user profile
  const handleDeleteUserProfile = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this student file? This action is irreversible.")) {
      return;
    }
    const token = localStorage.getItem("sensor_student_token");
    if (!token) return;
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        // Refresh the student list
        const refreshed = await fetch("/api/admin/users", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await refreshed.json();
        if (data.users) {
          setAllStudents(data.users);
        }
      }
    } catch (err) {
      console.error("Failed to delete user profile:", err);
    }
  };

  // Global triggers
  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Reset secondary views
    setActivePaper(null);
    setActiveQuiz(null);
    setPlayingVideo(null);
    setActiveBook(null);
    setSelectedSubject(null);
  };

  // Student Account Login & Registry
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || (!authFullName.trim() && isRegisterMode)) return;

    try {
      const defaultPassword = "Pass" + authEmail.trim().replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) + "123!";
      const payload = {
        email: authEmail.trim(),
        password: authPassword.trim() || defaultPassword,
        fullName: authFullName.trim() || "Student User",
        studentClass: authClass,
        isAdmin: authEmail.toLowerCase().includes("admin") || authEmail.toLowerCase().trim() === "alebpeters@gmail.com"
      };

      const endpoint = isRegisterMode ? "/api/auth/register" : "/api/auth/login";
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(errData.error || "Authentication failed. Please verify credentials.");
        return;
      }

      const data = await response.json();
      if (data.token && data.user) {
        localStorage.setItem("sensor_student_token", data.token);
        setCurrentUser(data.user);
        
        setShowAuthModal(false);
        setBypassedGuest(false);
        setAuthEmail("");
        setAuthFullName("");
        setAuthPassword("");
      }
    } catch (err) {
      console.error("Authentication dispatch error:", err);
      // Fallback local simulation if server experiences offline latency
      const mockUser: UserType = {
        id: "stud_" + Date.now(),
        fullName: authFullName || "Offline Student",
        email: authEmail.trim(),
        studentClass: authClass,
        joinedAt: new Date().toISOString(),
        isAdmin: authEmail.toLowerCase().includes("admin") || authEmail.toLowerCase().trim() === "alebpeters@gmail.com",
        bookmarks: { papers: [], videos: [], books: [] },
        completedVideos: [],
        quizAttempts: [],
      };
      setCurrentUser(mockUser);
      setShowAuthModal(false);
      setBypassedGuest(false);
      setAuthEmail("");
      setAuthFullName("");
      setAuthPassword("");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("sensor_student_user");
    localStorage.removeItem("sensor_student_token");
    setBypassedGuest(false);
    localStorage.removeItem("sensor_guest_bypassed");
    handleTabChange("home");
  };

  // Bookmarking flow
  const handleToggleBookmark = async (category: "papers" | "videos" | "books", id: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    const updatedBookmarks = { ...currentUser.bookmarks };
    const list = updatedBookmarks[category] || [];

    if (list.includes(id)) {
      updatedBookmarks[category] = list.filter((item) => item !== id);
    } else {
      updatedBookmarks[category] = [...list, id];
    }

    // Update Client instantly for high latency compensation
    setCurrentUser({
      ...currentUser,
      bookmarks: updatedBookmarks,
    });

    const token = localStorage.getItem("sensor_student_token");
    if (token) {
      try {
        await fetch("/api/users/bookmarks", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ bookmarks: updatedBookmarks })
        });
      } catch (err) {
        console.error("Could not sync bookmarks on backend:", err);
      }
    }
  };

  // Complete video tracking
  const handleCompleteVideo = async (videoId: string) => {
    if (!currentUser) return;
    const completed = currentUser.completedVideos || [];
    if (!completed.includes(videoId)) {
      const updatedList = [...completed, videoId];
      setCurrentUser({
        ...currentUser,
        completedVideos: updatedList,
      });

      const token = localStorage.getItem("sensor_student_token");
      if (token) {
        try {
          await fetch("/api/users/videos", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ completedVideos: updatedList })
          });
        } catch (err) {
          console.error("Could not sync video progress:", err);
        }
      }
    }
  };

  // Quiz submission log
  const handleQuizSubmit = async (attempt: QuizAttempt) => {
    if (!currentUser) return;
    const previousAttempts = currentUser.quizAttempts || [];
    setCurrentUser({
      ...currentUser,
      quizAttempts: [attempt, ...previousAttempts],
    });

    const token = localStorage.getItem("sensor_student_token");
    if (token) {
      try {
        await fetch("/api/quizzes/attempt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(attempt)
        });
      } catch (err) {
        console.error("Could not save score history:", err);
      }
    }
  };

  // PDF / Paper download counters
  const handleIncrementDownloads = (paperId: string) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === paperId ? { ...p, downloadCount: p.downloadCount + 1 } : p))
    );
  };

  const handleIncrementBookDownloads = (bookId: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, downloadCount: b.downloadCount + 1 } : b))
    );
  };

  // Administrators catalog state updates
  const handleAdminAddVideo = (newVid: Video) => {
    setVideos((prev) => [newVid, ...prev]);
  };

  const handleAdminAddPaper = (newPaper: PastPaper) => {
    setPapers((prev) => [newPaper, ...prev]);
  };

  const handleAdminAddBook = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  const handleAdminAddQuiz = (newQuiz: Quiz) => {
    setQuizzes((prev) => [newQuiz, ...prev]);
  };

  const handleAdminSendAnnouncement = (newAnn: Announcement) => {
    setAnnouncements((prev) => [newAnn, ...prev]);
    // Also inject a clean live notification alert trigger to update student notification counters instantly!
    const newNotif: Notification = {
      id: "notif_ann_" + Date.now(),
      title: `⚡ ADMIN BROADCAST: ${newAnn.title}`,
      message: newAnn.content,
      type: "announcement",
      timestamp: newAnn.timestamp,
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Administration deletions
  const handleAdminDeleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAdminDeletePaper = (id: string) => {
    setPapers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAdminDeleteBook = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAdminDeleteQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  // Live Filtering Queries
  const filteredVideos = videos.filter((v) => {
    const matchSubject = videoFilterSubject === "All" || v.subject === videoFilterSubject;
    const matchLevel = videoFilterLevel === "All" || v.level.toLowerCase().includes(videoFilterLevel.toLowerCase());
    const matchSearch = v.title.toLowerCase().includes(videoSearch.toLowerCase()) || v.subject.toLowerCase().includes(videoSearch.toLowerCase());
    return matchSubject && matchLevel && matchSearch;
  });

  const filteredPapers = papers.filter((p) => {
    const matchSubject = paperFilterSubject === "All" || p.subject === paperFilterSubject;
    const matchType = paperFilterType === "All" || p.examType === paperFilterType;
    const matchSearch = p.title.toLowerCase().includes(paperSearch.toLowerCase()) || p.level.toLowerCase().includes(paperSearch.toLowerCase());
    return matchSubject && matchType && matchSearch;
  });

  const filteredBooks = books.filter((b) => {
    const matchSubject = bookFilterSubject === "All" || b.subject === bookFilterSubject;
    const matchSearch = b.title.toLowerCase().includes(bookSearch.toLowerCase()) || b.author.toLowerCase().includes(bookSearch.toLowerCase());
    return matchSubject && matchSearch;
  });

  // Load subject specific cards inside classrooms
  const loadSubjectClassroom = (subj: Subject) => {
    setSelectedSubject(subj);
    setActiveClassroomTab("notes");
  };

  // Get current component icons helper dynamically
  const getSubjectIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Calculator": return <Calculator className="w-6 h-6" />;
      case "BookOpen": return <BookOpen className="w-6 h-6" />;
      case "Dna": return <Dna className="w-6 h-6" />;
      case "FlaskConical": return <FlaskConical className="w-6 h-6" />;
      case "Laptop": return <Laptop className="w-6 h-6" />;
      case "Atom": return <Atom className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  // Render the official Premium Onboarding Landing experience if no student is active
  if (!currentUser) {
    return (
      <div id="sensor-academy-landing" className="bg-slate-950 text-slate-100 min-h-screen font-sans flex flex-col justify-between relative overflow-hidden">
        {/* Top ambient blurred decorative accent circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Header Branding Row on Landing Page */}
        <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-slate-900/50 z-15 relative">
          <div className="flex items-center space-x-3 select-none">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/20">
              <span className="text-xl font-extrabold text-white">S</span>
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white leading-none">Sensor Academy</h1>
              <p className="text-[9px] text-slate-400 font-mono tracking-widest mt-0.5">SYLLABUS EDUCATION HUB</p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono px-3 py-1 bg-blue-950 border border-blue-500/30 rounded-full text-blue-400">
            Secure Student Gateway
          </span>
        </header>

        {/* Main Split Interface Area */}
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center z-10 relative flex-1">
          {/* LEFT COLUMN: HERO INFORMATION PANEL */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-900/40 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 fill-current animate-pulse mr-1" />
              <span>National Syllabus Ready</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight">
                Learn Smarter. Revise Faster.<br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-indigo-500">
                  Excel Together.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-xl">
                The high-performance workspace for secondary and GCE candidates. Turn your mobile device into a virtual classroom with premium video tutorials, master manuals, past exam catalogs, and interactive testing engines.
              </p>

              {/* Get Started and Sign In controls that redirect to registration/login inputs */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    const element = document.getElementById("auth-card");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "center" });
                      element.classList.add("ring-2", "ring-blue-500", "scale-[1.01]");
                      setTimeout(() => {
                        element.classList.remove("ring-2", "ring-blue-500", "scale-[1.01]");
                      }, 1200);
                    }
                  }}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Get Started (Create Account)
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    const element = document.getElementById("auth-card");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "center" });
                      element.classList.add("ring-2", "ring-blue-500/55", "scale-[1.02]");
                      setTimeout(() => {
                        element.classList.remove("ring-2", "ring-blue-500/55", "scale-[1.02]");
                      }, 1200);
                    }
                  }}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-slate-700 font-bold rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  Sign In to Academic Profile
                </button>
              </div>
            </div>

            {/* Platform capabilities grid preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start space-x-3 bg-slate-900/40 p-4 border border-slate-900 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">National PDF Exam Catalog</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Study real revision past papers with integrated split-screen question references.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-slate-900/40 p-4 border border-slate-900 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20">
                  <VideoIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Streaming Classroom Lessons</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Learn difficult concepts step-by-step with curriculum videos from expert faculties.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-slate-900/40 p-4 border border-slate-900 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Digital Textbook Library</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Log instant downloads to offline guides, key books, and master syllabus booklets.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 bg-slate-900/40 p-4 border border-slate-900 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/20">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Interactive TIMED Assessments</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Take auto-graded diagnostic exams with instant correct solutions review ledger.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE AUTH ONBOARDING FORM */}
          <div className="lg:col-span-12 xl:col-span-5 lg:mx-auto lg:max-w-md w-full relative">
            <div id="auth-card" className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />

              {/* Toggle controls tab header */}
              <div className="bg-slate-950 p-1 rounded-2xl flex gap-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isRegisterMode
                      ? "bg-slate-900 text-blue-400 font-bold border border-slate-800"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Create Student File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    !isRegisterMode
                      ? "bg-slate-900 text-blue-400 font-bold border border-slate-800"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Student Log In
                </button>
              </div>

              <div className="space-y-2 text-left">
                <h3 className="text-lg font-black text-white">
                  {isRegisterMode ? "Register Student Account" : "Access Authorized Portfolio"}
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {isRegisterMode
                    ? "Establish your custom academic records file to bookmark exam booklets, study streaming courses, and generate scorecards."
                    : "Synchronize current curriculum progress, bookmark shortcuts, and consult your customized AI study mentor."}
                </p>
              </div>

              {/* Form implementation */}
              <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
                {isRegisterMode && (
                  <div className="space-y-1.5 text-xs">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel Peters"
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500 font-sans"
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
                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500 font-sans"
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
                      className="w-full bg-slate-950 border border-slate-800 p-3 pr-10 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500 font-sans"
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
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Academic Level</label>
                    <select
                      value={authClass}
                      onChange={(e) => setAuthClass(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white outline-none font-sans"
                    >
                      <option value="GCE">GCE National Syllabus</option>
                      <option value="Form 1">Form 1 Secondary</option>
                      <option value="Form 2">Form 2 Secondary</option>
                      <option value="Form 3">Form 3 Secondary</option>
                      <option value="Form 4">Form 4 Secondary (ZIMSEC)</option>
                      <option value="Grade 11">Grade 11 Highschool Code</option>
                      <option value="Grade 12">Grade 12 National Exam Class</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs transition-colors shadow-lg shadow-blue-500/25 active:scale-95 flex items-center justify-center space-x-1"
                >
                  <span>{isRegisterMode ? "Instantiate Student File & Log In" : "Unlocks Student Portfolio →"}</span>
                </button>
              </form>

              {/* Action toggle trigger below */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-xs text-slate-400 hover:text-white transition-colors animate-pulse"
                >
                  {isRegisterMode ? "Have a profile account? Log in" : "Need to log a new file? Register free"}
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer branding of landing */}
        <footer className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 border-t border-slate-900/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 z-10 relative gap-3">
          <p>© 2026 Sensor Academy. Syllabus-aligned revision workspace assets.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 transition-colors">Digital Study System</span>
            <span className="hover:text-slate-300 transition-colors font-mono">Ver 2.50.0</span>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div id="sensor-academy-root" className="bg-slate-950 text-slate-100 min-h-screen font-sans pb-24">
      {/* Premium Navigation Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
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
        
        {/* Dynamic Inner Full views (PDF workspace / Quiz Engines) */}
        {activePaper ? (
          <PdfViewer
            paper={activePaper}
            isBookmarked={currentUser?.bookmarks?.papers?.includes(activePaper.id) || false}
            onToggleBookmark={() => handleToggleBookmark("papers", activePaper.id)}
            onBack={() => setActivePaper(null)}
            onIncrementDownloads={handleIncrementDownloads}
          />
        ) : activeQuiz ? (
          <QuizView
            quiz={activeQuiz}
            onBack={() => setActiveQuiz(null)}
            onQuizSubmit={handleQuizSubmit}
          />
        ) : selectedSubject ? (
          /* Classroom workspace card detail view */
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={() => setSelectedSubject(null)}
                className="p-1 px-3 bg-slate-900 border border-slate-800 rounded-lg text-xs hover:text-white transition-all active:scale-95"
              >
                ← Home
              </button>
              <span className="text-xs text-slate-400 font-mono">/ Classroom</span>
            </div>

            {/* Subject Banner */}
            <div className={`p-6 sm:p-8 rounded-3xl border ${selectedSubject.color} flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl`}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-bold">
                  {getSubjectIconComponent(selectedSubject.icon)}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black">{selectedSubject.name} Classroom</h1>
                  <p className="text-xs opacity-80 mt-1 max-w-sm">{selectedSubject.description}</p>
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
                  {tab === "notes" && "📖 Syllabus Notes"}
                  {tab === "videos" && "🎥 Streaming Video"}
                  {tab === "books" && "📚 Library Manuals"}
                  {tab === "papers" && "📄 Exam Papers"}
                  {tab === "quizzes" && "⏱️ Tests"}
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
                  {videos.filter((v) => v.subject === selectedSubject.name).length === 0 ? (
                    <div className="p-6 text-center text-slate-400 col-span-3">No streaming lessons uploaded for this classroom yet.</div>
                  ) : (
                    videos.filter((v) => v.subject === selectedSubject.name).map((v) => (
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
                  {books.filter((b) => b.subject === selectedSubject.name).length === 0 ? (
                    <div className="p-6 text-center text-slate-400 col-span-3">No textbook modules currently logged.</div>
                  ) : (
                    books.filter((b) => b.subject === selectedSubject.name).map((b) => (
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
                  {papers.filter((p) => p.subject === selectedSubject.name).length === 0 ? (
                    <div className="p-6 text-center text-slate-400">No school past papers logged.</div>
                  ) : (
                    papers.filter((p) => p.subject === selectedSubject.name).map((p) => (
                      <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-white text-sm">{p.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{p.level} • {p.examType} Syllabus • {p.year}</p>
                        </div>
                        <button
                          onClick={() => setActivePaper(p)}
                          className="px-4 py-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:text-white hover:bg-blue-600 text-xs font-bold rounded-xl transition-all self-end sm:self-auto"
                        >
                          Access Exam Workspace 📄
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeClassroomTab === "quizzes" && (
                <div className="space-y-3">
                  {quizzes.filter((q) => q.subject === selectedSubject.name).length === 0 ? (
                    <div className="p-6 text-center text-slate-400">No revision tests loaded.</div>
                  ) : (
                    quizzes.filter((q) => q.subject === selectedSubject.name).map((q) => (
                      <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-white text-sm">{q.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{q.durationMinutes} Minutes • {q.questions.length} questions to challenge</p>
                        </div>
                        <button
                          onClick={() => setActiveQuiz(q)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all self-end sm:self-auto shadow-md"
                        >
                          Challenge Test ⏱️
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Landing tabs */
          <div>
            {/* 1. HOMEPAGE TAB */}
            {activeTab === "home" && (
              <div className="space-y-10 animate-fade-in font-sans">
                {/* Custom Welcomer or Guest Alert Warning Alert */}
                {bypassedGuest && !currentUser && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">🔒 Guest Observation Mode Active</h4>
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
                          🎓 STUDENT WORKSPACE ACTIVE
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
                            onClick={() => handleTabChange("ai-assistant")}
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
                          onClick={() => handleTabChange("ai-assistant")}
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
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">🔒 Guest Classroom Mode</h3>
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
                      onClick={() => handleTabChange("past-papers")}
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
                      onClick={() => handleTabChange("videos")}
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
                      onClick={() => handleTabChange("books")}
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
                      onClick={() => handleTabChange("quizzes")}
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
                        onClick={() => loadSubjectClassroom(sub)}
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
            )}

            {/* 3. VIDEOS LISTING TAB */}
            {activeTab === "videos" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-left">
                    <h2 className="text-lg font-black text-white">Curriculum Video Lessons Library</h2>
                    <p className="text-xs text-slate-400">Stream comprehensive concept lectures anytime from your device.</p>
                  </div>

                  {/* Search box inside panel */}
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
            )}

            {/* 4. PAST PAPERS CATALOGUE TAB */}
            {activeTab === "past-papers" && (
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
            )}

            {/* 5. DIGITAL LIBRARY BOOKS TAB */}
            {activeTab === "books" && (
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
            )}

            {/* 6. TIMED QUIZZES SELECTION TAB */}
            {activeTab === "quizzes" && (
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
            )}

            {/* 7. STUDENT PROFILE / ACCOUNT DASHBOARD */}
            {activeTab === "profile" && currentUser && (
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
                    onClick={handleLogout}
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
                    <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-350">🔖 Bookmarked Study Books</h3>
                    {currentUser.bookmarks?.books?.length === 0 ? (
                      <p className="text-xs text-slate-500">No books marked in study library. Move to Library tab to browse!</p>
                    ) : (
                      <div className="space-y-2">
                        {books.filter((b) => currentUser.bookmarks.books.includes(b.id)).map((b) => (
                          <div
                            key={b.id}
                            onClick={() => {
                              setActiveBook(b);
                              handleTabChange("books");
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
                    <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-350">📄 Bookmarked Exam Papers</h3>
                    {currentUser.bookmarks?.papers?.length === 0 ? (
                      <p className="text-xs text-slate-500">No exam papers bookmarked yet. Save papers in Exam Catalog!</p>
                    ) : (
                      <div className="space-y-2">
                        {papers.filter((p) => currentUser.bookmarks.papers.includes(p.id)).map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              setActivePaper(p);
                              handleTabChange("past-papers");
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
            )}

            {/* 8. BROAD ADMINISTRATIVE HUB VIEW */}
            {activeTab === "admin" && currentUser?.isAdmin && (
              <AdminPanel
                onAddVideo={handleAdminAddVideo}
                onAddPaper={handleAdminAddPaper}
                onAddBook={handleAdminAddBook}
                onAddQuiz={handleAdminAddQuiz}
                onSendAnnouncement={handleAdminSendAnnouncement}
                allVideos={videos}
                allPapers={papers}
                allBooks={books}
                allQuizzes={quizzes}
                allStudents={allStudents.length > 0 ? allStudents : [currentUser]} // Preload registering list
                onDeleteVideo={handleAdminDeleteVideo}
                onDeletePaper={handleAdminDeletePaper}
                onDeleteBook={handleAdminDeleteBook}
                onDeleteQuiz={handleAdminDeleteQuiz}
                onToggleAdminStatus={handleToggleAdminStatus}
                onDeleteUser={handleDeleteUserProfile}
              />
            )}

            {/* 9. AI study assistant TAB */}
            {activeTab === "ai-assistant" && (
              <AiStudyAssistant />
            )}
          </div>
        )}
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
                  <span className="font-bold">💡 Pro-Tip:</span> Write any student name & email to log in instantly, or use <code className="bg-slate-950 px-1 py-0.5 rounded text-white font-mono">alebpeters@gmail.com</code> with any name to restore <strong className="text-white">Samuel Peters (Admin)</strong> study portfolio!
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
