import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <ShoppingBag className="h-7 w-7 text-indigo-600" />

          <span className="text-xl font-bold tracking-tight text-gray-900">
            ProductHub
          </span>
        </Link>

        <div className="flex items-center gap-5 sm:gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `inline-flex items-center gap-2 text-sm font-medium transition ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            Admin
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
