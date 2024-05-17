import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const history = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isMobileMenuOpen &&
        event.target.closest(".mobile-menu") === null
      ) {
        closeMobileMenu();
      }
    };

    document.body.addEventListener("click", handleOutsideClick);

    return () => {
      document.body.removeEventListener("click", handleOutsideClick);
    };
  }, [isMobileMenuOpen]);

  const handleReports = () => {
    history("/reports");
    closeMobileMenu();
  };

  const handleLogout = () => {
    localStorage.clear();
    history("/", { replace: true });
    closeMobileMenu();
  };

  const toggleMobileMenu = (event) => {
    // Prevent the click event from propagating to the body
    event.stopPropagation();
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-white w-full flex items-center py-4">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo or brand (you can customize this part) */}
        <div className="p-4 text-3xl md:text-4xl lg:text-5xl text-left">
          <span className="purple-text-gradient font-bold bg-clip-text text-transparent">Det</span>
          <span className="text-black-100 font-bold italic">Co.</span>
        </div>

        {/* Navigation buttons for mobile */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-black p-2 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation buttons for desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Reports button */}
          <button
            onClick={handleReports}
            className="nav-button p-2 md:p-3 px-1 block text-black font-medium lg:p-4 hover:scale-95 focus:outline-none transition-transform duration-300 cursor-pointer"
          >
            Reports
          </button>

          {/* Log Out button */}
          <button
            onClick={handleLogout}
            className="nav-button px-1 block text-black font-medium p-2 md:p-3 lg:p-4 hover:scale-95 focus:outline-none transition-transform duration-300 cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 bg-white border border-gray-200 shadow-md mobile-menu">
          <button
            onClick={handleReports}
            className="p-2 text-black hover:bg-gray-100 focus:outline-none"
          >
            Reports
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-black hover:bg-gray-100 focus:outline-none"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
