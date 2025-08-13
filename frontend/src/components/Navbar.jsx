import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ user, handleLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <h1
            onClick={() => {
              navigate('/');
              closeMenu();
            }}
            className="text-2xl font-bold text-blue-600 cursor-pointer"
          >
            Note2Test
          </h1>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 text-gray-600 font-medium items-center">
            <li className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => navigate('/')}>
              Home
            </li>
            <li className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => navigate('/about')}>
              About
            </li>

            {user ? (
              <>
                <li>
                  <Link to="/profile" className="text-blue-600 font-semibold hover:underline">
                    {user.first_name || user.username}
                  </Link>
                </li>
                <li>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => navigate('/upload')}
                >
                  Get Started
                </button>
              </li>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-500 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
            <ul className="px-6 py-4 space-y-4">
              <li>
                <button
                  onClick={() => {
                    navigate('/');
                    closeMenu();
                  }}
                  className="w-full text-left text-gray-600 hover:text-blue-500 font-medium transition-colors py-2"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate('/about');
                    closeMenu();
                  }}
                  className="w-full text-left text-gray-600 hover:text-blue-500 font-medium transition-colors py-2"
                >
                  About
                </button>
              </li>

              {user ? (
                <>
                  <li>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        closeMenu();
                      }}
                      className="w-full text-left text-blue-600 font-semibold hover:underline py-2"
                    >
                      {user.first_name || user.username}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    onClick={() => {
                      navigate('/upload');
                      closeMenu();
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;