import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppContext } from "./AppContext";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import VideosPage from "./pages/VideosPage";
import PapersPage from "./pages/PapersPage";
import BooksPage from "./pages/BooksPage";
import QuizzesPage from "./pages/QuizzesPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import AiAssistantPage from "./pages/AiAssistantPage";
import SubjectPage from "./pages/SubjectPage";

function AppRoutes() {
  const { currentUser } = useAppContext();

  // When not logged in, show the landing page at "/" (full-page, no Layout)
  // But still allow guest browsing of the dashboard pages via the Layout
  if (!currentUser) {
    return (
      <Routes>
        {/* Landing auth page for unauthenticated visitors */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest can still browse content pages within the Layout shell */}
        <Route element={<Layout />}>
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/papers" element={<PapersPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/ai-assistant" element={<AiAssistantPage />} />
          <Route path="/subject/:subjectId" element={<SubjectPage />} />
        </Route>

        {/* Redirect protected routes to landing */}
        <Route path="/profile" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<Navigate to="/" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/papers" element={<PapersPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/quizzes" element={<QuizzesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={currentUser.isAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
        <Route path="/ai-assistant" element={<AiAssistantPage />} />
        <Route path="/subject/:subjectId" element={<SubjectPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}
