import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import AppShell from "./components/AppShell";
import CandidateProfilePage from "./pages/CandidateProfilePage";
import CandidatesPage from "./pages/CandidatesPage";
import DashboardPage from "./pages/DashboardPage";
import DocumentsPage from "./pages/DocumentsPage";
import JobsPage from "./pages/JobsPage";
import KanbanPage from "./pages/KanbanPage";
import LoginPage from "./pages/LoginPage";
import PublicApplyPage from "./pages/PublicApplyPage";
import TestsPage from "./pages/TestsPage";

function ShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/vaga-publica" element={<PublicApplyPage />} />
      <Route path="/vaga-publica/:identifier" element={<PublicApplyPage />} />
      <Route element={<ShellLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/candidates" element={<CandidatesPage />} />
        <Route path="/pipeline" element={<KanbanPage />} />
        <Route path="/candidates/:id" element={<CandidateProfilePage />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
      </Route>
    </Routes>
  );
}
