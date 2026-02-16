import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  MessageCircle,
  User,
  LogOut,
  Building2,
  CircleDollarSign,
  Shield,
  UsersRoundIcon,
  Briefcase,
  Settings,
  ClipboardCheck,
  Ban,
  ChevronDown,
  Home,
  Rocket,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { NotificationDropdown } from "../common/NotificationDropdown";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Auto-close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Determine dashboard route by role
  const dashboardRoute =
    user?.role === "entrepreneur"
      ? "/dashboard/entrepreneur"
      : user?.role === "investor"
        ? "/dashboard/investor"
        : user?.role === "admin"
          ? "/dashboard/admin"
          : "/login";

  // Determine profile route by role
  const profileRoute = user ? `/profile/${user.role}/${user.userId}` : "/login";
  const editProfileRoute = user
    ? `/settings`
    : "/login";

  // Navigation links by role
  let navLinks: { icon: JSX.Element; label: string; path: string }[] = [];
  let adminMobileLinks: { icon: JSX.Element; label: string; path: string }[] = [];

  if (user?.role === "admin") {
    navLinks = [
      {
        icon: <Shield size={18} />,
        label: "Dashboard",
        path: dashboardRoute,
      },
      {
        icon: <Briefcase size={18} />,
        label: "Users",
        path: "/admin/all-users",
      },
      {
        icon: <Rocket size={18} />,
        label: "Campaigns",
        path: "/admin/campaigns",
      },
      {
        icon: <UsersRoundIcon size={18} />,
        label: "Supporters",
        path: "/admin/Supporters",
      },
    ];
    adminMobileLinks = [
      {
        icon: <ClipboardCheck size={18} />,
        label: "Approvals",
        path: "/dashboard/admin/approvals",
      },
      {
        icon: <Ban size={18} />,
        label: "Suspended/Blocked",
        path: "/admin/suspended-blocked",
      },
    ];
  } else {
    // Normal user (entrepreneur or investor)
    navLinks = [
      {
        icon:
          <Home size={18} />,
        label: "Dashboard",
        path: dashboardRoute,
      },
      {
        icon: <MessageCircle size={18} />,
        label: "Messages",
        path: "/messages",
      },
      { icon: <Rocket size={18} />, label: "Campaigns", path: `/dashboard/campaigns` },
    ];
  }

  return (
    <nav className="sticky top-0 bg-white shadow-sm border-b border-gray-100 backdrop-blur-sm bg-white/95 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">

            <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center">
              {/* <Handshake className="text-white" /> */}
              <img
                src="/tab-logo1.png"
                alt="TrustBridge AI Logo"
                className="w-auto h-full object-contain"
              />
            </div>
            <span className="text-lg font-bold text-gray-900">
              TrustBridge AI
            </span>

          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:ml-6">
            {user ? (
              <div className="flex items-center space-x-3">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="group relative flex items-center bg-gray-50/50 hover:bg-blue-50/80 px-3 py-2 rounded-full transition-all duration-300 ease-out hover:shadow-sm border border-transparent hover:border-blue-100 overflow-hidden"
                  >
          <div className="relative text-gray-500 group-hover:text-blue-600 transition-colors duration-500 transform group-hover:translate-x-1 group-hover:scale-105 z-10 w-6 h-6 flex items-center justify-center">
            {link.icon}
          </div>
          <span className="whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-xs opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] text-sm font-semibold text-gray-700 group-hover:text-blue-600 pl-0 group-hover:pl-2">
            {link.label}
          </span>
                  </Link>
                ))}

                {/* Subtle divider between nav actions and profile cluster */}
                <span className="hidden md:block h-6 w-px bg-gray-200" aria-hidden="true" />

                {user && <NotificationDropdown />}

                {/* Profile dropdown */}
                <div className="relative" ref={profileMenuRef}>
                 <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-all shadow-sm hover:shadow active:scale-95"
                  >
                    <Avatar
                      src={user.avatarUrl}
                      alt={user.name}
                      size="sm"
                      status={user.isOnline ? "online" : "offline"}
                    />
                    <div className="flex flex-col items-start mr-1">
                      <span className="text-xs font-medium text-gray-700 leading-none">
                        {user.name?.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium capitalize mt-0.5">
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform duration-300 ${isProfileMenuOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-3 w-48 rounded-xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 z-50 py-2 transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      
                      <Link
                        to={editProfileRoute}
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Settings size={16} />
                        <span>Edit Profile</span>
                      </Link>
                      
                      <div className="border-t border-gray-50 my-1"></div>
                      
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                       <LogOut size={16} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && <NotificationDropdown />}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 focus:outline-none transition-transform duration-300"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6 transform rotate-0 scale-100 transition-all duration-300" />
              ) : (
                <Menu className="block h-6 w-6 transform rotate-0 scale-100 transition-all duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white border-b border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen
          ? "max-h-screen opacity-100 translate-y-0"
          : "max-h-0 opacity-0 -translate-y-2"
          }`}
      >
        <div
          className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 transition-opacity duration-300 ${isMenuOpen ? "opacity-100 delay-150" : "opacity-0"
            }`}
        >
          {user ? (
            <>
              <div className="flex items-center space-x-3 px-3 py-2">
                <Avatar
                  src={user.avatarUrl}
                  alt={user.name}
                  size="sm"
                  status={user.isOnline ? "online" : "offline"}
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-2">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}

                {/* Admin-only mobile links */}
                {adminMobileLinks.map((link, index) => (
                  <Link
                    key={`mobile-admin-${index}`}
                    to={link.path}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}

                <Link
                  to="/settings"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings size={18} className="mr-3" />
                  Settings
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col space-y-2 px-3 py-2">
              <Link
                to="/login"
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="outline" fullWidth>
                  Log in
                </Button>
              </Link>
              <Link
                to="/register"
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button fullWidth>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};