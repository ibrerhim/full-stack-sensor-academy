import React, { useState } from "react";
import { Video, FileText, BookOpen, AlertCircle, Plus, Trash2, Send, ShieldAlert, Award, User, Laptop } from "lucide-react";
import { Video as VideoType, PastPaper, Book, Quiz, Question, Announcement, User as UserType } from "../types";

interface AdminPanelProps {
  onAddVideo: (vid: VideoType) => void;
  onAddPaper: (paper: PastPaper) => void;
  onAddBook: (book: Book) => void;
  onAddQuiz: (quiz: Quiz) => void;
  onSendAnnouncement: (ann: Announcement) => void;
  allVideos: VideoType[];
  allPapers: PastPaper[];
  allBooks: Book[];
  allQuizzes: Quiz[];
  allStudents: UserType[];
  onDeleteVideo: (id: string) => void;
  onDeletePaper: (id: string) => void;
  onDeleteBook: (id: string) => void;
  onDeleteQuiz: (id: string) => void;
  onToggleAdminStatus?: (userId: string, currentIsAdmin: boolean) => void;
  onDeleteUser?: (userId: string) => void;
}

export default function AdminPanel({
  onAddVideo,
  onAddPaper,
  onAddBook,
  onAddQuiz,
  onSendAnnouncement,
  allVideos,
  allPapers,
  allBooks,
  allQuizzes,
  allStudents,
  onDeleteVideo,
  onDeletePaper,
  onDeleteBook,
  onDeleteQuiz,
  onToggleAdminStatus,
  onDeleteUser
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"videos" | "papers" | "books" | "quizzes" | "announcements" | "students">("videos");

  // Local state for Video Form
  const [vidTitle, setVidTitle] = useState("");
  const [vidSub, setVidSub] = useState("Mathematics");
  const [vidLevel, setVidLevel] = useState("Form 4");
  const [vidDuration, setVidDuration] = useState("15:00");
  const [vidUrl, setVidUrl] = useState("https://www.youtube.com/embed/SFC83IUP8Z4");
  const [vidThumb, setVidThumb] = useState("https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60");
  const [vidDesc, setVidDesc] = useState("");
  const [vidInst, setVidInst] = useState("Mr. Sensor Joshua");

  // Local state for Paper Form
  const [pTitle, setPTitle] = useState("");
  const [pSub, setPSub] = useState("Mathematics");
  const [pLevel, setPLevel] = useState("GCE");
  const [pYear, setPYear] = useState(2025);
  const [pType, setPType] = useState<"ZIMSEC" | "Cambridge" | "GCE" | "National Exams" | "School Revision">("GCE");
  const [pDesc, setPDesc] = useState("");
  const [pQuestionsText, setPQuestionsText] = useState(""); // Simplified: comma separated questions

  // Local state for Book Form
  const [bTitle, setBTitle] = useState("");
  const [bAuthor, setBAuthor] = useState("Sensor Academy Faculty");
  const [bSub, setBSub] = useState("Mathematics");
  const [bLevel, setBLevel] = useState("Form 1-4");
  const [bDesc, setBDesc] = useState("");
  const [bSize, setBSize] = useState("4.2 MB");

  // Local state for Quiz Form
  const [qTitle, setQTitle] = useState("");
  const [qSub, setQSub] = useState("Mathematics");
  const [qLevel, setQLevel] = useState("GCE");
  const [qDuration, setQDuration] = useState(15);
  const [qQuestions, setQQuestions] = useState<Question[]>([
    { id: "qq_1", questionText: "Solve root of x-2 = 4", options: ["x=6", "x=18", "x=14", "x=8"], correctOptionIndex: 1, explanation: "Squaring both sides gives x-2 = 16, hence x=18." }
  ]);
  const [newQText, setNewQText] = useState("");
  const [newQOpt1, setNewQOpt1] = useState("");
  const [newQOpt2, setNewQOpt2] = useState("");
  const [newQOpt3, setNewQOpt3] = useState("");
  const [newQOpt4, setNewQOpt4] = useState("");
  const [newQCorrect, setNewQCorrect] = useState(0);
  const [newQExpl, setNewQExpl] = useState("");

  // Local state for Announcements
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annCat, setAnnCat] = useState<"all" | "exam" | "general" | "update">("general");

  // Form Submitions Handlers
  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle.trim()) return;

    const newVid: VideoType = {
      id: "vid_" + Date.now(),
      title: vidTitle,
      duration: vidDuration,
      subject: vidSub,
      level: vidLevel,
      videoUrl: vidUrl,
      thumbnail: vidThumb,
      description: vidDesc || `${vidSub} study lesson video.`,
      uploadedAt: new Date().toISOString().split("T")[0],
      instructor: vidInst
    };

    onAddVideo(newVid);
    setVidTitle("");
    setVidDesc("");
    alert("Video lesson successfully uploaded and published!");
  };

  const handleAddPaperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle.trim()) return;

    // Build some quick structured questions based on text or fallback
    const structuredQs = [
      {
        id: "q_" + Date.now() + "_1",
        section: "Section A",
        number: "1",
        questionText: pQuestionsText || "Solve the assessment equations:\nx + 2 = 10",
        marks: 4,
        sampleAnswer: "x + 2 = 10\nx = 10 - 2\nx = 8"
      }
    ];

    const newPaper: PastPaper = {
      id: "paper_" + Date.now(),
      title: pTitle,
      subject: pSub,
      year: pYear,
      level: pLevel,
      examType: pType,
      pdfUrl: `${pTitle.replace(/\s+/g, "_")}.pdf`,
      downloadCount: 0,
      description: pDesc || `Complete ${pSub} past paper revision.`,
      questionsCount: structuredQs.length,
      structuredQuestions: structuredQs
    };

    onAddPaper(newPaper);
    setPTitle("");
    setPDesc("");
    setPQuestionsText("");
    alert("Exam past paper successfully logged in catalog!");
  };

  const handleAddBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle.trim()) return;

    const newBook: Book = {
      id: "book_" + Date.now(),
      title: bTitle,
      author: bAuthor,
      subject: bSub,
      level: bLevel,
      description: bDesc || `${bSub} standard curriculum companion manual.`,
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60",
      downloadCount: 0,
      fileSize: bSize,
      pdfUrl: `${bTitle.replace(/\s+/g, "_")}.pdf`
    };

    onAddBook(newBook);
    setBTitle("");
    setBDesc("");
    alert("Curriculum study manual logged in Digital Library!");
  };

  const handleAddQuizQuestion = () => {
    if (!newQText.trim() || !newQOpt1 || !newQOpt2) {
      alert("Please provide the question and at least two options!");
      return;
    }

    const newQuestion: Question = {
      id: "q_qq_" + Date.now(),
      questionText: newQText,
      options: [newQOpt1, newQOpt2, newQOpt3 || "", newQOpt4 || ""].filter(Boolean),
      correctOptionIndex: newQCorrect,
      explanation: newQExpl
    };

    setQQuestions([...qQuestions, newQuestion]);
    setNewQText("");
    setNewQOpt1("");
    setNewQOpt2("");
    setNewQOpt3("");
    setNewQOpt4("");
    setNewQExpl("");
    setNewQCorrect(0);
  };

  const handleCreateQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitle.trim() || qQuestions.length === 0) {
      alert("Please specify a title and add at least one question!");
      return;
    }

    const newQuiz: Quiz = {
      id: "quiz_" + Date.now(),
      title: qTitle,
      subject: qSub,
      level: qLevel,
      durationMinutes: qDuration,
      questions: qQuestions,
      attemptsCount: 0
    };

    onAddQuiz(newQuiz);
    setQTitle("");
    setQQuestions([]);
    alert("Timed academic multiple-choice quiz successfully created!");
  };

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    const newAnn: Announcement = {
      id: "ann_" + Date.now(),
      title: annTitle,
      content: annContent,
      sender: "Principal Mr. Sensor Joshua",
      timestamp: new Date().toISOString(),
      category: annCat
    };

    onSendAnnouncement(newAnn);
    setAnnTitle("");
    setAnnContent("");
    alert("Broadcast dispatched and successfully pushed to notifications!");
  };

  return (
    <div id="admin-hub" className="bg-slate-950 min-h-screen text-slate-100 pb-24 pt-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hub Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 border border-blue-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Sensor Administrative Hub</h1>
              <p className="text-xs text-slate-400 max-w-md">
                Configure curriculum materials, publish multimedia videos, create interactive quizzes, broadcast notifications, and view ledger students.
              </p>
            </div>
          </div>
          <span className="text-xs bg-indigo-900/50 text-indigo-300 font-mono py-1 px-3.5 rounded-full border border-indigo-500/30">
            ADMIN STATUS: AUTHORIZED
          </span>
        </div>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Side Menu Navigation */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 lg:col-span-1 space-y-1.5 self-start">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 mb-2">Management Controls</p>

            <button
              onClick={() => setActiveTab("videos")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === "videos" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="flex items-center"><Video className="w-4 h-4 mr-2.5 shrink-0" /> Videos ({allVideos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("papers")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === "papers" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="flex items-center"><FileText className="w-4 h-4 mr-2.5 shrink-0" /> Past Papers ({allPapers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("books")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === "books" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="flex items-center"><BookOpen className="w-4 h-4 mr-2.5 shrink-0" /> Digital Books ({allBooks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("quizzes")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === "quizzes" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="flex items-center"><Award className="w-4 h-4 mr-2.5 shrink-0" /> Timed Quizzes ({allQuizzes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("announcements")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === "announcements" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="flex items-center"><Send className="w-4 h-4 mr-2.5 shrink-0" /> Dispatch Alerts</span>
            </button>

            <button
              onClick={() => setActiveTab("students")}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === "students" ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="flex items-center"><User className="w-4 h-4 mr-2.5 shrink-0" /> Registered Students ({allStudents.length})</span>
            </button>
          </div>

          {/* Core Content Form Canvas */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 sm:p-7">
            {/* 1. Video Operation Tab */}
            {activeTab === "videos" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center"><Plus className="w-4.5 h-4.5 mr-2 text-blue-500" /> Upload New Video Lesson</h2>
                  <p className="text-xs text-slate-400">Stream educational resources step-by-step for curriculum study rooms.</p>
                </div>

                <form onSubmit={handleAddVideoSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Video Lesson Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master Linear Interpolation & Graphs"
                      value={vidTitle}
                      onChange={(e) => setVidTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Subject</label>
                    <select
                      value={vidSub}
                      onChange={(e) => setVidSub(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    >
                      <option>Mathematics</option>
                      <option>English Language</option>
                      <option>Biology</option>
                      <option>Chemistry</option>
                      <option>ICT</option>
                      <option>Physical Science</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Academic level</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GCE, Form 4, Grade 11"
                      value={vidLevel}
                      onChange={(e) => setVidLevel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Video Embed link / YouTube</label>
                    <input
                      type="text"
                      required
                      value={vidUrl}
                      onChange={(e) => setVidUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Duration (MM:SS)</label>
                    <input
                      type="text"
                      required
                      value={vidDuration}
                      onChange={(e) => setVidDuration(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Description Summary</label>
                    <textarea
                      rows={3}
                      placeholder="Brief instructions on mathematical concepts discussed..."
                      value={vidDesc}
                      onChange={(e) => setVidDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:col-span-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 mt-2"
                  >
                    Publish Lessons Video
                  </button>
                </form>

                <div className="pt-6 border-t border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-slate-350">Active Video Catalog</h3>
                  <div className="space-y-2">
                    {allVideos.map((v) => (
                      <div key={v.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-white">{v.title}</p>
                          <p className="text-slate-400 mt-0.5">{v.subject} • {v.level} • {v.duration}</p>
                        </div>
                        <button
                          onClick={() => onDeleteVideo(v.id)}
                          className="p-2 text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Papers Tab */}
            {activeTab === "papers" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center"><Plus className="w-4.5 h-4.5 mr-2 text-blue-500" /> Database Exam Past Paper</h2>
                  <p className="text-xs text-slate-400">Add downloadable national and mock exam papers to the student catalog.</p>
                </div>

                <form onSubmit={handleAddPaperSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Past Paper Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Physical Science Paper 2 (Theory) - November 2024"
                      value={pTitle}
                      onChange={(e) => setPTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Subject</label>
                    <select
                      value={pSub}
                      onChange={(e) => setPSub(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    >
                      <option>Mathematics</option>
                      <option>English Language</option>
                      <option>Biology</option>
                      <option>Chemistry</option>
                      <option>ICT</option>
                      <option>Physical Science</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Syllabus level</label>
                    <input
                      type="text"
                      required
                      placeholder="Form 1-4, Grade 9-12, GCE..."
                      value={pLevel}
                      onChange={(e) => setPLevel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Exam Type</label>
                    <select
                      value={pType}
                      onChange={(e) => setPType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    >
                      <option>GCE</option>
                      <option>ZIMSEC</option>
                      <option>Cambridge</option>
                      <option>National Exams</option>
                      <option>School Revision</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Year Of Assessment</label>
                    <input
                      type="number"
                      required
                      value={pYear}
                      onChange={(e) => setPYear(parseInt(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Past Paper Sample Question Text (Optional mockup)</label>
                    <textarea
                      rows={2}
                      placeholder="Describe high-level question formulas..."
                      value={pQuestionsText}
                      onChange={(e) => setPQuestionsText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:col-span-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 mt-2"
                  >
                    Commit Past Paper and Questions
                  </button>
                </form>

                <div className="pt-6 border-t border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-slate-350">Active Past Papers</h3>
                  <div className="space-y-2">
                    {allPapers.map((p) => (
                      <div key={p.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-white">{p.title}</p>
                          <p className="text-slate-400 mt-0.5">{p.subject} • {p.level} • {p.examType}</p>
                        </div>
                        <button
                          onClick={() => onDeletePaper(p.id)}
                          className="p-2 text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Study books operations */}
            {activeTab === "books" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center"><Plus className="w-4.5 h-4.5 mr-2 text-blue-500" /> Upload Curriculum Revision Companion Book</h2>
                  <p className="text-xs text-slate-400">Populate the students digital library shelf with reference manuals.</p>
                </div>

                <form onSubmit={handleAddBookSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Book Study Companion Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master Science Revision Handbook for Secondary Level"
                      value={bTitle}
                      onChange={(e) => setBTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Author</label>
                    <input
                      type="text"
                      value={bAuthor}
                      onChange={(e) => setBAuthor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Subject Class</label>
                    <select
                      value={bSub}
                      onChange={(e) => setBSub(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    >
                      <option>Mathematics</option>
                      <option>English Language</option>
                      <option>Biology</option>
                      <option>Chemistry</option>
                      <option>ICT</option>
                      <option>Physical Science</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Academic level</label>
                    <input
                      type="text"
                      value={bLevel}
                      onChange={(e) => setBLevel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Estimated File size</label>
                    <input
                      type="text"
                      value={bSize}
                      onChange={(e) => setBSize(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Detailed Description</label>
                    <textarea
                      rows={2}
                      placeholder="Outlining revision points and sample summaries included..."
                      value={bDesc}
                      onChange={(e) => setBDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:col-span-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 mt-2"
                  >
                    Catalog Revision Textbook
                  </button>
                </form>

                <div className="pt-6 border-t border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-slate-350">Active Digital shelf</h3>
                  <div className="space-y-2">
                    {allBooks.map((b) => (
                      <div key={b.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-white">{b.title}</p>
                          <p className="text-slate-400 mt-0.5">By {b.author} • {b.subject} • {b.fileSize}</p>
                        </div>
                        <button
                          onClick={() => onDeleteBook(b.id)}
                          className="p-2 text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Quizzes tab */}
            {activeTab === "quizzes" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center"><Award className="w-4.5 h-4.5 mr-2 text-blue-500" /> Interactive Timed Quiz Builder</h2>
                  <p className="text-xs text-slate-400">Construct timed multiple-choice assessments with immediate feedback explanations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/40 p-5 rounded-2xl border border-slate-850">
                  {/* Part 1: Question Pool designer */}
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400">Draft Question</h3>

                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono">Question Text</label>
                        <input
                          type="text"
                          placeholder="e.g. Solve the derivatives of f(x) = x³"
                          value={newQText}
                          onChange={(e) => setNewQText(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono">Option A (Required)</label>
                        <input
                          type="text"
                          placeholder="Option A text"
                          value={newQOpt1}
                          onChange={(e) => setNewQOpt1(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2 text-white text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono">Option B (Required)</label>
                        <input
                          type="text"
                          placeholder="Option B text"
                          value={newQOpt2}
                          onChange={(e) => setNewQOpt2(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2 text-white text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono">Option C (Optional)</label>
                        <input
                          type="text"
                           placeholder="Option C text"
                          value={newQOpt3}
                          onChange={(e) => setNewQOpt3(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2 text-white text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono">Option D (Optional)</label>
                        <input
                          type="text"
                          placeholder="Option D text"
                          value={newQOpt4}
                          onChange={(e) => setNewQOpt4(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2 text-white text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono">Correct Option Index</label>
                        <select
                          value={newQCorrect}
                          onChange={(e) => setNewQCorrect(parseInt(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-white outline-none"
                        >
                          <option value={0}>Option A (Index 0)</option>
                          <option value={1}>Option B (Index 1)</option>
                          <option value={2}>Option C (Index 2)</option>
                          <option value={3}>Option D (Index 3)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono">Solution Explanation Summary</label>
                        <input
                          type="text"
                          placeholder="The derivative of xⁿ is n * xⁿ⁻¹, so 3x²..."
                          value={newQExpl}
                          onChange={(e) => setNewQExpl(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2 text-white text-xs outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddQuizQuestion}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md active:scale-95 transition-all"
                      >
                        Push Question to Pool ({qQuestions.length})
                      </button>
                    </div>
                  </div>

                  {/* Part 2: Quiz Details & Save */}
                  <form onSubmit={handleCreateQuizSubmit} className="space-y-4">
                    <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400 font-sans">Quiz Details</h3>

                    <div className="space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono">Test Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Cell Structure & Mitosis Challenge"
                          value={qTitle}
                          onChange={(e) => setQTitle(e.target.value)}
                          className="w-full bg-slate-955 border border-slate-800 p-2.5 rounded-lg text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono">Subject Theme</label>
                        <select
                          value={qSub}
                          onChange={(e) => setQSub(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white"
                        >
                          <option>Mathematics</option>
                          <option>English Language</option>
                          <option>Biology</option>
                          <option>Chemistry</option>
                          <option>ICT</option>
                          <option>Physical Science</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono">Academic level</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Form 4, GCE, Grade 12"
                          value={qLevel}
                          onChange={(e) => setQLevel(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono">Allowed Duration (Minutes)</label>
                        <input
                          type="number"
                          required
                          value={qDuration}
                          onChange={(e) => setQDuration(parseInt(e.target.value))}
                          className="w-full bg-slate-955 border border-slate-800 p-2.5 rounded-lg text-white"
                        />
                      </div>

                      {/* Draft Questions visualization list */}
                      <div className="p-3 bg-slate-950 rounded-xl space-y-2 border border-slate-850">
                        <span className="text-[10px] font-mono text-slate-400">Constructed Pool:</span>
                        {qQuestions.length === 0 ? (
                          <p className="text-[10px] text-slate-500">No questions drafted in current quiz stack.</p>
                        ) : (
                          <div className="space-y-1.5 max-h-32 overflow-y-auto">
                            {qQuestions.map((q, idx) => (
                              <div key={idx} className="p-1 px-2.5 bg-slate-900 rounded border border-slate-800 text-[10px] flex justify-between items-center">
                                <span className="text-slate-350 truncate flex-1">{idx + 1}. {q.questionText}</span>
                                <button
                                  type="button"
                                  onClick={() => setQQuestions(qQuestions.filter((item) => item.id !== q.id))}
                                  className="text-rose-500 hover:text-rose-400 font-bold ml-2 font-mono"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={qQuestions.length === 0}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                      >
                        Publish Timed Revision Quiz
                      </button>
                    </div>
                  </form>
                </div>

                <div className="pt-6 border-t border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-slate-350">Active Test Challenges</h3>
                  <div className="space-y-2">
                    {allQuizzes.map((q) => (
                      <div key={q.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-white">{q.title}</p>
                          <p className="text-slate-400 mt-0.5">{q.subject} • {q.level} • {q.questions.length} Questions</p>
                        </div>
                        <button
                          onClick={() => onDeleteQuiz(q.id)}
                          className="p-2 text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. Dispatch announcements and updates */}
            {activeTab === "announcements" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center"><Send className="w-4.5 h-4.5 mr-2 text-blue-500" /> Dispatch System Announcements</h2>
                  <p className="text-xs text-slate-400">Broadcast administrative notices, calendar exam alterations, and syllabus updates.</p>
                </div>

                <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Alert Title Header</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ZIMSEC Exam Registration Deadline Extension"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Broadcast Category</label>
                    <select
                      value={annCat}
                      onChange={(e) => setAnnCat(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    >
                      <option value="general">General Advisory Notice</option>
                      <option value="exam">National Exams Revision Update</option>
                      <option value="update">Server & Digital UploadsAlert</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400">Alert Content Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Type the full announcement content. This will be broadcast to all student notification centers..."
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
                  >
                    Broadcast Announcement Alert
                  </button>
                </form>
              </div>
            )}

            {/* 6. Students Tab */}
            {activeTab === "students" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center"><User className="w-4.5 h-4.5 mr-2 text-blue-500" /> Administrative Students Ledger</h2>
                  <p className="text-xs text-slate-400">View registered student profiles, levels, completed tasks, and score performance metrics.</p>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-xs text-left text-slate-350">
                    <thead className="bg-slate-950 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-850">
                      <tr>
                        <th className="px-4 py-3">Full Student Name</th>
                        <th className="px-4 py-3">Email Address</th>
                        <th className="px-4 py-3">Academic level</th>
                        <th className="px-4 py-3">Completed Videos</th>
                        <th className="px-4 py-3">Quiz Attempts</th>
                        <th className="px-4 py-3 text-right">Role</th>
                        {(onToggleAdminStatus || onDeleteUser) && <th className="px-4 py-3 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {allStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-950/50">
                          <td className="px-4 py-3.5 font-semibold text-white">{s.fullName}</td>
                          <td className="px-4 py-3.5 text-slate-400 font-mono">{s.email}</td>
                          <td className="px-4 py-3.5"><span className="bg-slate-800 py-0.5 px-2 rounded-full font-mono">{s.studentClass}</span></td>
                          <td className="px-4 py-3.5 text-center font-mono">{s.completedVideos?.length || 0}</td>
                          <td className="px-4 py-3.5 text-center font-mono">{s.quizAttempts?.length || 0}</td>
                          <td className="px-4 py-3.5 text-right font-mono">
                            <span className={`py-0.5 px-2 rounded font-bold text-[9px] ${s.isAdmin ? "bg-rose-950/40 text-rose-400 border border-rose-500/20" : "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20"}`}>
                              {s.isAdmin ? "ADMIN" : "STUDENT"}
                            </span>
                          </td>
                          {(onToggleAdminStatus || onDeleteUser) && (
                            <td className="px-4 py-3.5 text-right space-x-1 whitespace-nowrap">
                              {onToggleAdminStatus && (
                                <button
                                  type="button"
                                  onClick={() => onToggleAdminStatus(s.id, !!s.isAdmin)}
                                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-350 hover:text-white font-bold border border-slate-700 active:scale-95 transition-all"
                                >
                                  Toggle Role
                                </button>
                              )}
                              {onDeleteUser && (
                                <button
                                  type="button"
                                  onClick={() => onDeleteUser(s.id)}
                                  className="px-2 py-1 rounded bg-red-950/30 hover:bg-red-900/50 text-[10px] text-red-400 border border-red-900/35 font-bold active:scale-95 transition-all"
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
