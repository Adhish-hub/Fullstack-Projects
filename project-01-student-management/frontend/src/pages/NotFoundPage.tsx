import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="py-20 text-center">
      <p className="text-sm font-semibold text-indigo-600">ERROR 404</p>

      <h1 className="mt-3 text-4xl font-bold text-slate-900">Page not found</h1>

      <p className="mt-3 text-slate-500">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
      >
        Return to Students
      </Link>
    </section>
  );
}
