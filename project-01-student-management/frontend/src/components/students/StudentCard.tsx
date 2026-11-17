import { Link } from "react-router-dom";
import type { Student } from "../../types/student";

interface StudentCardProps {
  student: Student;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function StudentCard({
  student,
  onDelete,
  isDeleting,
}: StudentCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {student.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">{student.email}</p>
        </div>

        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          {student.course}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-600">Age: {student.age}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/students/${student._id}`}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          View
        </Link>

        <Link
          to={`/students/${student._id}/edit`}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Edit
        </Link>

        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete(student._id)}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}
