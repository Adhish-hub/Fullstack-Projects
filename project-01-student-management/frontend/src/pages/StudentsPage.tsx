import { Link } from "react-router-dom";
import StudentCard from "../components/students/StudentCard";
import { useDeleteStudent, useStudents } from "../hooks/useStudents";
import Notice from "../components/ui/Notice";

export default function StudentsPage() {
  const { data: students, isPending, error, isError } = useStudents();
  const deleteMutation = useDeleteStudent();

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?",
    );

    if (confirmed) {
      deleteMutation.mutate(id);
    }
  }

  if (isPending) {
    return (
      <p className="py-10 text-center text-slate-500">Loading students...</p>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="py-10 text-center text-red-600">
        {error.message}
      </p>
    );
  }

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Students</h1>
          <p className="mt-2 text-slate-500">
            Manage all registered students in one place.
          </p>
        </div>

        <Link
          to="/students/new"
          className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
        >
          + Add Student
        </Link>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-500">Total students</p>
        <p className="mt-1 text-3xl font-bold text-slate-900">
          {students.length}
        </p>
      </div>

      {students.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-xl font-semibold text-slate-800">
            No students yet
          </h2>
          <p className="mt-2 text-slate-500">
            Add your first student to get started.
          </p>
          <Link
            to="/students/new"
            className="mt-5 inline-block rounded-lg bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700"
          >
            Add your first student
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {students.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              onDelete={handleDelete}
              isDeleting={
                deleteMutation.isPending &&
                deleteMutation.variables === student._id
              }
            />
          ))}
        </div>
      )}

      {deleteMutation.isError && (
        <div className="mt-4">
          <Notice type="error" message={deleteMutation.error.message} />
        </div>
      )}
    </section>
  );
}
