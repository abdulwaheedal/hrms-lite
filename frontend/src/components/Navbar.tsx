// File: frontend/src/components/Navbar.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path
      ? "bg-blue-900 text-white"
      : "text-blue-100 hover:bg-blue-700 hover:text-white";
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center"
              onClick={closeMenu}
            >
              <span className="text-white text-xl font-bold tracking-wider">
                HRMS Lite
              </span>
            </Link>
            {/* Desktop Menu */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/")}`}
              >
                Dashboard
              </Link>
              <Link
                to="/employees"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/employees")}`}
              >
                Employees
              </Link>
              <Link
                to="/attendance"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/attendance")}`}
              >
                Attendance
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="bg-blue-800 inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-800 pb-3 pt-2">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/")}`}
            >
              Dashboard
            </Link>
            <Link
              to="/employees"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/employees")}`}
            >
              Employees
            </Link>
            <Link
              to="/attendance"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/attendance")}`}
            >
              Attendance
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
