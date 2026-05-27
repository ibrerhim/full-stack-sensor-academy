import React from "react";
import { useNavigate } from "react-router-dom";
import AdminPanel from "../components/AdminPanel";
import { useAppContext } from "../AppContext";

export default function AdminPage() {
  const navigate = useNavigate();
  const ctx = useAppContext();
  const {
    currentUser, videos, papers, books, quizzes, allStudents,
    handleAdminAddVideo, handleAdminAddPaper, handleAdminAddBook, handleAdminAddQuiz,
    handleAdminSendAnnouncement,
    handleAdminDeleteVideo, handleAdminDeletePaper, handleAdminDeleteBook, handleAdminDeleteQuiz,
    handleToggleAdminStatus, handleDeleteUserProfile,
  } = ctx;

  if (!currentUser?.isAdmin) {
    navigate("/");
    return null;
  }

  return (
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
      allStudents={allStudents.length > 0 ? allStudents : [currentUser]}
      onDeleteVideo={handleAdminDeleteVideo}
      onDeletePaper={handleAdminDeletePaper}
      onDeleteBook={handleAdminDeleteBook}
      onDeleteQuiz={handleAdminDeleteQuiz}
      onToggleAdminStatus={handleToggleAdminStatus}
      onDeleteUser={handleDeleteUserProfile}
    />
  );
}
