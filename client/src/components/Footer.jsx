import React from 'react';
import { Compass, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Campus<span className="text-emerald-400">Circle</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              The verified college campus portal. Rent and buy textbooks, calculators, and dorm gear peer-to-peer, and recover lost campus items with our automated matching engine.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus-only verified community • Safe meetup recommendations</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/marketplace" className="hover:text-emerald-400 transition">Textbooks & Books</a></li>
              <li><a href="/marketplace" className="hover:text-emerald-400 transition">Calculators & Electronics</a></li>
              <li><a href="/marketplace" className="hover:text-emerald-400 transition">Dorm & Room Rentals</a></li>
              <li><a href="/lost-and-found" className="hover:text-teal-400 transition">Smart Lost & Found</a></li>
            </ul>
          </div>

          {/* Campus Safety */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Campus Meetup Safety
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Meet in well-lit public spots: Student Union, Campus Library, or Dining Hall.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Inspect items or test calculators/chargers before exchanging payment or deposit.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CampusCircle. Built for college students everywhere.</p>
          <div className="flex gap-4">
            <span className="text-emerald-400 font-medium">Peer-to-Peer Marketplace</span>
            <span>•</span>
            <span className="text-teal-400 font-medium">Smart Lost & Found Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
