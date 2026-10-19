import MarketplaceItem from '../models/MarketplaceItem.js';
import LostFoundItem from '../models/LostFoundItem.js';
import User from '../models/User.js';

// @desc    Get platform stats and recent campus activity
// @route   GET /api/stats
// @access  Public
export const getPlatformStats = async (req, res, next) => {
  try {
    const [
      activeListings,
      forRentListings,
      forSaleListings,
      totalLost,
      totalFound,
      resolvedItems,
      totalStudents,
      recentMarketplace,
      recentLostFound,
    ] = await Promise.all([
      MarketplaceItem.countDocuments({ status: 'active' }),
      MarketplaceItem.countDocuments({ status: 'active', listingType: 'rent' }),
      MarketplaceItem.countDocuments({ status: 'active', listingType: 'buy' }),
      LostFoundItem.countDocuments({ type: 'lost', status: 'open' }),
      LostFoundItem.countDocuments({ type: 'found', status: 'open' }),
      LostFoundItem.countDocuments({ status: 'resolved' }),
      User.countDocuments(),
      MarketplaceItem.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(4)
        .populate('seller', 'name avatar'),
      LostFoundItem.find({ status: 'open' })
        .sort({ createdAt: -1 })
        .limit(4)
        .populate('reporter', 'name avatar'),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        activeListings,
        forRentListings,
        forSaleListings,
        totalLost,
        totalFound,
        resolvedItems,
        totalStudents,
      },
      recentActivity: {
        marketplace: recentMarketplace,
        lostFound: recentLostFound,
      },
    });
  } catch (err) {
    next(err);
  }
};
