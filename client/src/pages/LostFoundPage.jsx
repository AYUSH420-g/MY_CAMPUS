import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LostFoundCard } from '../components/LostFoundCard';
import {
  Search,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Filter,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electronics & Gadgets',
  'Calculators',
  'Books & Notebooks',
  'Bottles & Containers',
  'ID Cards & Wallets',
  'Keys & Keychains',
  'Clothing & Accessories',
  'Bags & Backpacks',
];

export const LostFoundPage = ({ onOpenReportModal, onOpenMatches }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'lost' | 'found' | 'resolved'
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory,
        search,
      };

      if (selectedType === 'lost' || selectedType === 'found') {
        params.type = selectedType;
        params.status = 'open';
      } else if (selectedType === 'resolved') {
        params.status = 'resolved';
      } else {
        params.status = 'all';
      }

      const data = await api.lostFound.getAll(params);
      setItems(data.items || []);
    } catch (err) {
      console.error('Failed to fetch lost/found items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedType, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>AI Automated Matching Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Smart Campus Lost & Found
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
            Report lost possessions or items you stumbled upon. CampusCircle auto-matches categories, location proximity, and keyword tags with explainable confidence scores.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => onOpenReportModal('lost')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4" />
            I Lost Something
          </button>
          <button
            onClick={() => onOpenReportModal('found')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            I Found Something
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by keywords, tags (e.g. TI-84, Hydro Flask, AirPods, Library, Blue)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
            >
              Search
            </button>
          </form>

          {/* Type Toggle Buttons */}
          <div className="flex p-1 bg-slate-100 rounded-xl shrink-0 overflow-x-auto">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setSelectedType('lost')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedType === 'lost'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost Only
            </button>
            <button
              onClick={() => setSelectedType('found')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedType === 'found'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found Only
            </button>
            <button
              onClick={() => setSelectedType('resolved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                selectedType === 'resolved'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recovered
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of items */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-xs font-medium text-slate-500">Checking lost & found reports...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No lost or found items found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Nothing currently reported matching your query. Have you lost or found something? Log it to activate the auto-matcher!
            </p>
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => onOpenReportModal('lost')}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
            >
              Report Lost Item
            </button>
            <button
              onClick={() => onOpenReportModal('found')}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition"
            >
              Report Found Item
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <LostFoundCard
              key={item._id}
              item={item}
              onOpenMatches={onOpenMatches}
            />
          ))}
        </div>
      )}
    </div>
  );
};
