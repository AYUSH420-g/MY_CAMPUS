import LostFoundItem from '../models/LostFoundItem.js';
import { findMatchesForItem, extractKeywords } from '../services/matcherService.js';

// @desc    Get all lost and found items with filters & search
// @route   GET /api/lost-found
// @access  Public
export const getLostFoundItems = async (req, res, next) => {
  try {
    const {
      type,
      category,
      status = 'open',
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (type && type !== 'all') {
      query.type = type;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      LostFoundItem.find(query)
        .populate('reporter', 'name email phone avatar campus')
        .populate('matchedWith', 'title type location dateOccurred')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      LostFoundItem.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      items,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single lost/found item by ID
// @route   GET /api/lost-found/:id
// @access  Public
export const getLostFoundItemById = async (req, res, next) => {
  try {
    const item = await LostFoundItem.findById(req.params.id)
      .populate('reporter', 'name email phone avatar campus')
      .populate('matchedWith', 'title type category location dateOccurred images reporter');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Lost & Found item not found.',
      });
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Report a new lost or found item
// @route   POST /api/lost-found
// @access  Private
export const createLostFoundItem = async (req, res, next) => {
  try {
    const {
      type,
      title,
      description,
      category,
      location,
      dateOccurred,
      identifyingMarks,
      tags,
      images,
      contactInfo,
    } = req.body;

    if (!type || !title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type (lost/found), title, description, category, and location.',
      });
    }

    // Auto-extract tags if not explicitly provided
    let processedTags = tags;
    if (!processedTags || processedTags.length === 0) {
      const extracted = extractKeywords(`${title} ${description}`);
      processedTags = Array.from(extracted).slice(0, 6);
    }

    const item = await LostFoundItem.create({
      type,
      title,
      description,
      category,
      location,
      campus: req.user.campus || 'Northwood University',
      dateOccurred: dateOccurred || Date.now(),
      identifyingMarks: identifyingMarks || '',
      tags: processedTags,
      images: images && images.length > 0 ? images : [
        type === 'lost'
          ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80'
      ],
      contactInfo: {
        name: contactInfo?.name || req.user.name,
        email: contactInfo?.email || req.user.email,
        phone: contactInfo?.phone || req.user.phone || '',
        notes: contactInfo?.notes || '',
      },
      reporter: req.user._id,
    });

    const populated = await LostFoundItem.findById(item._id).populate(
      'reporter',
      'name email phone avatar campus'
    );

    // Run auto-matcher immediately to check if any counterpart matches exist right now
    const initialMatches = await findMatchesForItem(item._id, 30, 3);

    res.status(201).json({
      success: true,
      message: `${type === 'lost' ? 'Lost item reported' : 'Found item logged'} successfully!`,
      item: populated,
      potentialMatchesCount: initialMatches.totalMatchesFound,
      topMatches: initialMatches.matches,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get smart auto-matches for a specific lost/found item
// @route   GET /api/lost-found/:id/matches
// @access  Public
export const getMatchesForItem = async (req, res, next) => {
  try {
    const minScore = req.query.minScore ? Number(req.query.minScore) : 25;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const results = await findMatchesForItem(req.params.id, minScore, limit);

    res.status(200).json({
      success: true,
      targetItem: results.targetItem,
      totalMatches: results.totalMatchesFound,
      matches: results.matches,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Claim or confirm match between lost and found items
// @route   PUT /api/lost-found/:id/resolve
// @access  Private
export const resolveMatch = async (req, res, next) => {
  try {
    const { matchedWithId, notes } = req.body;
    const item = await LostFoundItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    // Must be reporter or admin
    if (item.reporter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the reporter can mark this item as resolved.',
      });
    }

    item.status = 'resolved';
    item.resolvedAt = new Date();

    if (matchedWithId) {
      item.matchedWith = matchedWithId;
      // Also update counterpart item
      await LostFoundItem.findByIdAndUpdate(matchedWithId, {
        status: 'resolved',
        matchedWith: item._id,
        resolvedAt: new Date(),
      });
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Item marked as resolved successfully!',
      item,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's lost & found reports
// @route   GET /api/lost-found/my/reports
// @access  Private
export const getMyReports = async (req, res, next) => {
  try {
    const reports = await LostFoundItem.find({ reporter: req.user._id })
      .populate('matchedWith', 'title type location dateOccurred')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (err) {
    next(err);
  }
};
