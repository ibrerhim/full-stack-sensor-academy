import React, { useState } from "react";
import { Download, Eye, EyeOff, BookOpen, AlertCircle, Award, CheckCircle2, Bookmark, ArrowLeft } from "lucide-react";
import { PastPaper } from "../types";

interface PdfViewerProps {
  paper: PastPaper;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onBack: () => void;
  onIncrementDownloads: (paperId: string) => void;
}

export default function PdfViewer({
  paper,
  isBookmarked,
  onToggleBookmark,
  onBack,
  onIncrementDownloads
}: PdfViewerProps) {
  const [showAnswers, setShowAnswers] = useState<{ [qId: string]: boolean }>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [selfGrades, setSelfGrades] = useState<{ [qId: string]: number }>({});
  const [completedRevision, setCompletedRevision] = useState(false);

  const toggleAnswer = (qId: string) => {
    setShowAnswers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const startDownloadSimulation = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadComplete(false);

    onIncrementDownloads(paper.id);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadComplete(true);
          setTimeout(() => setIsDownloading(false), 2000);

          // Standard client-side file trigger for textual PDF format as fallback
          triggerTxtDownload();
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const triggerTxtDownload = () => {
    const questionsText = paper.structuredQuestions
      ?.map((q) => `QUESTION ${q.number} (${q.marks} Marks)\n[${q.section}]\n${q.questionText}\n\n`)
      .join("\n");
    const content = `SENSOR ACADEMY PAST PAPERS CONSOLE\n==================================\n\nTitle: ${paper.title}\nSubject: ${paper.subject}\nYear: ${paper.year}\nLevel: ${paper.level}\nExam Type: ${paper.examType}\n\n${questionsText}\n\nGenerated secure offline resource package. Copyright Sensor Academy 2026.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${paper.title.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGradeChange = (qId: string, maxMarks: number, value: number) => {
    setSelfGrades((prev) => ({ ...prev, [qId]: Math.min(maxMarks, Math.max(0, value)) }));
  };

  const totalMarksAttempted = paper.structuredQuestions?.reduce((acc, q) => acc + q.marks, 0) || 0;
  const totalMarksEarned = paper.structuredQuestions?.reduce((acc, q) => acc + (selfGrades[q.id] || 0), 0) || 0;
  const gradePercentage = totalMarksAttempted > 0 ? Math.round((totalMarksEarned / totalMarksAttempted) * 100) : 0;

  return (
    <div id="interactive-pdf-workspace" className="bg-slate-950 min-h-screen text-slate-100 pb-20">
      {/* Workspace Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-3.5 px-4 sticky top-16 z-30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-900/50 text-blue-350 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono font-bold tracking-wider uppercase">
                  {paper.examType}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Year {paper.year} • {paper.level}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white line-clamp-1">{paper.title}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end md:self-auto">
            <button
              onClick={onToggleBookmark}
              className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
                isBookmarked
                  ? "bg-amber-500/10 border-amber-500/35 text-amber-500"
                  : "bg-slate-850 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              title="Bookmark material"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={startDownloadSimulation}
              disabled={isDownloading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/15 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? "Preparing..." : "Download / Save PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Downloading Simulator Tooltip */}
      {isDownloading && (
        <div className="bg-blue-600 text-white">
          <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs font-mono font-semibold tracking-wide flex items-center animate-pulse">
              <Download className="w-4 h-4 mr-2 animate-bounce" /> Downloading Secure Academic Resource Blueprint...
            </span>
            <div className="flex items-center space-x-3">
              <div className="w-32 bg-blue-800 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full transition-all" style={{ width: `${downloadProgress}%` }} />
              </div>
              <span className="text-xs font-mono">{downloadProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {downloadComplete && (
        <div className="bg-emerald-600 text-white">
          <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2" /> PDF File downloaded successfully in background. Added to download stats!
            </span>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Exam Directives & Rules */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 self-start space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-300">Exam Instructions</h2>
          </div>

          <div className="space-y-4 text-xs text-slate-400">
            <div className="flex items-start space-x-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p>
                This past paper serves as premium study preparation material. Perform the questions under timed conditions to test yourself.
              </p>
            </div>

            <div>
              <p className="font-semibold text-slate-350">Time Allowed:</p>
              <p className="mt-0.5 text-slate-400">2 Hours 30 Minutes</p>
            </div>

            <div>
              <p className="font-semibold text-slate-350">General Directives:</p>
              <ul className="list-disc pl-4 mt-1 space-y-1.5 text-slate-400">
                <li>Write your solutions on double sheets line-paper before revealing marking criteria.</li>
                <li>Calculators are {paper.examType === "GCE" ? "permitted only where specified." : "not permissible for Paper 1."}</li>
                <li>Show all essential working. Omission of working can lead to loss of full marks.</li>
              </ul>
            </div>
          </div>

          {/* Self-Rating Dashboard */}
          <div className="pt-4 border-t border-slate-800 space-y-3.5">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase text-slate-300">Self-Graded Scorecard</h3>
            </div>

            <div className="bg-slate-950/80 p-4 border border-slate-800 rounded-xl space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Points Scored:</span>
                <span className="font-mono font-bold text-white">
                  {totalMarksEarned} / {totalMarksAttempted} Marks
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, gradePercentage)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Grade Equivalent:</span>
                <span className={`font-bold font-mono ${gradePercentage >= 75 ? "text-emerald-400" : gradePercentage >= 50 ? "text-blue-400" : "text-amber-500"}`}>
                  {gradePercentage >= 75 ? "Excellent (A)" : gradePercentage >= 60 ? "Very Good (B)" : gradePercentage >= 50 ? "Credit (C)" : "Practice More (F)"}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setCompletedRevision(true);
                // Trigger celebratory complete
              }}
              className={`w-full py-2 px-4 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 border transition-all ${
                completedRevision
                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400 cursor-default"
                  : "bg-slate-800 border-slate-700 hover:border-slate-600 text-white hover:bg-slate-750 active:scale-95"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completedRevision ? "Revision Tracked!" : "Mark Revision as Complete"}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Paper Workspace Questions Layout */}
        <div className="lg:col-span-2 space-y-6">
          {paper.structuredQuestions && paper.structuredQuestions.length > 0 ? (
            paper.structuredQuestions.map((question, index) => {
              const isOpen = showAnswers[question.id] || false;
              const userPoints = selfGrades[question.id] || 0;

              return (
                <div
                  key={question.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
                >
                  {/* Question header */}
                  <div className="bg-slate-850/80 px-5 py-3.5 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
                    <span className="text-xs font-bold text-blue-400 font-mono">
                      {question.section} • QUESTION {question.number}
                    </span>
                    <span className="text-xs bg-slate-800 text-slate-400 font-mono py-0.5 px-2 rounded-full border border-slate-700">
                      {question.marks} Marks
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <div className="p-5">
                    <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl leading-relaxed text-sm whitespace-pre-wrap font-sans text-slate-200">
                      {question.questionText}
                    </div>

                    {/* Interactive Answer section */}
                    <div className="mt-4 flex flex-wrap gap-3 items-center justify-between pt-1">
                      <button
                        onClick={() => toggleAnswer(question.id)}
                        className="flex items-center space-x-2 text-xs font-semibold text-blue-450 hover:text-blue-400 transition-colors focus:outline-none"
                      >
                        {isOpen ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span>Hide Sample Solutions</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>Reveal Marking Scheme Answer</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center space-x-3 bg-slate-950/50 py-1.5 px-3 border border-slate-800 rounded-xl">
                        <span className="text-[10px] uppercase font-mono text-slate-400">Self Grade:</span>
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="range"
                            min="0"
                            max={question.marks}
                            step="1"
                            value={userPoints}
                            onChange={(e) => handleGradeChange(question.id, question.marks, parseInt(e.target.value))}
                            className="w-16 accent-emerald-500 h-1 rounded"
                          />
                          <span className="text-xs font-bold font-mono text-emerald-400 w-10 text-right">
                            {userPoints} / {question.marks}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable step-by-step guidance solutions */}
                    {isOpen && (
                      <div className="mt-4 bg-emerald-950/20 border border-emerald-500/25 rounded-xl p-4 animate-fade-in">
                        <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-bold uppercase mb-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Official Marking Scheme Guideline</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/10">
                          {question.sampleAnswer || "Sample answer guidance currently being prepared by primary syllabus administrators."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
              <BookOpen className="w-12 h-12 text-blue-500/40 mx-auto mb-4" />
              No structured question subsets available for this subject paper. Please click 'Download / Save PDF' to extract full-length assessments.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
