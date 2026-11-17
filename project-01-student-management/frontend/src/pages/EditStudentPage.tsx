import { Link, useNavigate, useParams } from "react-router-dom";
import StudentForm from "../components/students/StudentForm";
import { useStudent, useUpdateStudent } from "../hooks/useStudents";
import type { StudentFormData } from "../types/student";

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const studentQuery = useStudent(id ?? "");
  const updateMutation = useUpdateStudent();

  if (!id) {
    return <p className="text-red-600">Invalid student ID.</p>;
  }

  const studentId = id;

  if (studentQuery.isPending) {
    return <p className="py-10 text-center">Loading student...</p>;
  }

  if (studentQuery.isError) {
    return (
      <p role="alert" className="text-red-600">
        {studentQuery.error.message}
      </p>
    );
  }

  const student = studentQuery.data;

  const initialValues: StudentFormData = {
    name: student.name,
    email: student.email,
    age: student.age,
    course: student.course,
  };

  function handleSubmit(data: StudentFormData) {
    updateMutation.mutate(
      { id: studentId, data },
      {
        onSuccess: () => {
          navigate(`/students/${studentId}`);
        },
      },
    );
  }

  return (
    <section className="mx-auto max-w-2xl">
      <Link
        to={`/students/${studentId}`}
        className="text-sm font-medium text-indigo-600 hover:underline"
      >
        ← Back to details
      </Link>

      <h1 className="mb-2 mt-6 text-3xl font-bold text-slate-900">
        Edit Student
      </h1>

      <p className="mb-6 text-slate-500">Update the student's information.</p>

      <StudentForm
        initialValues={initialValues}
        submitLabel="Save Changes"
        isSubmitting={updateMutation.isPending}
        onSubmit={handleSubmit}
      />

      {updateMutation.isError && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {updateMutation.error.message}
        </p>
      )}
    </section>
  );
}
