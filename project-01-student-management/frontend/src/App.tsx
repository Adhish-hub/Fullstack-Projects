import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import StudentsPage from "./pages/StudentsPage";
import CreateStudentPage from "./pages/CreateStudentPage";
import EditStudentPage from "./pages/EditStudentPage";
import StudentDetailsPage from "./pages/StudentDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";




export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<StudentsPage />} />
          <Route path="/students/new" element={<CreateStudentPage />} />
          <Route path="/students/:id" element={<StudentDetailsPage />} />
          <Route path="/students/:id/edit" element={<EditStudentPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}







