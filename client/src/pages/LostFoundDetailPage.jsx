import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import {
  MapPin,
  Calendar,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Tag,
  AlertTriangle,
  Mail,
  Phone,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const LostFoundDetailPage = ({ onContact }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchingLoading, setMatchingLoading] = useState(true);
  const [error, setError] = useState('');
  const [resolvingId, setResolvingId] = useState(null);
  const [resolvedSuccess, setResolvedSuccess] = useState(false);

  useEffect(() => {
    const fetchItemAndMatches = async () => {
      setLoading(true);
      try {
        const itemRes = await api.lostFound.getById(id);
        setItem(itemRes.item);

        // Fetch matches
        setMatchingLoading(true);
        const matchRes = await api.lostFound.getMatches(id, { minScore: 25 });
        setMatches(matchRes.matches || []);
      } catch (err) {
        setError('Lost & found item not found or has been removed.');
      } finally {
        setLoading(false);
        setMatchingLoading(false);
      }
    };

    fetchItemAndMatches();
  }, [id]);

  const handleResolve = async (matchedId) => {
    if (!window.confirm('Mark this item as successfully matched and resolved?')) return;

    setResolvingId(matchedId || 'self');
    try {
      await api.lostFound.resolveMatch(item._id, {
        matchedWithId: matchedId || null,
      });
      setResolvedSuccess(true);
      const updated = await api.lostFound.getById(id);
      setItem(updated.item);
    } catch (err) {
      alert(err.message || 'Failed to resolve item');
    } finally {
      setResolvingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
        <p className="text-xs text-slate-500 font-medium">Loading report & running auto-matcher...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">{error || 'Item not found'}</h3>
        <Link
          to="/lost-and-found"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Lost & Found
        </Link>
      </div>
    );
  }

  const isLost = item.type === 'lost';
  const isResolved = item.status === 'resolved';
  const reporter = item.reporter || {};

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/lost-and-found"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Lost & Found Feed
        </Link>
      </div>

      {/* Main Item Report Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Photo view */}
        <div className="bg-slate-100 relative min-h-[320px] flex items-center justify-center overflow-hidden">
          <img
            src={item.images?.[0] || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'}
            alt={item.title}
            className="w-full h-full object-cover max-h-[450px]"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={isResolved ? 'resolved' : isLost ? 'lost' : 'found'} size="md">
              {isResolved ? 'Resolved / Recovered' : isLost ? 'Item Lost' : 'Item Found'}
            </Badge>
            <Badge variant="default" size="md" className="bg-white/90 backdrop-blur-md">
              {item.category}
            </Badge>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {item.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                {item.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  {item.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  {item.dateOccurred
                    ? new Date(item.dateOccurred).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Recent'}
                </span>
              </div>
            </div>

            {/* Distinctive marks */}
            {item.identifyingMarks && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  Identifying Marks / Distinguishing Features
                </p>
                <p className="text-xs text-amber-900 font-medium">{item.identifyingMarks}</p>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Description
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Reporter & Contact */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={reporter.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${reporter.name || 'reporter'}`}
                  alt={reporter.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{reporter.name || 'Campus Member'}</h4>
                  <p className="text-xs text-slate-500">{reporter.campus || 'Northwood University'}</p>
                </div>
              </div>

              {!isResolved && (
                <button
                  onClick={() => handleResolve(null)}
                  disabled={resolvingId === 'self'}
                  className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Matcher Results Section */}
      <section className="bg-gradient-to-b from-teal-50/50 to-white rounded-3xl p-6 sm:p-8 border border-teal-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                Live Auto-Matcher Results
                <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold uppercase">
                  {matches.length} Matches Found
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Cross-referenced against opposite category reports across campus
              </p>
            </div>
          </div>
        </div>

        {matchingLoading ? (
          <div className="py-8 text-center space-y-2">
            <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
            <p className="text-xs text-slate-500 font-medium">Running match scoring algorithm...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <p className="text-xs font-semibold text-slate-700">No counterpart items match at this time</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              CampusCircle continuously checks new lost & found entries and flags high confidence pairs automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map(({ item: candidate, score, confidence, reasons }) => {
              const isHigh = score >= 70;
              const isMedium = score >= 45 && score < 70;

              return (
                <div
                  key={candidate._id}
                  className={`bg-white rounded-2xl p-5 border transition-all hover:shadow-md flex flex-col justify-between ${
                    isHigh ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Score badge & counterpart type */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          isHigh
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : isMedium
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {score}% Confidence Match
                      </span>

                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        {candidate.type === 'lost' ? 'Lost Item' : 'Found Item'}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      {candidate.images?.[0] && (
                        <img
                          src={candidate.images[0]}
                          alt={candidate.title}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      )}
                      <div>
                        <Link
                          to={`/lost-and-found/${candidate._id}`}
                          className="text-sm font-bold text-slate-900 hover:text-teal-700 transition line-clamp-1"
                        >
                          {candidate.title}
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                          {candidate.description}
                        </p>
                      </div>
                    </div>

                    {/* Location & date */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {candidate.location}
                      </span>
                    </div>

                    {/* Breakdown Reasons */}
                    {reasons && reasons.length > 0 && (
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Why this matches:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {reasons.map((r, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium"
                            >
                              ✓ {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      By {candidate.reporter?.name || 'Student'}
                    </span>

                    <div className="flex gap-2">
                      <Link
                        to={`/lost-and-found/${candidate._id}`}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-700 hover:bg-slate-100 transition"
                      >
                        View Details
                      </Link>

                      {!isResolved && (
                        <button
                          disabled={resolvingId === candidate._id}
                          onClick={() => handleResolve(candidate._id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs disabled:opacity-50 flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{resolvingId === candidate._id ? 'Resolving...' : 'Confirm Match'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
