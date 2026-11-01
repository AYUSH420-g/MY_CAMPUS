import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, MapPin, Calendar, Tag, ShieldCheck } from 'lucide-react';

const CATEGORIES = [
  'Electronics & Gadgets',
  'Calculators',
  'Books & Notebooks',
  'ID Cards & Wallets',
  'Keys & Keychains',
  'Bottles & Containers',
  'Clothing & Accessories',
  'Bags & Backpacks',
  'Sports Equipment',
  'Other',
];

const PRESETS = [
  { label: 'Calculator', url: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80' },
  { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80' },
  { label: 'AirPods / Earbuds', url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80' },
  { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' },
  { label: 'Keys', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80' },
  { label: 'Notebook', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
];

export const ReportLostFoundModal = ({ isOpen, onClose, onItemReported, initialType = 'lost' }) => {
  const { isAuthenticated, demoLogin } = useAuth();
  const [reportType, setReportType] = useState(initialType);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics & Gadgets',
    location: '',
    dateOccurred: new Date().toISOString().split('T')[0],
    description: '',
    identifyingMarks: '',
    tagsString: '',
    imageUrl: PRESETS[0].url,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please log in first to report an item.');
      return;
    }

    if (!formData.title || !formData.location || !formData.description) {
      setError('Please fill in title, location, and description.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const tags = formData.tagsString
        ? formData.tagsString
            .split(',')
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean)
        : [];

      const res = await api.lostFound.create({
        type: reportType,
        title: formData.title,
        category: formData.category,
        location: formData.location,
        dateOccurred: new Date(formData.dateOccurred),
        description: formData.description,
        identifyingMarks: formData.identifyingMarks,
        tags,
        images: [formData.imageUrl || PRESETS[0].url],
      });

      onItemReported?.(res.item, res.topMatches);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const isLost = reportType === 'lost';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isLost ? 'bg-rose-50/60 border-rose-100' : 'bg-teal-50/60 border-teal-100'
          }`}
        >
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {isLost ? 'Report a Lost Item' : 'Report a Found Item'}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-2xs">
                Auto-Matched
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              CampusCircle will immediately search for potential counterpart matches
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle Lost vs Found */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex gap-2">
          <button
            type="button"
            onClick={() => setReportType('lost')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              isLost
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white" />
            I Lost Something
          </button>
          <button
            type="button"
            onClick={() => setReportType('found')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              !isLost
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white" />
            I Found Something
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {!isAuthenticated && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
              <span>You must be logged in to report an item.</span>
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
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isLost ? 'What did you lose? *' : 'What did you find? *'}
            </label>
            <input
              type="text"
              required
              placeholder={isLost ? 'e.g., TI-84 Plus CE Calculator, Blue Hydro Flask' : 'e.g., Found Apple AirPods Case, Set of Dorm Keys'}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isLost ? 'Date Lost' : 'Date Found'}
              </label>
              <input
                type="date"
                value={formData.dateOccurred}
                onChange={(e) => setFormData({ ...formData, dateOccurred: e.target.value })}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Campus Location / Room *</label>
            <input
              type="text"
              required
              placeholder="e.g., Main Library 2nd Floor, Engineering Block C Room 204, Cafeteria"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Identifying Marks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Distinctive Marks / Features (Great for Auto-Matching)
            </label>
            <input
              type="text"
              placeholder="e.g., NASA sticker on cover, engraved initials M.C., scratch on bottom"
              value={formData.identifyingMarks}
              onChange={(e) => setFormData({ ...formData, identifyingMarks: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description *</label>
            <textarea
              rows="3"
              required
              placeholder="Color, brand name, condition, where it was left or found..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Keywords / Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g., calculator, texas, ti-84, blue, library"
              value={formData.tagsString}
              onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Preset Images */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Item Photo</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
              {PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                    formData.imageUrl === preset.url ? 'border-teal-600 scale-95 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white text-[9px] text-center font-bold py-0.5 truncate px-1">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Auto-matcher banner */}
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-2 text-xs text-teal-800">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Once submitted, our smart engine will instantly run match analysis against all active {isLost ? 'found' : 'lost'} logs.
            </span>
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
              className={`px-5 py-2 text-xs font-bold rounded-xl text-white transition shadow-xs disabled:opacity-50 ${
                isLost ? 'bg-rose-600 hover:bg-rose-700' : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {submitting ? 'Submitting Report...' : `Submit ${isLost ? 'Lost' : 'Found'} Report`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
