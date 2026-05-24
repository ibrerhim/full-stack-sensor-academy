"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock, Check, X, Award, RotateCcw, ArrowRight, ArrowLeft, RefreshCw, BarChart } from "lucide-react";
import { Quiz, Question, QuizAttempt } from "../types";

interface QuizViewProps {
  quiz: Quiz;
  onQuizSubmit: (attempt: QuizAttempt) => void;
  onBack: () => void;
}

export default function QuizView({ quiz, onQuizSubmit, onBack }: QuizViewProps) {
  const [quizState, setQuizState] = useState<"intro" | "active" | "results">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(quiz.durationMinutes * 60);
  const [attemptId] = useState(() => "att_" + Date.now());

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userAnswersRef = useRef<{ [qId: string]: number }>(userAnswers);

  // Keep ref in sync to avoid stale closure in timer callback
  useEffect(() => {
    userAnswersRef.current = userAnswers;
  }, [userAnswers]);

  // Countdown timer effect
  useEffect(() => {
    if (quizState === "active") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizState]);

  const handleStartQuiz = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setTimeLeft(quiz.durationMinutes * 60);
    setQuizState("active");
  };

  const handleSelectOption = (qId: string, index: number) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: index }));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q) => {
      if (userAnswersRef.current[q.id] === q.correctOptionIndex) {
        score++;
      }
    });
    return score;
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleAutoSubmit = () => {
    submitCompletedQuiz();
  };

  const submitCompletedQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const score = calculateScore();
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    const answersMapped: { [qId: string]: string } = {};
    quiz.questions.forEach((q) => {
      const selectedIdx = userAnswersRef.current[q.id];
      answersMapped[q.id] = selectedIdx !== undefined ? q.options[selectedIdx] : "Unanswered";
    });

    const attempt: QuizAttempt = {
      id: attemptId,
      quizId: quiz.id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      score,
      totalQuestions,
      percentage,
      takenAt: new Date().toISOString(),
      answers: answersMapped,
    };

    onQuizSubmit(attempt);
    setQuizState("results");
  };

  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  return (
    <div id="quiz-workspace" className="bg-slate-950 min-h-screen text-slate-200 pb-20 pt-6 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Intro View */}
        {quizState === "intro" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/25 rounded-2xl flex items-center justify-center mx-auto text-blue-400">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full font-mono">
                {quiz.subject} • {quiz.level}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{quiz.title}</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Test your knowledge and receive instant grading, solution reviews, and self-improvement tracking statistics.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto text-left">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <p className="text-[10px] text-slate-500 font-mono uppercase">Questions</p>
                <p className="text-xl font-bold text-white font-mono">{quiz.questions.length}</p>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <p className="text-[10px] text-slate-500 font-mono uppercase">Time Limit</p>
                <p className="text-xl font-bold text-white font-mono">{quiz.durationMinutes} Mins</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold transition-all active:scale-95 text-xs"
              >
                Back to Tests
              </button>
              <button
                onClick={handleStartQuiz}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-95"
              >
                Begin Active Test
              </button>
            </div>
          </div>
        )}

        {/* Active Test View */}
        {quizState === "active" && currentQuestion && (
          <div className="space-y-6">
            {/* Timer Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center space-x-2.5">
                <span className="text-xs font-semibold text-slate-400">Quiz Progress:</span>
                <span className="font-mono text-sm font-bold text-white">
                  {currentIndex + 1} / {quiz.questions.length}
                </span>
              </div>

              <div className={`flex items-center space-x-2 py-1.5 px-3 rounded-full border transition-colors ${
                timeLeft < 60 
                  ? "bg-rose-950/20 border-rose-500/40 text-rose-500 animate-pulse" 
                  : "bg-slate-950 border-slate-800 text-slate-300"
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono text-xs font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQuestion.questionText}
              </h3>

              {/* Multiple Choice Options */}
              <div className="space-y-3.5">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = userAnswers[currentQuestion.id] === idx;
                  const letter = String.fromCharCode(65 + idx); // A, B, C, D

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQuestion.id, idx)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center transition-all focus:outline-none ${
                        isSelected
                          ? "bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-500/5 font-semibold"
                          : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/45 hover:border-slate-700"
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg text-xs font-bold font-mono mr-3.5 flex items-center justify-center transition-colors ${
                        isSelected ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400"
                      }`}>
                        {letter}
                      </span>
                      <span className="text-sm font-sans flex-1 leading-snug">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Drawer */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 text-xs font-semibold flex items-center space-x-1.5 transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {isLastQuestion ? (
                <button
                  onClick={submitCompletedQuiz}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all active:scale-95 flex items-center space-x-1.5"
                >
                  <span>Submit Quiz</span>
                  <Check className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-blue-500/10 transition-all active:scale-95"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results review Screen */}
        {quizState === "results" && (
          <div className="space-y-6">
            {/* Header Performance Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wide text-slate-500 font-mono font-bold">Performance Summary</span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Quiz Evaluation Complete!</h2>
              </div>

              {/* Dynamic Score stats circular cards */}
              <div className="flex flex-col items-center py-4">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#10b981"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * Math.round((calculateScore() / quiz.questions.length) * 100)) / 100}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black font-mono text-white">
                      {Math.round((calculateScore() / quiz.questions.length) * 100)}%
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">CRITERIA</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-300 mt-3">
                  You scored <span className="text-emerald-400 font-bold">{calculateScore()}</span> out of{" "}
                  <span className="text-white font-bold">{quiz.questions.length}</span> question points.
                </p>
              </div>

              {/* Feedback controls */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={onBack}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:text-white rounded-xl text-xs font-semibold text-slate-300 transition-all active:scale-95 flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Choose Another Test</span>
                </button>
                <button
                  onClick={handleStartQuiz}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/15 flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Interactive Retry</span>
                </button>
              </div>
            </div>

            {/* Answer sheet Explanatory breakdown */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <BarChart className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs uppercase font-bold tracking-wider text-slate-300">Answer Review & Solution Handbook</h3>
              </div>

              {quiz.questions.map((q, index) => {
                const userSelectedIdx = userAnswers[q.id];
                const isCorrect = userSelectedIdx === q.correctOptionIndex;
                const letterSelected = userSelectedIdx !== undefined ? String.fromCharCode(65 + userSelectedIdx) : "Unanswered";
                const letterCorrect = String.fromCharCode(65 + q.correctOptionIndex);

                return (
                  <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-bold text-white">
                        Q{index + 1}. {q.questionText}
                      </p>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase flex items-center space-x-1 shrink-0 ${
                        isCorrect ? "bg-emerald-950/20 text-emerald-400 border border-emerald-500/10" : "bg-rose-950/20 text-rose-400 border border-rose-500/10"
                      }`}>
                        {isCorrect ? <Check className="w-3.5 h-3.5 mr-1" /> : <X className="w-3.5 h-3.5 mr-1" />}
                        <span>{isCorrect ? "Correct" : "Incorrect"}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className={`p-3 rounded-xl border ${
                        isCorrect ? "bg-emerald-950/20 border-emerald-500/15" : "bg-rose-950/20 border-rose-500/15"
                      }`}>
                        <span className="text-slate-400 block font-mono">YOUR SELECTION</span>
                        <span className="font-semibold text-slate-200 block mt-0.5">
                          ({letterSelected}) {userSelectedIdx !== undefined ? q.options[userSelectedIdx] : "None"}
                        </span>
                      </div>

                      <div className="p-3 bg-emerald-950/25 border border-emerald-500/20 rounded-xl">
                        <span className="text-emerald-400 block font-mono">CORRECT CHOICE</span>
                        <span className="font-semibold text-slate-200 block mt-0.5">
                          ({letterCorrect}) {q.options[q.correctOptionIndex]}
                        </span>
                      </div>
                    </div>

                    {q.explanation && (
                      <div className="bg-slate-950 p-3.5 border border-slate-800 rounded-xl text-xs space-y-1">
                        <span className="text-blue-400 font-bold uppercase block tracking-wide">Study Explanation Note:</span>
                        <p className="text-slate-300 leading-relaxed font-mono whitespace-pre-line">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
