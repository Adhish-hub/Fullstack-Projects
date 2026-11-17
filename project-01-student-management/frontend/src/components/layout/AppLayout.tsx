import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <NavLink to="/" className="text-2xl font-bold text-indigo-600">
            StudentHub
          </NavLink>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-indigo-600"
              }
            >
              Students
            </NavLink>

            <NavLink
              to="/students/new"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-indigo-600"
              }
            >
              Add Student
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-5 text-center text-sm text-slate-500">
        StudentHub — Student Management System
      </footer>
    </div>
  );
}
