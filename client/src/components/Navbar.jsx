import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  ShoppingBag,
  Search,
  PlusCircle,
  AlertCircle,
  User,
  LogOut,
  LayoutDashboard,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

export const Navbar = ({ onOpenPostModal, onOpenReportModal }) => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleDemoSignIn = async () => {
    try {
      await demoLogin('alex@campus.edu');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Campus<span className="text-emerald-600">Circle</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Atlas DB
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
                Marketplace & Smart Lost & Found
              </p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/marketplace"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/marketplace')
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              Marketplace
            </Link>

            <Link
              to="/lost-and-found"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/lost-and-found')
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4 text-teal-600" />
              Lost & Found
              <span className="inline-flex items-center gap-1 text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-bold">
                <Sparkles className="w-2.5 h-2.5" /> Auto-Match
              </span>
            </Link>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Quick Action Buttons */}
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              title="Report an item as Lost or Found"
            >
              <AlertCircle className="w-3.5 h-3.5 text-teal-600" />
              Report Lost/Found
            </button>

            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition"
              title="Post an item for Rent or Sale"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              List Item
            </button>

            {isAuthenticated ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <p className="text-[11px] font-medium text-emerald-600 mt-0.5">
                        {user.campus || 'Northwood Campus'}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard & My Items
                    </Link>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={handleDemoSignIn}
                  className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
                  title="Instantly sign in with demo student account"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" /> Demo Student
                </button>
                <Link
                  to="/login"
                  className="text-xs font-semibold px-3 py-2 text-slate-700 hover:text-slate-900 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 py-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" /> Marketplace
          </Link>
          <Link
            to="/lost-and-found"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 py-1.5"
          >
            <Search className="w-4 h-4 text-teal-600" /> Lost & Found
          </Link>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPostModal();
              }}
              className="w-full text-center py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white"
            >
              + Post Marketplace Listing
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReportModal();
              }}
              className="w-full text-center py-2 text-xs font-bold rounded-lg border border-slate-300 text-slate-700"
            >
              Report Lost or Found Item
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold text-slate-800"
                >
                  My Dashboard ({user.name})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-xs font-semibold text-rose-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleDemoSignIn();
                  }}
                  className="flex-1 py-2 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-center"
                >
                  1-Click Demo
                </button>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg text-center"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
