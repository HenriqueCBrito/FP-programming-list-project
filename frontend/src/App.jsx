import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import InvalidLinkPage from "./pages/InvalidLinkPage.jsx";
import QuestionAnalyticsPage from "./pages/QuestionAnalyticsPage.jsx";
import StudentFeedbackPage from "./pages/StudentFeedbackPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/analise/questoes" element={<QuestionAnalyticsPage />} />
      <Route path="/lista/:listId/:token" element={<StudentFeedbackPage />} />
      <Route path="/link-invalido" element={<InvalidLinkPage />} />
      <Route path="*" element={<Navigate to="/link-invalido" replace />} />
    </Routes>
  );
}
