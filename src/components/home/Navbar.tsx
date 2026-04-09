import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Campaigns", path: "/All-Campaigns" },
    { label: "FundRaise", path: "/Fundraises" },
  ];

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past the top
        setIsHidden(true);
      } else {
        // Scrolling up or near the top
        setIsHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.nav
      className="fixed top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-lg"
      animate={{ y: isHidden ? -100 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-50/50 via-white to-blue-50/50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section with Enhanced Animation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/"
              className="flex items-center gap-3 group hover:opacity-100 transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-md hover:shadow-xl hover:shadow-primary-300/50 transition-all duration-300 bg-white border border-primary-200 relative overflow-hidden"
              >
                {/* Animated glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <img
                  src="/tab-logo1.png"
                  alt="Trust Bridge AI Logo"
                  className="w-auto h-full object-contain relative z-10"
                />
              </motion.div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-gray-900 text-lg md:text-xl font-black tracking-tight">
                    Trust Bridge
                  </h1>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles size={16} className="text-primary-600 hidden sm:block" />
                  </motion.div>
                </div>
                <span className="text-primary-600 text-xs md:text-sm font-bold tracking-wide">
                  AI Platform
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex items-center space-x-1"
          >
            <div className="flex flex-row items-center space-x-1 rounded-full bg-gradient-to-r from-gray-50 to-primary-50/30 border border-gray-200/60 px-2 py-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  custom={i}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link to={item.path}>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      className="relative text-gray-700 py-2 px-4 hover:cursor-pointer transition-all duration-300 rounded-full group flex items-center gap-2 font-semibold text-sm hover:bg-white/60 hover:text-primary-600"
                    >
                      {item.label}
                      <motion.div
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-primary-600 to-blue-500 rounded-full scale-x-0 group-hover:scale-x-100 origin-left"
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Auth Buttons Container */}
            <div className="flex items-center gap-2 ml-4">
              {/* Sign Up Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register">
                  <Button className="relative px-6 py-2.5 bg-gradient-to-r from-primary-600 via-primary-600 to-blue-600 text-white font-bold rounded-full hover:from-primary-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-primary-500/40 border border-primary-500/30 overflow-hidden group">
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="relative">Sign Up</span>
                  </Button>
                </Link>
              </motion.div>

              {/* Login Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login">
                  <Button className="px-6 py-2.5 !bg-white border-2 border-primary-300/50 !text-gray-900 font-bold rounded-full hover:bg-primary-50 hover:border-primary-400 transition-all duration-300 shadow-sm hover:shadow-md">
                    Login
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {!isMenuOpen && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register">
                  <Button className="px-3 py-2 text-xs md:text-sm bg-gradient-to-r from-primary-600 to-blue-600 text-white font-semibold rounded-full hover:from-primary-700 hover:to-blue-700 transition-all duration-300 shadow-md">
                    Sign Up
                  </Button>
                </Link>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-600 hover:text-primary-600 hover:bg-primary-100/50 focus:outline-none transition duration-300"
              aria-expanded={isMenuOpen}
            >
              {!isMenuOpen ? (
                <Menu size={24} />
              ) : (
                <X size={24} />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          variants={mobileMenuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="md:hidden border-t border-gray-200/50 bg-gradient-to-b from-white/95 to-primary-50/30 backdrop-blur-md"
        >
          <div className="px-4 pt-4 pb-6 space-y-3">
            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="px-5 py-3 text-gray-700 hover:text-primary-600 hover:bg-white/60 rounded-xl transition duration-300 font-semibold flex items-center gap-3"
                    >
                      {item.label}
                      <ChevronDown size={16} className="ml-auto text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 space-y-3 border-t border-gray-200/50">
              <Link to="/register" className="block" onClick={() => setIsMenuOpen(false)}>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button className="w-full py-3 bg-gradient-to-r from-primary-600 to-blue-600 text-white font-bold rounded-xl hover:from-primary-700 hover:to-blue-700 transition-all duration-300 shadow-md">
                    Sign Up Free
                  </Button>
                </motion.div>
              </Link>

              <Link to="/login" className="block" onClick={() => setIsMenuOpen(false)}>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button className="w-full py-3 !bg-white border-2 border-primary-300/50 !text-gray-900 font-bold rounded-xl hover:bg-primary-50 transition-all duration-300">
                    Login
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Mobile Menu Footer */}
            <div className="pt-4 border-t border-gray-200/50">
              <div className="text-center text-gray-600 text-sm font-medium px-4 py-3 bg-gradient-to-r from-primary-50/50 to-blue-50/50 rounded-xl border border-primary-200/30">
                <p className="flex items-center justify-center gap-2">
                  <span className="text-lg">✨</span>
                  Join 1000+ entrepreneurs & investors
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};