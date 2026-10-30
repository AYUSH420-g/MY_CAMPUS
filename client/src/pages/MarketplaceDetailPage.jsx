import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import {
  MapPin,
  Calendar,
  Eye,
  ShieldCheck,
  MessageSquare,
  ArrowLeft,
  Share2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export const MarketplaceDetailPage = ({ onContact }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const data = await api.marketplace.getById(id);
        setItem(data.item);
      } catch (err) {
        setError('Listing not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="text-xs text-slate-500 font-medium">Loading listing details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">{error || 'Item not found'}</h3>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </Link>
      </div>
    );
  }

  const isRent = item.listingType === 'rent';
  const seller = item.seller || {};

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button & share */}
      <div className="flex items-center justify-between">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-slate-700"
        >
          {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          {copied ? 'Link Copied!' : 'Share'}
        </button>
      </div>

      {/* Main Detail Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Photo Gallery */}
        <div className="bg-slate-100 relative min-h-[350px] flex items-center justify-center overflow-hidden">
          <img
            src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
            alt={item.title}
            className="w-full h-full object-cover max-h-[500px]"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={isRent ? 'rent' : 'buy'} size="md">
              {isRent ? 'Available for Rent' : 'Available for Sale'}
            </Badge>
            <Badge variant="default" size="md" className="bg-white/90 backdrop-blur-md">
              {item.condition}
            </Badge>
          </div>

          <div className="absolute bottom-4 right-4 bg-slate-900/70 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
            <Eye className="w-3.5 h-3.5" />
            {item.views || 1} views
          </div>
        </div>

        {/* Content details */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {item.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                {item.title}
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {item.location}
                </span>
                <span>•</span>
                <span>{item.campus}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-slate-900">₹{item.price}</span>
                {isRent && (
                  <span className="text-xs font-semibold text-slate-500 ml-1.5">
                    /{item.rentalPeriod?.replace('per ', '') || 'semester'}
                  </span>
                )}
              </div>
              {isRent && item.deposit > 0 && (
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700">₹{item.deposit}</span>
                  <span className="text-[10px] text-slate-400 block">Refundable deposit</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Description & Notes
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>
          </div>

          {/* Seller Profile & Contact CTA */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={seller.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${seller.name || 'student'}`}
                  alt={seller.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{seller.name || 'Campus Student'}</h4>
                  <p className="text-xs text-slate-500">{seller.campus || 'Northwood University'}</p>
                </div>
              </div>

              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Verified Student
              </span>
            </div>

            <button
              onClick={() => onContact?.(item)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
            >
              <MessageSquare className="w-4 h-4" />
              Contact Seller / Arrange Campus Handover
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Recommended handover in student union, library, or public quad.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
