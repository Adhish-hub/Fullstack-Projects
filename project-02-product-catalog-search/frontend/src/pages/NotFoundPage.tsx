import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-7xl font-extrabold text-indigo-600">404</h1>

      <h2 className="mt-5 text-2xl font-bold text-gray-900">Page not found</h2>

      <p className="mt-3 text-gray-500">
        The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-7 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Return to products
      </Link>
    </main>
  );
};

export default NotFoundPage;
