import React from "react";
import {
  Calculator, BookOpen, Dna, FlaskConical, Laptop, Atom,
  ArrowRight, FileText, Video as VideoIcon, CheckSquare,
  Sparkles, Eye, EyeOff
} from "lucide-react";
import { useAppContext } from "../AppContext";
import { INITIAL_SUBJECTS } from "../mockData";

const subjectIconMap: Record<string, React.ReactNode> = {
  Calculator: <Calculator className="w-7 h-7" />,
  BookOpen: <BookOpen className="w-7 h-7" />,
  Dna: <Dna className="w-7 h-7" />,
  FlaskConical: <FlaskConical className="w-7 h-7" />,
  Laptop: <Laptop className="w-7 h-7" />,
  Atom: <Atom className="w-7 h-7" />,
};

const subjectDarkColors: Record<string, string> = {
  "bg-indigo-50 text-indigo-700 border-indigo-200": "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
  "bg-sky-50 text-sky-700 border-sky-200": "border-sky-500/30 text-sky-400 bg-sky-500/10",
  "bg-emerald-50 text-emerald-700 border-emerald-200": "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  "bg-amber-50 text-amber-700 border-amber-200": "border-amber-500/30 text-amber-400 bg-amber-500/10",
  "bg-violet-50 text-violet-700 border-violet-200": "border-violet-500/30 text-violet-400 bg-violet-500/10",
  "bg-red-50 text-red-700 border-red-200": "border-red-500/30 text-red-400 bg-red-500/10",
};

const videoData = [
  { id: "0qKZK1Qd-ps", title: "Comprehensive Quadratic Equations Tutorial" },
  { id: "aS2PTxUILFY", title: "Writing A Grade-A Narrative Essay" },
  { id: "3Jzb9LqEPhs", title: "Osmosis & Diffusion Demystified" },
  { id: "uRse40KT-84", title: "Chemical Bonding & Periodic Trends" },
  { id: "JzJ8xL4Eq8U", title: "Introduction to Python & Logic Gates" },
];

