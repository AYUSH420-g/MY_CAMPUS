import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './Badge';
import { MapPin, Eye, Calendar, Sparkles, MessageSquare } from 'lucide-react';

export const ItemCard = ({ item, onContact }) => {
  const isRent = item.listingType === 'rent';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden hover:border-slate-300">
      {/* Image Thumbnail */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <Badge variant={isRent ? 'rent' : 'buy'}>
            {isRent ? 'For Rent' : 'For Sale'}
          </Badge>
          <Badge variant="default" className="bg-white/90 backdrop-blur-sm shadow-xs">
            {item.condition}
          </Badge>
        </div>

        {/* Views */}
        <div className="absolute bottom-2.5 right-2.5 bg-slate-900/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
          <Eye className="w-3 h-3" />
          {item.views || 0}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              {item.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 truncate max-w-[140px]">
              <MapPin className="w-3 h-3 shrink-0" />
              {item.location}
            </span>
          </div>

          <Link to={`/marketplace/${item._id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
              {item.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Seller / Action Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-900">
                ₹{item.price}
              </span>
              {isRent && (
                <span className="text-[11px] font-semibold text-slate-500">
                  /{item.rentalPeriod?.replace('per ', '') || 'semester'}
                </span>
              )}
            </div>
            {isRent && item.deposit > 0 && (
              <p className="text-[10px] text-slate-400">
                +₹{item.deposit} deposit
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onContact?.(item)}
              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition text-xs font-semibold flex items-center gap-1"
              title="Contact seller / rental owner"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Contact</span>
            </button>
            <Link
              to={`/marketplace/${item._id}`}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition text-xs font-semibold"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
