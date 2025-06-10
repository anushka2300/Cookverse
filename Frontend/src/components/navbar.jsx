import React, { useState, useEffect } from "react";
import { Menu, X, Search, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const handleFav = () => {
    if (user) {
      navigate(`/saved/${user._id}`);
    }
  };
  useEffect(() => {
    console.log("user:" + user);
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/");
    } catch (err) {
      console.log(`error in logout: ${err}`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <div className="bg-white text-orange-600 px-3 py-2 rounded-lg font-bold text-xl shadow-md">
                CookVerse
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/community"
              className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Community
            </Link>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/20 backdrop-blur-sm text-white placeholder-white/80 px-4 py-2 pl-10 rounded-full border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 w-64 transition-all duration-300"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/80" />
            </form>
          </div>

          <div className="hidden md:block">
            {!user ? (
              <button
                onClick={handleLogin}
                className="bg-white cursor-pointer text-orange-600 hover:bg-gray-100 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center space-x-3 justify-center">
                <button
                  onClick={handleLogout}
                  className="bg-white cursor-pointer text-orange-600 hover:bg-gray-100 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Log out
                </button>
                <button
                  onClick={handleFav}
                  className="bg-white cursor-pointer text-orange-600 hover:bg-gray-100 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Favourites
                </button>
                <UserCircle className="w-8 h-8 text-white" />
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="bg-white/20 backdrop-blur-sm inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-300 hover:bg-white/30 transition-all duration-200"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={toggleMobileMenu}
              className="bg-white/20 backdrop-blur-sm inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-300 hover:bg-white/30 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            {isMobileMenuOpen && (
              <div className="md:hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 px-4 py-4 space-y-3">
                <Link
                  to="/"
                  className="block text-white hover:text-yellow-300 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="block text-white hover:text-yellow-300 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/community"
                  className="block text-white hover:text-yellow-300 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Community
                </Link>
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        handleFav();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block text-white hover:text-yellow-300 text-sm font-medium"
                    >
                      Favourites
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block text-white hover:text-yellow-300 text-sm font-medium"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block text-white hover:text-yellow-300 text-sm font-medium"
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-sm border-t border-white/20">
          <div className="px-4 py-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/20 backdrop-blur-sm text-white placeholder-white/80 px-4 py-2 pl-10 rounded-full border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/80" />
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
