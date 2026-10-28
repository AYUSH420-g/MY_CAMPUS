import User from '../models/User.js';
import MarketplaceItem from '../models/MarketplaceItem.js';
import LostFoundItem from '../models/LostFoundItem.js';

export const seedDatabase = async () => {
  // Check if users already exist
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    console.log('[Seed] Database already contains records. Skipping seed.');
    return;
  }

  console.log('[Seed] Seeding sample campus data...');

  // 1. Create Demo Users
  const user1 = await User.create({
    name: 'Alex Rivera',
    email: 'alex@campus.edu',
    password: 'password123',
    campus: 'Northwood University',
    studentId: 'NW-2024-819',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  });

  const user2 = await User.create({
    name: 'Maya Chen',
    email: 'maya@campus.edu',
    password: 'password123',
    campus: 'Northwood University',
    studentId: 'NW-2025-104',
    phone: '+1 (555) 876-5432',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
  });

  const user3 = await User.create({
    name: 'Jordan Taylor',
    email: 'jordan@campus.edu',
    password: 'password123',
    campus: 'Northwood University',
    studentId: 'NW-2023-442',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
  });

  // 2. Create Marketplace Items (Rentals and Purchases)
  await MarketplaceItem.create([
    {
      title: 'Stewart Calculus: Early Transcendentals (8th Ed)',
      description: 'Clean textbook in great condition. No highlighting or marks inside. Essential for MATH 101/102. Pick up near Campus Library or Student Union.',
      category: 'Books',
      listingType: 'buy',
      price: 450,
      rentalPeriod: 'flat purchase',
      condition: 'Like New',
      location: 'Science Library / Quad',
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      ],
      contactInfo: {
        email: 'alex@campus.edu',
        phone: '+91 98765 43210',
        preferredMethod: 'Campus Meetup',
      },
      seller: user1._id,
      status: 'active',
      views: 42,
    },
    {
      title: 'TI-84 Plus Silver Edition Graphing Calculator',
      description: 'Rent for the whole semester! Brand new Duracell AAA batteries installed, screen is flawless. Perfect for Statistics or Engineering classes.',
      category: 'Calculators & Tech',
      listingType: 'rent',
      price: 250,
      rentalPeriod: 'per semester',
      deposit: 500,
      condition: 'Gently Used',
      location: 'Engineering Building West',
      images: [
        'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80',
      ],
      contactInfo: {
        email: 'maya@campus.edu',
        phone: '+91 98123 45678',
        preferredMethod: 'WhatsApp',
      },
      seller: user2._id,
      status: 'active',
      views: 78,
    },
    {
      title: 'Compact Dorm Mini Fridge & Freezer (3.2 cu. ft.)',
      description: 'Super quiet and energy efficient fridge. Perfect for dorm rooms. Available for semester rental or rent-to-own. Can help carry down the elevator in Dorm Hall B.',
      category: 'Dorm & Room Gear',
      listingType: 'rent',
      price: 600,
      rentalPeriod: 'per semester',
      deposit: 1000,
      condition: 'Like New',
      location: 'Birch Residence Hall B',
      images: [
        'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
      ],
      contactInfo: {
        email: 'jordan@campus.edu',
        phone: '+91 98234 56789',
        preferredMethod: 'Campus Meetup',
      },
      seller: user3._id,
      status: 'active',
      views: 115,
    },
    {
      title: 'Organic Chemistry Molecular Model Kit & Lab Goggles',
      description: 'Complete Prentice Hall molecular model kit with 240 pieces and ANSI certified anti-fog splash goggles. Saves you over ₹1,500 compared to the campus bookstore!',
      category: 'Lab & Stationery',
      listingType: 'buy',
      price: 350,
      rentalPeriod: 'flat purchase',
      condition: 'Brand New',
      location: 'Chemistry Lab North',
      images: [
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      ],
      contactInfo: {
        email: 'alex@campus.edu',
        phone: '+91 98765 43210',
        preferredMethod: 'Campus Meetup',
      },
      seller: user1._id,
      status: 'active',
      views: 31,
    },
    {
      title: 'Ergonomic Mesh Desk Chair for Dorm Study',
      description: 'Lumbar support, adjustable height, smooth caster wheels. Barely used one semester. Rent for current semester or purchase outright.',
      category: 'Dorm & Room Gear',
      listingType: 'rent',
      price: 300,
      rentalPeriod: 'per semester',
      deposit: 400,
      condition: 'Gently Used',
      location: 'Oak Residence Quad',
      images: [
        'https://images.unsplash.com/photo-1580481077195-c22ae2534782?auto=format&fit=crop&w=800&q=80',
      ],
      contactInfo: {
        email: 'maya@campus.edu',
        phone: '+91 98123 45678',
        preferredMethod: 'Campus Meetup',
      },
      seller: user2._id,
      status: 'active',
      views: 54,
    },
    {
      title: 'Anker 65W Fast Charger & 2x USB-C Braided Cables',
      description: 'Powers both laptop and phone simultaneously. Compact GaN charger. Selling because I bought a multi-port desktop dock.',
      category: 'Electronics',
      listingType: 'buy',
      price: 499,
      rentalPeriod: 'flat purchase',
      condition: 'Like New',
      location: 'Student Union Cafeteria',
      images: [
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      ],
      contactInfo: {
        email: 'jordan@campus.edu',
        phone: '+1 (555) 345-6789',
        preferredMethod: 'Campus Meetup',
      },
      seller: user3._id,
      status: 'active',
      views: 63,
    },
  ]);

  // 3. Create Lost & Found Items with HIGH matching confidence pairs!
  await LostFoundItem.create([
    // Pair 1: Texas Instruments Calculator in Library
    {
      type: 'lost',
      title: 'Texas Instruments TI-84 Plus CE Calculator',
      description: 'Lost my black TI-84 Plus CE graphing calculator. It has a blue NASA sticker on the sliding cover and my initials etched faintly on the bottom edge.',
      category: 'Calculators',
      location: 'Main Campus Library 2nd Floor Silent Study Area',
      campus: 'Northwood University',
      dateOccurred: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      identifyingMarks: 'Blue NASA sticker on sliding back cover, small scratch near battery cover',
      tags: ['calculator', 'ti-84', 'texas', 'graphing', 'library', 'nasa', 'black'],
      images: [
        'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80',
      ],
      contactInfo: {
        name: 'Alex Rivera',
        email: 'alex@campus.edu',
        phone: '+1 (555) 234-5678',
        notes: 'Needs it urgently for midterm test on Thursday!',
      },
      reporter: user1._id,
      status: 'open',
    },
    {
      type: 'found',
      title: 'Found Black TI-84 Graphing Calculator with Blue Sticker',
      description: 'Found a black Texas Instruments TI-84 graphing calculator left behind on a wooden desk near the printer station in the library.',
      category: 'Calculators',
      location: 'Main Campus Library 2nd Floor near Printer Station',
      campus: 'Northwood University',
      dateOccurred: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      identifyingMarks: 'Sliding cover has blue sticker, good condition',
      tags: ['ti-84', 'calculator', 'texas', 'library', 'blue sticker', 'printer'],
      images: [
        'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80',
      ],
      contactInfo: {
        name: 'Jordan Taylor',
        email: 'jordan@campus.edu',
        phone: '+1 (555) 345-6789',
        notes: 'Handed over to the front desk librarian, or message me directly.',
      },
      reporter: user3._id,
      status: 'open',
    },

    // Pair 2: Hydro Flask Water Bottle in Science Complex
    {
      type: 'lost',
      title: 'Navy Blue 32oz Hydro Flask with Outdoor Stickers',
      description: 'Left my navy blue 32oz Hydro Flask water bottle with wide straw lid after Physics lab. Has Yosemite and yellow smile stickers on the side.',
      category: 'Bottles & Containers',
      location: 'Science Building Room 204 Physics Lab',
      campus: 'Northwood University',
      dateOccurred: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      identifyingMarks: 'Navy blue matte finish, Yosemite national park sticker, slight dent on bottom rim',
      tags: ['hydro', 'flask', 'bottle', 'navy', 'blue', 'stickers', 'physics'],
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      ],
      contactInfo: {
        name: 'Maya Chen',
        email: 'maya@campus.edu',
        phone: '+1 (555) 876-5432',
      },
      reporter: user2._id,
      status: 'open',
    },
    {
      type: 'found',
      title: 'Found Navy Blue Hydro Flask Water Bottle',
      description: 'Found a 32oz navy blue Hydro Flask with multiple travel/park stickers on the bench outside the physics lab hallway.',
      category: 'Bottles & Containers',
      location: 'Science Building 2nd Floor Hallway Bench',
      campus: 'Northwood University',
      dateOccurred: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      identifyingMarks: 'Yosemite park sticker, straw cap',
      tags: ['hydro', 'flask', 'bottle', 'navy', 'blue', 'science', 'hallway'],
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      ],
      contactInfo: {
        name: 'Jordan Taylor',
        email: 'jordan@campus.edu',
        phone: '+1 (555) 345-6789',
      },
      reporter: user3._id,
      status: 'open',
    },

    // Pair 3: AirPods Pro in Cafeteria
    {
      type: 'lost',
      title: 'Apple AirPods Pro (2nd Generation) in White Charging Case',
      description: 'Lost my AirPods Pro white case during lunchtime. May have slipped out of jacket pocket while sitting at the booth.',
      category: 'Electronics & Gadgets',
      location: 'Student Union Cafeteria Booths',
      campus: 'Northwood University',
      dateOccurred: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      identifyingMarks: 'Initials "M.C." engraved inside case lid',
      tags: ['apple', 'airpods', 'pro', 'white', 'cafeteria', 'earbuds'],
      images: [
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
      ],
      contactInfo: {
        name: 'Maya Chen',
        email: 'maya@campus.edu',
        phone: '+1 (555) 876-5432',
      },
      reporter: user2._id,
      status: 'open',
    },
    {
      type: 'found',
      title: 'Found Apple Earbuds Case in Student Union',
      description: 'Found a white AirPods case tucked under cushion in the cafeteria seating area.',
      category: 'Electronics & Gadgets',
      location: 'Student Union Dining Hall Corner Booth',
      campus: 'Northwood University',
      dateOccurred: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      identifyingMarks: 'White case with engraving inside',
      tags: ['apple', 'airpods', 'case', 'cafeteria', 'dining'],
      images: [
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
      ],
      contactInfo: {
        name: 'Alex Rivera',
        email: 'alex@campus.edu',
        phone: '+1 (555) 234-5678',
      },
      reporter: user1._id,
      status: 'open',
    },
  ]);

  console.log('[Seed] Database successfully seeded with 3 users, 6 marketplace items, and 6 lost & found items (3 auto-matchable pairs)!');
};
