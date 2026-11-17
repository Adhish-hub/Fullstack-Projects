import { useState, type ChangeEvent, type FormEvent } from "react";
import type { StudentFormData } from "../../types/student";

interface StudentFormProps {
  initialValues?: StudentFormData;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (data: StudentFormData) => void;
}

const emptyValues: StudentFormData = {
  name: "",
  email: "",
  age: 18,
  course: "",
};

export default function StudentForm({
  initialValues = emptyValues,
  submitLabel,
  isSubmitting,
  onSubmit,
}: StudentFormProps) {
  const [formData, setFormData] = useState<StudentFormData>(initialValues);
  const [error, setError] = useState("");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === "age" ? Number(value) : value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.course.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (
      !Number.isInteger(formData.age) ||
      formData.age < 1 ||
      formData.age > 120
    ) {
      setError("Age must be a whole number between 1 and 120.");
      return;
    }

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      course: formData.course.trim(),
    });
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          maxLength={100}
          required
          className={inputClass}
          placeholder="Enter student name"
        />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          maxLength={150}
          required
          className={inputClass}
          placeholder="student@example.com"
        />
      </div>

      <div>
        <label htmlFor="age" className="text-sm font-medium text-slate-700">
          Age
        </label>
        <input
          id="age"
          name="age"
          type="number"
          min={1}
          max={120}
          step={1}
          value={formData.age}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="course" className="text-sm font-medium text-slate-700">
          Course
        </label>
        <input
          id="course"
          name="course"
          type="text"
          value={formData.course}
          onChange={handleChange}
          maxLength={100}
          required
          className={inputClass}
          placeholder="e.g. Computer Science"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
