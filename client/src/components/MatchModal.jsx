import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge } from './Badge';
import {
  Sparkles,
  X,
  MapPin,
  Calendar,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MatchModal = ({ item, isOpen, onClose, onResolved }) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resolvingId, setResolvingId] = useState(null);
  const [resolvedSuccess, setResolvedSuccess] = useState(false);

  useEffect(() => {
    if (!item?._id || !isOpen) return;

    const fetchMatches = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.lostFound.getMatches(item._id, { minScore: 25 });
        setMatches(data.matches || []);
      } catch (err) {
        console.error('Failed to calculate matches:', err);
        setError('Could not run auto-matcher. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [item?._id, isOpen]);

  if (!isOpen || !item) return null;

  const isLost = item.type === 'lost';
  const counterpartName = isLost ? 'Found' : 'Lost';

  const handleConfirmMatch = async (matchedCandidateId) => {
    if (!window.confirm('Mark these items as matched and successfully recovered?')) {
      return;
    }

    setResolvingId(matchedCandidateId);
    try {
      await api.lostFound.resolveMatch(item._id, {
        matchedWithId: matchedCandidateId,
      });
      setResolvedSuccess(true);
      onResolved?.();
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      alert(err.message || 'Failed to resolve match');
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-teal-50 to-emerald-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Smart Auto-Matcher
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  AI Scoring Engine
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Scanning campus database for potential {counterpartName.toLowerCase()} item matches
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Target Item Summary */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 font-medium">Your Item: </span>
            <span className="font-bold text-slate-800">{item.title}</span>
            <span className="text-slate-400 ml-2">({item.location})</span>
          </div>
          <Badge variant={isLost ? 'lost' : 'found'}>
            {isLost ? 'Reported Lost' : 'Reported Found'}
          </Badge>
        </div>

        {/* Matches Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {resolvedSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Match Confirmed & Resolved!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Both items have been marked as successfully matched. Great job helping keep our campus connected!
              </p>
            </div>
          ) : loading ? (
            <div className="py-12 text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
              <p className="text-xs font-medium text-slate-500">
                Calculating category overlaps, keyword stems, and location proximity...
              </p>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-rose-600 text-xs">{error}</div>
          ) : matches.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No counterpart matches yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find an existing {counterpartName.toLowerCase()} item matching these exact categories or keywords. CampusCircle will continue evaluating newly reported items automatically!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>{matches.length} Potential Counterpart {matches.length === 1 ? 'Match' : 'Matches'} Found</span>
                <span className="text-emerald-700 font-semibold">Ranked by Match Score</span>
              </div>

              {matches.map(({ item: candidate, score, confidence, reasons }) => {
                const isHigh = score >= 70;
                const isMedium = score >= 45 && score < 70;

                return (
                  <div
                    key={candidate._id}
                    className={`rounded-xl border p-4 transition-all ${
                      isHigh
                        ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                        : isMedium
                        ? 'bg-amber-50/30 border-amber-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {/* Score Indicator */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                              isHigh
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : isMedium
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            <Sparkles className="w-3 h-3" />
                            {score}% Match Confidence
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            {candidate.category}
                          </span>
                        </div>

                        <Link
                          to={`/lost-and-found/${candidate._id}`}
                          onClick={onClose}
                          className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition flex items-center gap-1 group"
                        >
                          {candidate.title}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                        </Link>

                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {candidate.description}
                        </p>

                        <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {candidate.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {candidate.dateOccurred
                              ? new Date(candidate.dateOccurred).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'Recent'}
                          </span>
                        </div>
                      </div>

                      {/* Candidate Photo */}
                      {candidate.images?.[0] && (
                        <img
                          src={candidate.images[0]}
                          alt={candidate.title}
                          className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                      )}
                    </div>

                    {/* Explainable Match Factors */}
                    {reasons && reasons.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Why this matches:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {reasons.map((r, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md font-medium text-slate-700 shadow-2xs"
                            >
                              ✓ {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-slate-200/60 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span>Reported by:</span>
                        <span className="font-semibold text-slate-700">
                          {candidate.reporter?.name || 'Fellow Student'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/lost-and-found/${candidate._id}`}
                          onClick={onClose}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-700 hover:bg-slate-100 transition"
                        >
                          Inspect Item
                        </Link>
                        <button
                          disabled={resolvingId === candidate._id}
                          onClick={() => handleConfirmMatch(candidate._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{resolvingId === candidate._id ? 'Resolving...' : 'Confirm Match'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>AI match confidence derived from category, NLP stem overlap, and campus proximity.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
