import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Sparkles, Mail, Lock, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail) => {
    setLoading(true);
    setError('');
    try {
      await demoLogin(demoEmail);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to demo login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-6">
      {/* Brand header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome to CampusCircle
        </h1>
        <p className="text-xs text-slate-500">
          Sign in to post marketplace items and manage lost & found reports
        </p>
      </div>

      {/* 1-Click Demo Accounts Box */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>1-Click Demo Student Accounts:</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('alex@campus.edu')}
            className="p-2 rounded-xl bg-white border border-amber-200 text-slate-800 text-[11px] font-bold hover:bg-amber-100/50 transition flex flex-col items-center shadow-2xs"
          >
            <span>Alex Rivera</span>
            <span className="text-[9px] font-normal text-slate-500">Poster / Seller</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('maya@campus.edu')}
            className="p-2 rounded-xl bg-white border border-amber-200 text-slate-800 text-[11px] font-bold hover:bg-amber-100/50 transition flex flex-col items-center shadow-2xs"
          >
            <span>Maya Chen</span>
            <span className="text-[9px] font-normal text-slate-500">Rental Owner</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('jordan@campus.edu')}
            className="p-2 rounded-xl bg-white border border-amber-200 text-slate-800 text-[11px] font-bold hover:bg-amber-100/50 transition flex flex-col items-center shadow-2xs"
          >
            <span>Jordan Taylor</span>
            <span className="text-[9px] font-normal text-slate-500">Item Finder</span>
          </button>
        </div>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Campus Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="student@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};
