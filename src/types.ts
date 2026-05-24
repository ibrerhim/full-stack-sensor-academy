export interface User {
  id: string;
  email: string;
  fullName: string;
  studentClass: string; // e.g., "GCE", "Form 4", "Grade 11"
  joinedAt: string;
  isAdmin: boolean;
  avatarUrl?: string;
  bookmarks: {
    papers: string[]; // Paper IDs
    videos: string[]; // Video IDs
    books: string[];  // Book IDs
  };
  completedVideos: string[]; // Video IDs
  quizAttempts: QuizAttempt[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  takenAt: string;
  answers: { [questionId: string]: string }; // user selections
}

export interface Subject {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  description: string;
  color: string; // Tailwind color class (bg-blue-50 text-blue-600)
}

export interface Video {
  id: string;
  title: string;
  duration: string;
  subject: string;
  level: string; // Form 1-4, GCE, Grade 9-12
  videoUrl: string; // Embedded video placeholder (or YouTube ID)
  thumbnail: string;
  description: string;
  uploadedAt: string;
  instructor?: string;
}

export interface PastPaper {
  id: string;
  title: string;
  subject: string;
  year: number;
  level: string; // Form 1-4, Grade 9-12, GCE
  examType: "ZIMSEC" | "Cambridge" | "GCE" | "National Exams" | "School Revision";
  pdfUrl: string; // Dummy path, can render an embedded readable exam paper view!
  downloadCount: number;
  description: string;
  questionsCount: number;
  structuredQuestions?: {
    id: string;
    section: string;
    number: string;
    questionText: string;
    marks: number;
    sampleAnswer?: string;
  }[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  subject: string;
  level: string; // Form 1-4, Grade 9-12, GCE
  description: string;
  coverImage: string;
  downloadCount: number;
  fileSize: string;
  pdfUrl: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number; // 0, 1, 2, 3
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  level: string; // Form 1-4, Grade 9-12, GCE
  durationMinutes: number;
  questions: Question[];
  attemptsCount: number;
  highScore?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "upload" | "announcement" | "quiz" | "exam_update";
  timestamp: string;
  read: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  sender: string;
  timestamp: string;
  category: "all" | "exam" | "general" | "update";
}
