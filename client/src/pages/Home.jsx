import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ItemCard } from '../components/ItemCard';
import { LostFoundCard } from '../components/LostFoundCard';
import {
  Compass,
  ShoppingBag,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Zap,
  BookOpen,
  Cpu,
  Coffee,
  CheckCircle2,
} from 'lucide-react';

export const Home = ({ onOpenPostModal, onOpenReportModal, onOpenMatches, onContact }) => {
  const [stats, setStats] = useState(null);
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [lostFoundItems, setLostFoundItems] = useState([]);
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'lostfound'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [statsData, marketData, lostFoundData] = await Promise.all([
          api.stats.get().catch(() => ({ stats: {} })),
          api.marketplace.getAll({ limit: 6, status: 'active' }).catch(() => ({ items: [] })),
          api.lostFound.getAll({ limit: 6, status: 'open' }).catch(() => ({ items: [] })),
        ]);

        setStats(statsData.stats || {});
        setMarketplaceItems(marketData.items || []);
        setLostFoundItems(lostFoundData.items || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>The All-In-One Campus Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            Buy, Rent & Recover Gear Across{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Campus.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            CampusCircle brings your college community together. Rent or buy textbooks, calculators, and dorm essentials peer-to-peer, and recover lost campus items with our automated matching engine.
          </p>

          {/* Quick Dual CTA */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/marketplace"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4 text-slate-950" />
              Explore Marketplace
            </Link>

            <Link
              to="/lost-and-found"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition hover:scale-[1.02]"
            >
              <Search className="w-4 h-4 text-teal-400" />
              Lost & Found Auto-Match
            </Link>

            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-slate-300 hover:text-white text-xs font-semibold hover:bg-white/5 transition"
            >
              <span>+ Post a Listing</span>
            </button>
          </div>
        </div>

        {/* Live Campus Stats Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats?.activeListings ?? 6}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Active Campus Listings</p>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {stats?.forRentListings ?? 3}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Available for Rent</p>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-teal-400">
              {stats?.totalLost && stats?.totalFound ? stats.totalLost + stats.totalFound : 6}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Active Lost & Found Logs</p>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {stats?.totalStudents ?? 3}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Verified Students</p>
          </div>
        </div>
      </section>

      {/* Feature Showcase: The Dual System */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Peer-to-Peer Marketplace */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-5 shadow-xs">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Peer-to-Peer Marketplace
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Don’t spend hundreds at campus bookstores. Rent a TI-84 for one semester, buy Stewart Calculus at a fraction of the retail cost, or find dorm room essentials right down the hall.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Rent semester-by-semester or buy outright</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero transaction cuts — meet directly on campus</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Filtered by college building and study area</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/marketplace"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
            >
              Browse all items
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={onOpenPostModal}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition"
            >
              + List Item
            </button>
          </div>
        </div>

        {/* Card 2: Smart Lost & Found Auto-Matcher */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold mb-5 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Smart Lost & Found Auto-Matcher
              <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Automated
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Lost your water bottle or calculator in the library? Log it here, and our background engine cross-references categories, locations, dates, and token stems to auto-match counterpart reports.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Confidence scoring (0 - 100%) with explainable breakdown</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Identifies stickers, colors, and building proximity</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>1-click confirm match and resolve reports</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/lost-and-found"
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 group"
            >
              View Lost & Found Feed
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={onOpenReportModal}
              className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold hover:bg-teal-100 transition"
            >
              Report Item
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Tabs Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Campus Activity Feed
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live marketplace listings and active lost/found searches
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex p-1 bg-slate-200/80 rounded-xl self-start">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'marketplace'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
              Marketplace ({marketplaceItems.length})
            </button>

            <button
              onClick={() => setActiveTab('lostfound')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'lostfound'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-teal-600" />
              Lost & Found ({lostFoundItems.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Marketplace Items */}
        {activeTab === 'marketplace' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplaceItems.map((item) => (
                <ItemCard key={item._id} item={item} onContact={onContact} />
              ))}
            </div>

            <div className="text-center pt-4">
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 transition"
              >
                View all marketplace listings ({stats?.activeListings || marketplaceItems.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Tab 2: Lost & Found Items */}
        {activeTab === 'lostfound' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostFoundItems.map((item) => (
                <LostFoundCard
                  key={item._id}
                  item={item}
                  onOpenMatches={onOpenMatches}
                />
              ))}
            </div>

            <div className="text-center pt-4">
              <Link
                to="/lost-and-found"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 transition"
              >
                View full Lost & Found database
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* How the Smart Auto-Matcher Engine Works */}
      <section className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Under The Hood</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            How The Auto-Matcher Connects Students
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Our multi-attribute algorithm runs every time an item is logged or inspected.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-sm">
              01
            </div>
            <h4 className="text-sm font-bold text-slate-900">1. Category & Tag Normalization</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Aligns item categories (e.g. Calculators, Electronics, Bottles) and tokenizes distinctive tags such as brand names, stickers, and colors.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-sm">
              02
            </div>
            <h4 className="text-sm font-bold text-slate-900">2. Proximity & Date Scoring</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compares campus building locations (Library, Science Hall, Union) and gives highest weight to items reported within a 1-7 day window.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-sm">
              03
            </div>
            <h4 className="text-sm font-bold text-slate-900">3. 1-Click Verification</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Presents explainable matching factors with a percentage score (e.g. 100% High Match) so students can instantly claim and confirm handover.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
