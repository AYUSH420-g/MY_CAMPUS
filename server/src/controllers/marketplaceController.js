import MarketplaceItem from '../models/MarketplaceItem.js';

// @desc    Get all marketplace items with filters & search
// @route   GET /api/marketplace
// @access  Public
export const getMarketplaceItems = async (req, res, next) => {
  try {
    const {
      search,
      category,
      listingType,
      condition,
      minPrice,
      maxPrice,
      status = 'active',
      sortBy = 'newest',
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (listingType && listingType !== 'all') {
      query.listingType = listingType;
    }

    if (condition && condition !== 'all') {
      query.condition = condition;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'price-asc') sort = { price: 1 };
    if (sortBy === 'price-desc') sort = { price: -1 };
    if (sortBy === 'popular') sort = { views: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      MarketplaceItem.find(query)
        .populate('seller', 'name email phone avatar campus')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      MarketplaceItem.countDocuments(query),
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

// @desc    Get single marketplace item by ID
// @route   GET /api/marketplace/:id
// @access  Public
export const getMarketplaceItemById = async (req, res, next) => {
  try {
    const item = await MarketplaceItem.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('seller', 'name email phone avatar campus createdAt');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Marketplace item not found.',
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

// @desc    Create a new marketplace listing
// @route   POST /api/marketplace
// @access  Private
export const createMarketplaceItem = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      listingType,
      price,
      rentalPeriod,
      deposit,
      condition,
      location,
      images,
      contactInfo,
    } = req.body;

    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, and price.',
      });
    }

    const item = await MarketplaceItem.create({
      title,
      description,
      category,
      listingType: listingType || 'buy',
      price,
      rentalPeriod: rentalPeriod || (listingType === 'rent' ? 'per semester' : 'flat purchase'),
      deposit: deposit || 0,
      condition: condition || 'Gently Used',
      location: location || 'Student Union / Quad',
      campus: req.user.campus || 'Northwood University',
      images: images && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
      ],
      contactInfo: {
        email: contactInfo?.email || req.user.email,
        phone: contactInfo?.phone || req.user.phone || '',
        preferredMethod: contactInfo?.preferredMethod || 'Campus Meetup',
      },
      seller: req.user._id,
    });

    const populated = await MarketplaceItem.findById(item._id).populate(
      'seller',
      'name email phone avatar campus'
    );

    res.status(201).json({
      success: true,
      message: 'Listing created successfully!',
      item: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a marketplace listing
// @route   PUT /api/marketplace/:id
// @access  Private
export const updateMarketplaceItem = async (req, res, next) => {
  try {
    let item = await MarketplaceItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    // Verify ownership
    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing.',
      });
    }

    item = await MarketplaceItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('seller', 'name email phone avatar campus');

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully.',
      item,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a marketplace listing
// @route   DELETE /api/marketplace/:id
// @access  Private
export const deleteMarketplaceItem = async (req, res, next) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    if (item.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing.',
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's own marketplace listings
// @route   GET /api/marketplace/my/listings
// @access  Private
export const getMyMarketplaceItems = async (req, res, next) => {
  try {
    const items = await MarketplaceItem.find({ seller: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (err) {
    next(err);
  }
};
