import type { Student, StudentFormData } from "../types/student";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

const STUDENTS_URL = `${API_BASE_URL}/students`;

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message;

    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export async function getStudents(): Promise<Student[]> {
  const response = await fetch(STUDENTS_URL);

  return handleResponse<Student[]>(response);
}

export async function getStudent(id: string): Promise<Student> {
  const response = await fetch(`${STUDENTS_URL}/${id}`);

  return handleResponse<Student>(response);
}

export async function createStudent(
  studentData: StudentFormData,
): Promise<Student> {
  const response = await fetch(STUDENTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });

  return handleResponse<Student>(response);
}

export async function updateStudent(
  id: string,
  studentData: Partial<StudentFormData>,
): Promise<Student> {
  const response = await fetch(`${STUDENTS_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });

  return handleResponse<Student>(response);
}

export async function deleteStudent(id: string): Promise<void> {
  const response = await fetch(`${STUDENTS_URL}/${id}`, {
    method: "DELETE",
  });

  await handleResponse<unknown>(response);
}
