import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Calculator, BookOpen, Dna, FlaskConical, Laptop, Atom
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

export interface AppContextType {
  // Data
  videos: Video[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  papers: PastPaper[];
  setPapers: React.Dispatch<React.SetStateAction<PastPaper[]>>;
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;

  // User
  currentUser: UserType | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  bypassedGuest: boolean;
  setBypassedGuest: React.Dispatch<React.SetStateAction<boolean>>;

  // Subject classroom
  selectedSubject: Subject | null;
  setSelectedSubject: React.Dispatch<React.SetStateAction<Subject | null>>;
  activeClassroomTab: "notes" | "videos" | "books" | "papers" | "quizzes";
  setActiveClassroomTab: React.Dispatch<React.SetStateAction<"notes" | "videos" | "books" | "papers" | "quizzes">>;

  // Active detail views
  activePaper: PastPaper | null;
  setActivePaper: React.Dispatch<React.SetStateAction<PastPaper | null>>;
  activeQuiz: Quiz | null;
  setActiveQuiz: React.Dispatch<React.SetStateAction<Quiz | null>>;
  playingVideo: Video | null;
  setPlayingVideo: React.Dispatch<React.SetStateAction<Video | null>>;
  activeBook: Book | null;
  setActiveBook: React.Dispatch<React.SetStateAction<Book | null>>;

  // Auth modal
  showAuthModal: boolean;
  setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
  isRegisterMode: boolean;
  setIsRegisterMode: React.Dispatch<React.SetStateAction<boolean>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  authEmail: string;
  setAuthEmail: React.Dispatch<React.SetStateAction<string>>;
  authFullName: string;
  setAuthFullName: React.Dispatch<React.SetStateAction<string>>;
  authPassword: string;
  setAuthPassword: React.Dispatch<React.SetStateAction<string>>;
  authClass: string;
  setAuthClass: React.Dispatch<React.SetStateAction<string>>;

  // Filters
  videoFilterSubject: string;
  setVideoFilterSubject: React.Dispatch<React.SetStateAction<string>>;
  videoFilterLevel: string;
  setVideoFilterLevel: React.Dispatch<React.SetStateAction<string>>;
  videoSearch: string;
  setVideoSearch: React.Dispatch<React.SetStateAction<string>>;
  paperFilterSubject: string;
  setPaperFilterSubject: React.Dispatch<React.SetStateAction<string>>;
  paperFilterType: string;
  setPaperFilterType: React.Dispatch<React.SetStateAction<string>>;
  paperSearch: string;
  setPaperSearch: React.Dispatch<React.SetStateAction<string>>;
  bookFilterSubject: string;
  setBookFilterSubject: React.Dispatch<React.SetStateAction<string>>;
  bookSearch: string;
  setBookSearch: React.Dispatch<React.SetStateAction<string>>;

  // Admin
  allStudents: UserType[];
  setAllStudents: React.Dispatch<React.SetStateAction<UserType[]>>;

  // Computed
  filteredVideos: Video[];
  filteredPapers: PastPaper[];
  filteredBooks: Book[];

  // Handlers
  markNotificationsAsRead: () => void;
  handleAuthSubmit: (e: React.FormEvent) => Promise<void>;
  handleLogout: () => void;
  handleToggleBookmark: (category: "papers" | "videos" | "books", id: string) => Promise<void>;
  handleCompleteVideo: (videoId: string) => Promise<void>;
  handleQuizSubmit: (attempt: QuizAttempt) => Promise<void>;
  handleIncrementDownloads: (paperId: string) => void;
  handleIncrementBookDownloads: (bookId: string) => void;
  handleAdminAddVideo: (newVid: Video) => void;
  handleAdminAddPaper: (newPaper: PastPaper) => void;
  handleAdminAddBook: (newBook: Book) => void;
  handleAdminAddQuiz: (newQuiz: Quiz) => void;
  handleAdminSendAnnouncement: (newAnn: Announcement) => void;
  handleAdminDeleteVideo: (id: string) => void;
  handleAdminDeletePaper: (id: string) => void;
  handleAdminDeleteBook: (id: string) => void;
  handleAdminDeleteQuiz: (id: string) => void;
  handleToggleAdminStatus: (userId: string, currentIsAdmin: boolean) => Promise<void>;
  handleDeleteUserProfile: (userId: string) => Promise<void>;
  loadSubjectClassroom: (subj: Subject) => void;
  getSubjectIconComponent: (iconName: string) => React.ReactNode;
  resetDetailViews: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Database States
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

  // User
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem("sensor_student_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [bypassedGuest, setBypassedGuest] = useState<boolean>(() => {
    const saved = localStorage.getItem("sensor_guest_bypassed");
    return saved === "true";
  });

