import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../assets";
import { sections } from "../constants/index.js";
import { useAuth } from "../context/authContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { Button } from "./ui";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaSearch, FaSun, FaMoon } from "react-icons/fa";

const NavBar = () => {
  const pathname = window.location.pathname;
  const [active, setActive] = useState(
    pathname === "/" || pathname === "/Home"
      ? "Home"
      : pathname === "/Chat"
      ? "Chat"
      : pathname === "/Help"
      ? "Help"
      : ""
  );

  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [toggle, setToggle] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-md dark:shadow-slate-900/30' 
        : 'bg-transparent'
    } border-b ${scrolled ? 'border-neutral-200/50 dark:border-neutral-700/50' : 'border-transparent'}`}>
      <div className="section-container">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
          {/* Back Button for Chat Page */}
          {pathname.startsWith('/Chat') && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors text-neutral-700 dark:text-neutral-200 font-medium"
            >
              ← Back
            </button>
          )}

          {/* Logo */}
          {!pathname.startsWith('/Chat') && (
            <Link
              to="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              onClick={() => {
                setActive("Home");
                window.scrollTo(0, 0);
              }}
            >
              <img src={logo} alt="Chatlas" className="h-10 w-10" />
              <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 font-['Montserrat']">Chat</span>
            </Link>
          )}

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-1">
            {sections.map((link) => (
              <li key={link.id}>
                <Link
                  to={`/${link.id}`}
                  onClick={() => setActive(link.title)}
                  className={`
                    px-4 py-2 rounded-2xl font-semibold transition-all duration-300
                    ${
                      active === link.title
                        ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-glow"
                        : "text-neutral-700 hover:bg-neutral-100 hover:scale-105"
                    }
                  `}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Search Icon */}
            <button 
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-800 transition-all duration-200 text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-110"
              aria-label="Search"
            >
              <FaSearch size={18} />
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-800 transition-all duration-200 text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-110"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <FaMoon size={18} className="animate-in spin-in-90" />
              ) : (
                <FaSun size={18} className="animate-in spin-in-90" />
              )}
            </button>

            {user ? (
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownVisible(true)}
                onMouseLeave={() => setIsDropdownVisible(false)}
              >
                <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <FaUser className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {user?.username || "User"}
                  </span>
                </button>

                {isDropdownVisible && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl dark:shadow-slate-900/50 p-2 animate-slide-down border border-neutral-200 dark:border-neutral-700">
                    <button
                      onClick={() => navigate("/profile")}
                      className="flex items-center space-x-2 w-full px-4 py-2.5 text-left rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-700 transition-colors text-neutral-700 dark:text-neutral-200"
                    >
                      <FaUser />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2.5 text-left rounded-lg hover:bg-neutral-100 dark:hover:bg-slate-700 transition-colors text-neutral-700 dark:text-neutral-200"
                    >
                      <FaSignOutAlt />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/signin")}
                  className="px-4 py-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-slate-800 font-medium rounded-lg transition-all duration-200 hover:scale-105 border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-primary-500/30"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors"
            onClick={() => setToggle(!toggle)}
          >
            {toggle ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {toggle && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-neutral-200/50 dark:border-neutral-700/50 animate-slide-down">
          <div className="section-container py-6 space-y-4">
            {/* Mobile Theme Toggle */}
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-100 dark:bg-slate-800 rounded-lg">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Theme</span>
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-slate-700 transition-all duration-200 text-neutral-600 dark:text-neutral-300"
              >
                {theme === 'light' ? <FaMoon size={16} /> : <FaSun size={16} />}
              </button>
            </div>

            <ul className="space-y-2">
              {sections.map((link) => (
                <li key={link.id}>
                  <Link
                    to={`/${link.id}`}
                    onClick={() => {
                      setActive(link.title);
                      setToggle(false);
                    }}
                    className={`
                      block px-4 py-3 rounded-lg font-medium transition-all
                      ${
                        active === link.title
                          ? "bg-primary-600 dark:bg-primary-700 text-white"
                          : "text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-slate-800"
                      }
                    `}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {user ? (
              <div className="space-y-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <div className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Signed in as <span className="font-medium text-neutral-900 dark:text-neutral-100">{user?.username}</span>
                </div>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    handleLogout();
                    setToggle(false);
                  }}
                  icon={<FaSignOutAlt />}
                >
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => {
                    navigate("/signin");
                    setToggle(false);
                  }}
                >
                  Sign in
                </Button>
                <Button
                  variant="gradient"
                  fullWidth
                  onClick={() => {
                    navigate("/signup");
                    setToggle(false);
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
