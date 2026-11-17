import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudents,
  updateStudent,
} from "./studentService";

import type { Student, StudentFormData } from "../types/student";

const student: Student = {
  _id: "student123",
  name: "Rahul Sharma",
  email: "rahul@example.com",
  age: 21,
  course: "Computer Science",
  createdAt: "2026-11-17T10:00:00.000Z",
  updatedAt: "2026-11-17T10:00:00.000Z",
};

const studentData: StudentFormData = {
  name: "Rahul Sharma",
  email: "rahul@example.com",
  age: 21,
  course: "Computer Science",
};

const fetchMock = vi.fn();

function mockResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

describe("Student API service", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("fetches all students", async () => {
    fetchMock.mockResolvedValueOnce(mockResponse([student]));

    vi.stubGlobal("fetch", fetchMock);

    const result = await getStudents();

    expect(result).toEqual([student]);

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/students");
  });

  it("fetches a single student by ID", async () => {
    fetchMock.mockResolvedValueOnce(mockResponse(student));

    vi.stubGlobal("fetch", fetchMock);

    const result = await getStudent("student123");

    expect(result).toEqual(student);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/students/student123",
    );
  });

  it("creates a student", async () => {
    fetchMock.mockResolvedValueOnce(mockResponse(student, 201));

    vi.stubGlobal("fetch", fetchMock);

    const result = await createStudent(studentData);

    expect(result).toEqual(student);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/students",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(studentData),
      }),
    );
  });

  it("updates a student", async () => {
    fetchMock.mockResolvedValueOnce(
      mockResponse({
        ...student,
        age: 22,
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const result = await updateStudent("student123", { age: 22 });

    expect(result.age).toBe(22);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/students/student123",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ age: 22 }),
      }),
    );
  });

  it("deletes a student", async () => {
    fetchMock.mockResolvedValueOnce(
      mockResponse({
        message: "Student deleted successfully",
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await expect(deleteStudent("student123")).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/students/student123",
      expect.objectContaining({
        method: "DELETE",
      }),
    );
  });

  it("throws a readable error for failed requests", async () => {
    fetchMock.mockResolvedValueOnce(
      mockResponse(
        {
          statusCode: 409,
          message: "A student with this email already exists",
        },
        409,
      ),
    );

    vi.stubGlobal("fetch", fetchMock);

    await expect(createStudent(studentData)).rejects.toThrow(
      "A student with this email already exists",
    );
  });
});