  // Subject classroom
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [activeClassroomTab, setActiveClassroomTab] = useState<"notes" | "videos" | "books" | "papers" | "quizzes">("notes");

  // Detail views
  const [activePaper, setActivePaper] = useState<PastPaper | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [activeBook, setActiveBook] = useState<Book | null>(null);

  // Auth
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authClass, setAuthClass] = useState("GCE");

  // Filters
  const [videoFilterSubject, setVideoFilterSubject] = useState("All");
  const [videoFilterLevel, setVideoFilterLevel] = useState("All");
  const [videoSearch, setVideoSearch] = useState("");
  const [paperFilterSubject, setPaperFilterSubject] = useState("All");
  const [paperFilterType, setPaperFilterType] = useState("All");
  const [paperSearch, setPaperSearch] = useState("");
  const [bookFilterSubject, setBookFilterSubject] = useState("All");
  const [bookSearch, setBookSearch] = useState("");

  // Admin
  const [allStudents, setAllStudents] = useState<UserType[]>([]);

  // localStorage sync effects
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

  // Load user session on boot
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

  // Fetch admin student data
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

  // Handlers
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

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetDetailViews = () => {
    setActivePaper(null);
    setActiveQuiz(null);
    setPlayingVideo(null);
    setActiveBook(null);
    setSelectedSubject(null);
  };

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
  };

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

  // Filtered data
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

  const loadSubjectClassroom = (subj: Subject) => {
    setSelectedSubject(subj);
    setActiveClassroomTab("notes");
  };

  const getSubjectIconComponent = (iconName: string): React.ReactNode => {
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

  const value: AppContextType = {
    videos, setVideos,
    papers, setPapers,
    books, setBooks,
    quizzes, setQuizzes,
    notifications, setNotifications,
    announcements, setAnnouncements,
    currentUser, setCurrentUser,
    bypassedGuest, setBypassedGuest,
    selectedSubject, setSelectedSubject,
    activeClassroomTab, setActiveClassroomTab,
    activePaper, setActivePaper,
    activeQuiz, setActiveQuiz,
    playingVideo, setPlayingVideo,
    activeBook, setActiveBook,
    showAuthModal, setShowAuthModal,
    isRegisterMode, setIsRegisterMode,
    showPassword, setShowPassword,
    authEmail, setAuthEmail,
    authFullName, setAuthFullName,
    authPassword, setAuthPassword,
    authClass, setAuthClass,
    videoFilterSubject, setVideoFilterSubject,
    videoFilterLevel, setVideoFilterLevel,
    videoSearch, setVideoSearch,
    paperFilterSubject, setPaperFilterSubject,
    paperFilterType, setPaperFilterType,
    paperSearch, setPaperSearch,
    bookFilterSubject, setBookFilterSubject,
    bookSearch, setBookSearch,
    allStudents, setAllStudents,
    filteredVideos, filteredPapers, filteredBooks,
    markNotificationsAsRead,
    handleAuthSubmit, handleLogout,
    handleToggleBookmark, handleCompleteVideo,
    handleQuizSubmit,
    handleIncrementDownloads, handleIncrementBookDownloads,
    handleAdminAddVideo, handleAdminAddPaper, handleAdminAddBook, handleAdminAddQuiz,
    handleAdminSendAnnouncement,
    handleAdminDeleteVideo, handleAdminDeletePaper, handleAdminDeleteBook, handleAdminDeleteQuiz,
    handleToggleAdminStatus, handleDeleteUserProfile,
    loadSubjectClassroom, getSubjectIconComponent,
    resetDetailViews,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
