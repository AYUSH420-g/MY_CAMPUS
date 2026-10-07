import mongoose from 'mongoose';

const lostFoundItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please specify whether this item is "lost" or "found"'],
      enum: ['lost', 'found'],
    },
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description of the item'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Electronics & Gadgets',
        'Calculators',
        'Books & Notebooks',
        'ID Cards & Wallets',
        'Keys & Keychains',
        'Bottles & Containers',
        'Clothing & Accessories',
        'Bags & Backpacks',
        'Sports Equipment',
        'Other',
      ],
      default: 'Electronics & Gadgets',
    },
    location: {
      type: String,
      required: [true, 'Please specify the building, room, or campus area'],
      trim: true,
    },
    campus: {
      type: String,
      default: 'Northwood University',
      trim: true,
    },
    dateOccurred: {
      type: Date,
      default: Date.now,
    },
    identifyingMarks: {
      type: String,
      default: '',
      trim: true,
      description: 'Unique stickers, scratches, initials, case color, lock screen, etc.',
    },
    tags: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    contactInfo: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      notes: { type: String, default: '' },
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'matched', 'resolved'],
      default: 'open',
    },
    matchedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LostFoundItem',
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

lostFoundItemSchema.index({ type: 1, status: 1, category: 1 });
lostFoundItemSchema.index({ title: 'text', description: 'text', location: 'text' });

export default mongoose.model('LostFoundItem', lostFoundItemSchema);
