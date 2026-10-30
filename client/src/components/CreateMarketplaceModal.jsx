import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, PlusCircle, Image, DollarSign, MapPin, Tag } from 'lucide-react';

const CATEGORIES = [
  'Books',
  'Calculators & Tech',
  'Lab & Stationery',
  'Dorm & Room Gear',
  'Electronics',
  'Sports & Fitness',
  'Other',
];

const PRESET_IMAGES = [
  { label: 'Textbook', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Calculator', url: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80' },
  { label: 'Dorm Gear', url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80' },
  { label: 'Electronics', url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80' },
  { label: 'Desk Chair', url: 'https://images.unsplash.com/photo-1580481077195-c22ae2534782?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lab Kit', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80' },
];

export const CreateMarketplaceModal = ({ isOpen, onClose, onItemCreated }) => {
  const { isAuthenticated, demoLogin } = useAuth();
  const [listingType, setListingType] = useState('buy');
  const [formData, setFormData] = useState({
    title: '',
    category: 'Books',
    price: '',
    rentalPeriod: 'per semester',
    deposit: '',
    condition: 'Gently Used',
    location: 'Student Union / Quad',
    description: '',
    imageUrl: PRESET_IMAGES[0].url,
    preferredMethod: 'Campus Meetup',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please log in first to post an item.');
      return;
    }

    if (!formData.title || !formData.price || !formData.description) {
      setError('Please fill in title, price, and description.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.marketplace.create({
        title: formData.title,
        category: formData.category,
        listingType,
        price: Number(formData.price),
        rentalPeriod: listingType === 'rent' ? formData.rentalPeriod : 'flat purchase',
        deposit: formData.deposit ? Number(formData.deposit) : 0,
        condition: formData.condition,
        location: formData.location,
        description: formData.description,
        images: [formData.imageUrl || PRESET_IMAGES[0].url],
        contactInfo: {
          preferredMethod: formData.preferredMethod,
        },
      });

      onItemCreated?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">List an Item on Campus</h2>
            <p className="text-xs text-slate-500">Peer-to-peer buy, sell, or rent with fellow students</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listing Type Toggle */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex gap-2">
          <button
            type="button"
            onClick={() => setListingType('buy')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              listingType === 'buy'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Sell (One-Time Purchase)
          </button>
          <button
            type="button"
            onClick={() => setListingType('rent')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              listingType === 'rent'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Rent Out (Semester, Week, Month)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {!isAuthenticated && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
              <span>You must be logged in to post.</span>
              <button
                type="button"
                onClick={() => demoLogin('alex@campus.edu')}
                className="font-bold underline text-amber-900"
              >
                1-Click Demo Login
              </button>
            </div>
          )}

          {error && <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">{error}</div>}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Item Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Stewart Calculus 8th Ed, TI-84 Plus, Mini Fridge"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Gently Used">Gently Used</option>
                <option value="Acceptable">Acceptable</option>
              </select>
            </div>
          </div>

          {/* Pricing & Rental details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {listingType === 'rent' ? 'Rental Rate (₹) *' : 'Price (₹) *'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-semibold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  placeholder="350"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full text-xs pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {listingType === 'rent' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                <select
                  value={formData.rentalPeriod}
                  onChange={(e) => setFormData({ ...formData, rentalPeriod: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="per semester">per semester</option>
                  <option value="per month">per month</option>
                  <option value="per week">per week</option>
                  <option value="per day">per day</option>
                </select>
              </div>
            )}

            {listingType === 'rent' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deposit (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-semibold">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="500"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    className="w-full text-xs pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Location & Preferred Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Campus Meetup Spot</label>
              <input
                type="text"
                placeholder="Library / Student Union / North Quad"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Method</label>
              <select
                value={formData.preferredMethod}
                onChange={(e) => setFormData({ ...formData, preferredMethod: e.target.value })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Campus Meetup">Campus Meetup</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
                <option value="Call">Phone Call</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
            <textarea
              rows="3"
              required
              placeholder="State edition, course code, cleanliness, what's included..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Image Presets / URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Cover Image</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                    formData.imageUrl === preset.url ? 'border-emerald-600 scale-95 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[9px] text-center font-bold py-0.5 truncate px-1">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
            <input
              type="url"
              placeholder="Or paste custom image URL..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full text-[11px] px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
