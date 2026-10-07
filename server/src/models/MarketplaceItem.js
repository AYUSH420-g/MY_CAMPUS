import mongoose from 'mongoose';

const marketplaceItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Books',
        'Calculators & Tech',
        'Lab & Stationery',
        'Dorm & Room Gear',
        'Electronics',
        'Sports & Fitness',
        'Other',
      ],
      default: 'Books',
    },
    listingType: {
      type: String,
      required: [true, 'Please specify listing type (rent or buy)'],
      enum: ['rent', 'buy'],
      default: 'buy',
    },
    price: {
      type: Number,
      required: [true, 'Please enter a price'],
      min: [0, 'Price must be positive'],
    },
    rentalPeriod: {
      type: String,
      enum: ['per day', 'per week', 'per month', 'per semester', 'flat purchase'],
      default: 'flat purchase',
    },
    deposit: {
      type: Number,
      default: 0,
      min: 0,
    },
    condition: {
      type: String,
      enum: ['Brand New', 'Like New', 'Gently Used', 'Acceptable'],
      default: 'Gently Used',
    },
    location: {
      type: String,
      required: [true, 'Please specify meetup location on campus'],
      trim: true,
      default: 'Student Center / North Quad',
    },
    campus: {
      type: String,
      default: 'Northwood University',
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    contactInfo: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      preferredMethod: {
        type: String,
        enum: ['Campus Meetup', 'WhatsApp', 'Email', 'Call'],
        default: 'Campus Meetup',
      },
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'rented', 'sold', 'reserved'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Search indexes
marketplaceItemSchema.index({ title: 'text', description: 'text', category: 'text' });
marketplaceItemSchema.index({ category: 1, listingType: 1, status: 1 });

export default mongoose.model('MarketplaceItem', marketplaceItemSchema);
