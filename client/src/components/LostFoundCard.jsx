import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './Badge';
import { MapPin, Calendar, Sparkles, Tag, CheckCircle2 } from 'lucide-react';

export const LostFoundCard = ({ item, onOpenMatches }) => {
  const isLost = item.type === 'lost';
  const isResolved = item.status === 'resolved';

  const formattedDate = item.dateOccurred
    ? new Date(item.dateOccurred).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : 'Recent';

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-200 flex flex-col overflow-hidden hover:shadow-md ${
        isResolved
          ? 'border-purple-200 bg-purple-50/20'
          : isLost
          ? 'border-slate-200 hover:border-rose-300'
          : 'border-slate-200 hover:border-teal-300'
      }`}
    >
      {/* Header bar indicating Lost or Found */}
      <div
        className={`px-4 py-2 flex items-center justify-between text-xs font-bold border-b ${
          isResolved
            ? 'bg-purple-100 text-purple-800 border-purple-200'
            : isLost
            ? 'bg-rose-50 text-rose-800 border-rose-100'
            : 'bg-teal-50 text-teal-800 border-teal-100'
        }`}
      >
        <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
          <span
            className={`w-2 h-2 rounded-full ${
              isResolved ? 'bg-purple-600' : isLost ? 'bg-rose-600' : 'bg-teal-600 animate-pulse'
            }`}
          />
          {isResolved ? 'Recovered & Resolved' : isLost ? 'Item Lost' : 'Item Found'}
        </span>
        <span className="text-[11px] font-medium opacity-80 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formattedDate}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Location */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {item.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 truncate max-w-[150px]">
              <MapPin className="w-3 h-3 shrink-0" />
              {item.location}
            </span>
          </div>

          {/* Title */}
          <Link to={`/lost-and-found/${item._id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {item.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Distinctive marks / Tags preview */}
          {item.identifyingMarks && (
            <div className="mt-2 text-[11px] bg-slate-50 border border-slate-100 rounded-lg p-2 text-slate-600 line-clamp-1">
              <span className="font-bold text-slate-700">Identifying Mark:</span>{' '}
              {item.identifyingMarks}
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {item.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                >
                  #{tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="text-[10px] text-slate-400 font-medium self-center">
                  +{item.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer with Auto-Matcher Trigger */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <img
              src={item.reporter?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.reporter?.name || 'student'}`}
              alt={item.reporter?.name || 'Reporter'}
              className="w-5 h-5 rounded-full object-cover border border-slate-200"
            />
            <span className="text-xs text-slate-600 truncate max-w-[90px]">
              {item.reporter?.name?.split(' ')[0] || 'Student'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {!isResolved ? (
              <button
                onClick={() => onOpenMatches?.(item)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs font-bold hover:brightness-105 transition shadow-xs"
                title="Run Smart Auto-Matcher for counterpart items"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Match</span>
              </button>
            ) : (
              <span className="text-xs font-semibold text-purple-700 flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
              </span>
            )}

            <Link
              to={`/lost-and-found/${item._id}`}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-xs font-semibold"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
