import { Link, useNavigate } from "react-router-dom";
import StudentForm from "../components/students/StudentForm";
import { useCreateStudent } from "../hooks/useStudents";
import type { StudentFormData } from "../types/student";

export default function CreateStudentPage() {
  const navigate = useNavigate();
  const createMutation = useCreateStudent();

  function handleSubmit(data: StudentFormData) {
    createMutation.mutate(data, {
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

      <h1 className="mb-2 mt-6 text-3xl font-bold text-slate-900">
        Add Student
      </h1>

      <p className="mb-6 text-slate-500">
        Enter the student's information below.
      </p>

      <StudentForm
        submitLabel="Create Student"
        isSubmitting={createMutation.isPending}
        onSubmit={handleSubmit}
      />

      {createMutation.isError && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {createMutation.error.message}
        </p>
      )}
    </section>
  );
}