export default function LandingPage() {
  const ctx = useAppContext();
  const {
    isRegisterMode, setIsRegisterMode,
    showPassword, setShowPassword,
    authEmail, setAuthEmail,
    authFullName, setAuthFullName,
    authPassword, setAuthPassword,
    authClass, setAuthClass,
    handleAuthSubmit,
  } = ctx;

  const scrollToAuth = (register: boolean) => {
    setIsRegisterMode(register);
    const element = document.getElementById("auth-card");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("ring-2", "ring-blue-500", "scale-[1.01]");
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-blue-500", "scale-[1.01]");
      }, 1200);
    }
  };

  return (
    <div id="sensor-academy-landing" className="bg-slate-950 text-slate-100 min-h-screen font-sans relative" style={{ scrollBehavior: "smooth" }}>

      {/* ===== 1. STICKY NAVIGATION ===== */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 select-none">
            <img src="/images/logo.jpeg" alt="Sensor Academy" className="w-9 h-9 rounded-xl object-cover shadow-lg" />
            <div>
              <h1 className="text-sm font-black tracking-tight text-white leading-none">Sensor Academy</h1>
              <p className="text-[8px] text-slate-500 font-mono tracking-widest mt-0.5">SCHOOL OF TUITIONS</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-xs text-slate-400 hover:text-white transition-colors font-medium">Features</a>
            <a href="#subjects" className="text-xs text-slate-400 hover:text-white transition-colors font-medium">Subjects</a>
            <a href="#videos" className="text-xs text-slate-400 hover:text-white transition-colors font-medium">Videos</a>
            <a href="#about" className="text-xs text-slate-400 hover:text-white transition-colors font-medium">About</a>
          </div>
          <button
            type="button"
            onClick={() => scrollToAuth(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ===== 2. HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/12 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[30%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-blue-900/40 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full border border-blue-500/20 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 fill-current mr-1" />
            <span>National Syllabus Ready</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight max-w-4xl mx-auto">
            Learn Smarter. Revise Faster.<br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-indigo-500">
              Excel Together.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto mt-6">
            The high-performance workspace for secondary and GCE candidates. Turn your device into a virtual classroom with premium video tutorials, master manuals, past exam catalogs, and interactive testing engines.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={() => scrollToAuth(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer"
            >
              Get Started - Create Account
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollToAuth(false)}
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-bold rounded-xl text-sm transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer"
            >
              Sign In to Your Profile
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-3 text-slate-400 text-sm">
            <img src="/images/logo.jpeg" alt="" className="w-8 h-8 rounded-full border-2 border-slate-800" />
            <span>Trusted by <strong className="text-white">1,000+</strong> students &middot; EST 2018</span>
          </div>

          <div className="mt-16 relative max-w-4xl mx-auto">
            <img src="/images/school-banner.jpeg" alt="Sensor Academy campus" className="w-full rounded-3xl border border-slate-800 shadow-2xl object-cover object-top aspect-[16/9]" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* ===== 3. FEATURES SECTION ===== */}
      <section id="features" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Why Choose Sensor Academy?</h3>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm sm:text-base">Everything you need to prepare for exams, all in one place.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 mb-5">
                <FileText className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-white text-lg mb-2">PDF Exam Catalog</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Study real revision past papers with integrated split-screen question references. Access hundreds of national exam papers across all subjects.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-indigo-500/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 mb-5">
                <VideoIcon className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-white text-lg mb-2">Streaming Lessons</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Learn difficult concepts step-by-step with curriculum videos from expert faculties. Watch on any device, anytime, at your own pace.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 mb-5">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-white text-lg mb-2">Digital Textbook Library</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Instant access to offline guides, key reference books, and master syllabus booklets. Download and study without an internet connection.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-amber-500/30 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 mb-5">
                <CheckSquare className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-white text-lg mb-2">Interactive Assessments</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Take auto-graded timed diagnostic exams with instant correct solutions review. Track your progress and identify weak areas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. SUBJECTS SECTION ===== */}
      <section id="subjects" className="py-20 sm:py-28 bg-slate-900/30 relative">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Explore Our Subjects</h3>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm sm:text-base">Six core subjects aligned to the national syllabus, each with dedicated resources.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_SUBJECTS.map((subject) => (
              <div key={subject.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-4 ${subjectDarkColors[subject.color] || "border-slate-700 text-slate-400 bg-slate-800"}`}>
                  {subjectIconMap[subject.icon] || <BookOpen className="w-7 h-7" />}
                </div>
                <h4 className="font-bold text-white text-lg mb-1">{subject.name}</h4>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">{subject.description}</p>
                <button
                  type="button"
                  onClick={() => scrollToAuth(true)}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Start Learning <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. VIDEO TUTORIALS SECTION ===== */}
      <section id="videos" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Watch & Learn</h3>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm sm:text-base">Expert-led video tutorials covering key exam topics across all subjects.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoData.map((video) => (
              <div key={video.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all">
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-white text-sm leading-snug">{video.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. HOW IT WORKS ===== */}
      <section className="py-20 sm:py-28 bg-slate-900/30 relative">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">How It Works</h3>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm sm:text-base">Get started in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black mx-auto mb-5">1</div>
              <h4 className="font-bold text-white text-lg mb-2">Create Your Account</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Sign up in seconds with your email. Choose your academic level and get instant access.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black mx-auto mb-5">2</div>
              <h4 className="font-bold text-white text-lg mb-2">Choose Your Subjects</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Browse six core subjects and dive into videos, textbooks, past papers, and quizzes.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black mx-auto mb-5">3</div>
              <h4 className="font-bold text-white text-lg mb-2">Start Learning</h4>
              <p className="text-sm text-slate-400 leading-relaxed">Track your progress, take timed assessments, and use the AI study assistant to excel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. STATS SECTION ===== */}
      <section className="py-20 sm:py-24 relative">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: "6", label: "Subjects" },
              { value: "50+", label: "Video Lessons" },
              { value: "100+", label: "Past Papers" },
              { value: "AI", label: "Study Assistant" },
            ].map((stat) => (
              <div key={stat.label} className="text-center bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 8. ABOUT SECTION ===== */}
      <section id="about" className="py-20 sm:py-28 bg-slate-900/30 relative">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-6">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Sensor Academy</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                Sensor Academy — School of Tuitions — is an interactive educational learning system established in 2018. Our motto: <em className="text-blue-400">"Proper Preparation Prevents Poor Performance."</em>
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
                We empower secondary, GCE, and Grade 12 students with comprehensive syllabus-aligned resources — video tutorials from expert instructors, past examination papers, digital textbooks, interactive quizzes, and AI-powered study assistance.
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Now enrolling for Form 2, Grade 12, and G.C.E. Whether you are preparing for national exams or strengthening core subjects, Sensor Academy provides the tools to study smarter and achieve academic excellence.
              </p>
            </div>
            <div className="space-y-4">
              <img src="/images/founder.jpeg" alt="Sensor Academy Founder" className="w-full rounded-2xl border border-slate-800 shadow-xl object-cover object-top aspect-[3/4] max-h-[400px]" />
              <div className="grid grid-cols-2 gap-4">
                <img src="/images/school-banner.jpeg" alt="Sensor Academy School" className="w-full rounded-xl border border-slate-800 object-cover aspect-square" />
                <img src="/images/team.jpeg" alt="Sensor Academy Team" className="w-full rounded-xl border border-slate-800 object-cover aspect-square" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 9. AUTH SECTION ===== */}
      <section id="auth" className="py-20 sm:py-28 relative">
        <div className="max-w-md mx-auto w-full px-4 sm:px-6">
          <div className="text-center mb-10">
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Join Sensor Academy</h3>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">Create your free student account or sign in to continue learning.</p>
          </div>

          <div id="auth-card" className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden transition-all duration-300">

            {/* Toggle controls tab header */}
            <div className="bg-slate-950 p-1 rounded-2xl flex gap-1 border border-slate-800">
              <button
                type="button"
                onClick={() => { setIsRegisterMode(true); }}
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
                onClick={() => { setIsRegisterMode(false); }}
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
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs transition-colors active:scale-95 flex items-center justify-center space-x-1"
              >
                <span>{isRegisterMode ? "Instantiate Student File & Log In" : "Unlocks Student Portfolio →"}</span>
              </button>
            </form>

            {/* Action toggle trigger below */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                {isRegisterMode ? "Have a profile account? Log in" : "Need to log a new file? Register free"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 10. FOOTER ===== */}
      <footer className="border-t border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <img src="/images/logo.jpeg" alt="Sensor Academy" className="w-9 h-9 rounded-xl object-cover" />
                <span className="text-sm font-black text-white">Sensor Academy</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">Syllabus-aligned interactive education platform for secondary and GCE-level students.</p>
            </div>

            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform</h5>
              <div className="space-y-2">
                <a href="#features" className="block text-xs text-slate-400 hover:text-white transition-colors">Features</a>
                <a href="#subjects" className="block text-xs text-slate-400 hover:text-white transition-colors">Subjects</a>
                <a href="#videos" className="block text-xs text-slate-400 hover:text-white transition-colors">Video Tutorials</a>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Get Started</h5>
              <div className="space-y-2">
                <button type="button" onClick={() => scrollToAuth(true)} className="block text-xs text-slate-400 hover:text-white transition-colors cursor-pointer">Create Account</button>
                <button type="button" onClick={() => scrollToAuth(false)} className="block text-xs text-slate-400 hover:text-white transition-colors cursor-pointer">Sign In</button>
                <a href="#about" className="block text-xs text-slate-400 hover:text-white transition-colors">About Us</a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500">&copy; 2026 Sensor Academy. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors">Digital Study System</span>
              <span className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors font-mono">Ver 2.50.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
