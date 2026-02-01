import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [user]);

  return (
    <nav className="bg-gray-900 text-gray-200 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-gray-100 font-bold text-xl">ER</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">
              Equipment Rental
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-white">หน้าแรก</Link>
            <Link to="/services" className="hover:text-white">อุปกรณ์</Link>

            {user ? (
              <>
                {!isAdmin && (
                  <Link to="/my-bookings" className="hover:text-white">
                    การจองของฉัน
                  </Link>
                )}

                {isAdmin && (
                  <>
                    <Link to="/admin/services" className="hover:text-white">
                      จัดการอุปกรณ์
                    </Link>
                    <Link to="/admin/bookings" className="hover:text-white">
                      จัดการการจอง
                    </Link>
                  </>
                )}

                {/* Avatar + Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-700 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold text-gray-100">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span>{user.username}</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-gray-800 rounded shadow-lg z-50">
                      <div className="px-4 py-2 border-b border-gray-700 text-sm">
                        {user.username}
                        <br />
                        Role:{" "}
                        <span className="font-semibold">
                          {user.role ?? "N/A"}
                        </span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-200 hover:bg-red-600 hover:text-white rounded"
                      >
                        ออกจากระบบ
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                  เข้าสู่ระบบ
                </Button>
                <Button variant="secondary" size="sm" onClick={() => navigate("/register")}>
                  สมัครสมาชิก
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700 space-y-3 bg-gray-900">
            <Link to="/" className="block hover:text-white">หน้าแรก</Link>
            <Link to="/services" className="block hover:text-white">อุปกรณ์</Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-200 hover:bg-red-600 hover:text-white rounded"
              >
                ออกจากระบบ
              </button>
            ) : (
              <>
                <button
                  className="w-full px-4 py-2 border border-gray-600 rounded hover:bg-gray-700"
                  onClick={() => navigate("/login")}
                >
                  เข้าสู่ระบบ
                </button>
                <button
                  className="w-full px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                  onClick={() => navigate("/register")}
                >
                  สมัครสมาชิก
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
