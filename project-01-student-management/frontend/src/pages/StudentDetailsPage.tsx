import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteStudent, useStudent } from "../hooks/useStudents";

export default function StudentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: student, isPending, error, isError } = useStudent(id ?? "");
  const deleteMutation = useDeleteStudent();

  if (!id) {
    return <p className="text-red-600">Invalid student ID.</p>;
  }

  const studentId = id;

  if (isPending) {
    return <p className="py-10 text-center">Loading student details...</p>;
  }

  if (isError) {
    return (
      <p role="alert" className="text-red-600">
        {error.message}
      </p>
    );
  }

  function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    deleteMutation.mutate(studentId, {
      onSuccess: () => {
        navigate("/");
      },
    });
  }

  return (
    <section className="mx-auto max-w-2xl">
      <Link
        to="/"
        className="text-sm font-medium text-indigo-600 hover:underline"
      >
        ← Back to students
      </Link>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              STUDENT PROFILE
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {student.name}
            </h1>
          </div>

          <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            {student.course}
          </span>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <p className="text-sm text-slate-500">Email address</p>
            <p className="mt-1 font-medium text-slate-900">{student.email}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Age</p>
            <p className="mt-1 font-medium text-slate-900">{student.age}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Student ID</p>
            <p className="mt-1 break-all font-mono text-sm text-slate-700">
              {student._id}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Created at</p>
            <p className="mt-1 font-medium text-slate-900">
              {new Date(student.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Last updated</p>
            <p className="mt-1 font-medium text-slate-900">
              {new Date(student.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={`/students/${student._id}/edit`}
            className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
          >
            Edit Student
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="rounded-lg border border-red-200 px-5 py-3 font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Student"}
          </button>
        </div>

        {deleteMutation.isError && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {deleteMutation.error.message}
          </p>
        )}
      </div>
    </section>
  );
}
