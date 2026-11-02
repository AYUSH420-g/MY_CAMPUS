import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Badge } from '../components/Badge';
import { Link } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  Search,
  Sparkles,
  PlusCircle,
  Trash2,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Calendar,
} from 'lucide-react';

export const DashboardPage = ({ onOpenPostModal, onOpenReportModal, onOpenMatches }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'lostfound'
  const [myListings, setMyListings] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [listingsData, reportsData] = await Promise.all([
        api.marketplace.getMyListings().catch(() => ({ items: [] })),
        api.lostFound.getMyReports().catch(() => ({ reports: [] })),
      ]);
      setMyListings(listingsData.items || []);
      setMyReports(reportsData.reports || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.marketplace.delete(id);
      setMyListings((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete listing');
    }
  };

  const handleUpdateListingStatus = async (id, newStatus) => {
    try {
      await api.marketplace.update(id, { status: newStatus });
      setMyListings((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Student Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'student'}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {user?.name}
              </h1>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Student
              </span>
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium pt-0.5">
              <span>{user?.campus || 'Northwood University'}</span>
              {user?.studentId && <span>• ID: {user.studentId}</span>}
              {user?.phone && <span>• {user.phone}</span>}
            </div>
          </div>
        </div>

        {/* Quick Post buttons */}
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenPostModal}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Post Item
          </button>
          <button
            onClick={() => onOpenReportModal('lost')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            Report Lost/Found
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
              activeTab === 'marketplace'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            My Marketplace Listings ({myListings.length})
          </button>

          <button
            onClick={() => setActiveTab('lostfound')}
            className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition ${
              activeTab === 'lostfound'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            My Lost & Found Reports ({myReports.length})
          </button>
        </div>

        {/* Tab 1: Marketplace Listings */}
        {activeTab === 'marketplace' && (
          <div>
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-500">Loading your listings...</div>
            ) : myListings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No active listings yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Have textbooks, dorm electronics, or calculators to rent or sell? Post your first item!
                </p>
                <button
                  onClick={onOpenPostModal}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                >
                  + Post a Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video bg-slate-100">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex gap-1">
                          <Badge variant={item.listingType === 'rent' ? 'rent' : 'buy'}>
                            {item.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                          </Badge>
                          <Badge variant={item.status === 'active' ? 'primary' : 'default'}>
                            {item.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {item.category}
                        </span>
                        <Link to={`/marketplace/${item._id}`}>
                          <h4 className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition line-clamp-1">
                            {item.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                        <p className="text-base font-black text-slate-900 pt-1">
                          ₹{item.price}{' '}
                          <span className="text-[10px] font-semibold text-slate-400">
                            {item.listingType === 'rent' ? item.rentalPeriod : ''}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                      <div className="flex gap-1">
                        {item.status === 'active' ? (
                          <button
                            onClick={() => handleUpdateListingStatus(item._id, item.listingType === 'rent' ? 'rented' : 'sold')}
                            className="px-2 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                          >
                            Mark {item.listingType === 'rent' ? 'Rented' : 'Sold'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateListingStatus(item._id, 'active')}
                            className="px-2 py-1 text-[11px] font-semibold rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                          >
                            Mark Active
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteListing(item._id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Lost & Found Reports */}
        {activeTab === 'lostfound' && (
          <div>
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-500">Loading your reports...</div>
            ) : myReports.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <Search className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No lost or found reports logged</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  If you misplaced an item or found someone's gear, log a report to run automatic campus matching.
                </p>
                <button
                  onClick={() => onOpenReportModal('lost')}
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition"
                >
                  Report an Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myReports.map((report) => (
                  <div
                    key={report._id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={report.status === 'resolved' ? 'resolved' : report.type === 'lost' ? 'lost' : 'found'}>
                          {report.status === 'resolved' ? 'Resolved' : report.type === 'lost' ? 'Lost Item' : 'Found Item'}
                        </Badge>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {report.dateOccurred
                            ? new Date(report.dateOccurred).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'Recent'}
                        </span>
                      </div>

                      <Link to={`/lost-and-found/${report._id}`}>
                        <h4 className="text-base font-bold text-slate-900 hover:text-teal-700 transition line-clamp-1">
                          {report.title}
                        </h4>
                      </Link>

                      <p className="text-xs text-slate-500 line-clamp-2">{report.description}</p>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{report.location}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => onOpenMatches?.(report)}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold hover:bg-teal-100 transition flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        Check Auto-Matches
                      </button>

                      <Link
                        to={`/lost-and-found/${report._id}`}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
