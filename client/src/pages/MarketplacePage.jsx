import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ItemCard } from '../components/ItemCard';
import {
  ShoppingBag,
  Search,
  Filter,
  PlusCircle,
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Books',
  'Calculators & Tech',
  'Lab & Stationery',
  'Dorm & Room Gear',
  'Electronics',
  'Sports & Fitness',
];

export const MarketplacePage = ({ onOpenPostModal, onContact }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [listingType, setListingType] = useState('all'); // 'all' | 'rent' | 'buy'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-asc' | 'price-desc' | 'popular'

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await api.marketplace.getAll({
        search,
        category: selectedCategory,
        listingType,
        sortBy,
        status: 'active',
      });
      setItems(data.items || []);
    } catch (err) {
      console.error('Failed to fetch marketplace items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, listingType, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-10 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Campus Student Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Rent & Buy Gear Peer-to-Peer
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Borrow a graphing calculator for midterms, purchase textbooks from last semester's students, or find mini fridges and dorm desks.
          </p>
        </div>

        <button
          onClick={onOpenPostModal}
          className="px-5 py-3 rounded-xl bg-white text-emerald-900 font-bold text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition shrink-0 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4 text-emerald-700" />
          + Post Listing
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title, course (e.g. Stewart Calculus, TI-84, Mini Fridge)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
            >
              Search
            </button>
          </form>

          {/* Rent vs Buy Filter Buttons */}
          <div className="flex p-1 bg-slate-100 rounded-xl shrink-0">
            <button
              onClick={() => setListingType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                listingType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setListingType('rent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                listingType === 'rent'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Rent
            </button>
            <button
              onClick={() => setListingType('buy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                listingType === 'buy'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Buy
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
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
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-xs font-medium text-slate-500">Loading campus listings...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No items match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords, category filter, or post the first listing for your campus!
            </p>
          </div>
          <button
            onClick={onOpenPostModal}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
          >
            + Post Listing Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} onContact={onContact} />
          ))}
        </div>
      )}
    </div>
  );
};
