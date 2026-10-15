import LostFoundItem from '../models/LostFoundItem.js';

// Common stop words to exclude from keyword extraction
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'is', 'it', 'this', 'that', 'my', 'i', 'was', 'were', 'lost', 'found', 'please',
  'help', 'near', 'from', 'around', 'about', 'some', 'has', 'have', 'had', 'any'
]);

// High-value brand / distinctive campus item tokens
const BRAND_TOKENS = new Set([
  'apple', 'macbook', 'airpods', 'iphone', 'ipad', 'dell', 'hp', 'lenovo', 'asus', 'sony',
  'casio', 'texas', 'instruments', 'ti', 'ti84', 'ti-84', 'ti83', 'ti-83', 'hydro', 'flask',
  'yeti', 'stanley', 'camelbak', 'nike', 'adidas', 'north', 'face', 'jansport', 'anker'
]);

const COLOR_TOKENS = new Set([
  'black', 'white', 'blue', 'navy', 'red', 'green', 'yellow', 'silver', 'grey', 'gray',
  'gold', 'pink', 'purple', 'orange', 'brown', 'matte', 'metallic', 'rose'
]);

/**
 * Tokenize a text string into normalized, cleaned keywords
 */
export function extractKeywords(text = '') {
  if (!text) return new Set();
  const cleaned = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/);

  const tokens = new Set();
  for (const token of cleaned) {
    const trimmed = token.trim();
    if (trimmed.length > 1 && !STOP_WORDS.has(trimmed)) {
      tokens.add(trimmed);
      // Also add hyphen-stripped version if applicable (e.g. ti-84 -> ti84)
      if (trimmed.includes('-')) {
        tokens.add(trimmed.replace(/-/g, ''));
      }
    }
  }
  return tokens;
}

/**
 * Calculate match score between two lost/found items
 */
export function calculateMatchScore(targetItem, candidateItem) {
  let score = 0;
  const reasons = [];

  // 1. Category Matching (up to 35 points)
  if (targetItem.category === candidateItem.category) {
    score += 35;
    reasons.push(`Identical Category (${targetItem.category})`);
  } else if (
    (targetItem.category.includes('Electronics') && candidateItem.category.includes('Calculators')) ||
    (targetItem.category.includes('Calculators') && candidateItem.category.includes('Electronics'))
  ) {
    score += 22;
    reasons.push(`Related Category (${targetItem.category} ↔ ${candidateItem.category})`);
  } else if (
    (targetItem.category.includes('Bags') && candidateItem.category.includes('Clothing')) ||
    (targetItem.category.includes('Clothing') && candidateItem.category.includes('Bags'))
  ) {
    score += 20;
    reasons.push(`Related Category (${targetItem.category} ↔ ${candidateItem.category})`);
  }

  // 2. Text & Keyword Similarity (up to 35 points)
  const targetText = `${targetItem.title} ${targetItem.description} ${(targetItem.tags || []).join(' ')} ${targetItem.identifyingMarks || ''}`;
  const candidateText = `${candidateItem.title} ${candidateItem.description} ${(candidateItem.tags || []).join(' ')} ${candidateItem.identifyingMarks || ''}`;

  const targetTokens = extractKeywords(targetText);
  const candidateTokens = extractKeywords(candidateText);

  const intersection = new Set([...targetTokens].filter((t) => candidateTokens.has(t)));
  const matchingKeywords = Array.from(intersection);

  if (intersection.size > 0) {
    // Base keyword score based on overlap count
    const baseTextScore = Math.min(25, intersection.size * 6);
    score += baseTextScore;

    // Check for high-value brand or color matches
    const brandMatches = matchingKeywords.filter((k) => BRAND_TOKENS.has(k));
    const colorMatches = matchingKeywords.filter((k) => COLOR_TOKENS.has(k));

    if (brandMatches.length > 0) {
      score += 6;
      reasons.push(`Shared brand/model: ${brandMatches.join(', ')}`);
    }
    if (colorMatches.length > 0) {
      score += 4;
      reasons.push(`Matching color: ${colorMatches.join(', ')}`);
    }

    const previewKeywords = matchingKeywords.slice(0, 4).join(', ');
    reasons.push(`Keyword overlap: ${previewKeywords}`);
  }

  // 3. Location Matching (up to 20 points)
  const targetLocTokens = extractKeywords(targetItem.location);
  const candidateLocTokens = extractKeywords(candidateItem.location);
  const locIntersection = new Set([...targetLocTokens].filter((t) => candidateLocTokens.has(t)));

  if (locIntersection.size > 0) {
    const locScore = Math.min(20, locIntersection.size * 10);
    score += locScore;
    reasons.push(`Location proximity: ${Array.from(locIntersection).join(', ')}`);
  }

  // 4. Temporal Closeness (up to 10 points)
  if (targetItem.dateOccurred && candidateItem.dateOccurred) {
    const targetDate = new Date(targetItem.dateOccurred).getTime();
    const candidateDate = new Date(candidateItem.dateOccurred).getTime();
    const diffDays = Math.abs(targetDate - candidateDate) / (1000 * 60 * 60 * 24);

    if (diffDays <= 3) {
      score += 10;
      reasons.push(`Dates occurred within 3 days`);
    } else if (diffDays <= 7) {
      score += 7;
      reasons.push(`Dates occurred within 1 week`);
    } else if (diffDays <= 14) {
      score += 4;
      reasons.push(`Dates occurred within 2 weeks`);
    }
  }

  // Cap score at 100
  score = Math.min(100, Math.round(score));

  let confidence = 'low';
  if (score >= 70) {
    confidence = 'high';
  } else if (score >= 45) {
    confidence = 'medium';
  }

  return {
    score,
    confidence,
    reasons,
    matchingKeywords,
  };
}

/**
 * Find smart matches for a specific item
 * If item is 'lost', search 'found' items (and vice versa)
 */
export async function findMatchesForItem(itemId, minScore = 30, limit = 5) {
  const targetItem = await LostFoundItem.findById(itemId).populate('reporter', 'name email avatar campus');
  if (!targetItem) {
    throw new Error('Item not found');
  }

  // Find candidate items of opposite type with status != 'resolved'
  const counterpartType = targetItem.type === 'lost' ? 'found' : 'lost';

  const candidates = await LostFoundItem.find({
    type: counterpartType,
    status: { $in: ['open', 'matched'] },
  }).populate('reporter', 'name email phone avatar campus');

  const matches = [];

  for (const candidate of candidates) {
    const analysis = calculateMatchScore(targetItem, candidate);
    if (analysis.score >= minScore) {
      matches.push({
        item: candidate,
        score: analysis.score,
        confidence: analysis.confidence,
        reasons: analysis.reasons,
        matchingKeywords: analysis.matchingKeywords,
      });
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  return {
    targetItem,
    matches: matches.slice(0, limit),
    totalMatchesFound: matches.length,
  };
}
