import { BusinessLead, SearchParams } from '../types';
import { BUSINESS_PREFIXES, BUSINESS_TYPES, STREET_NAMES, generatePhone } from '../constants';

// A deterministic random number generator to make results consistent for the same "seed"
// but varied enough for the demo.
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const generateMockBusiness = (index: number, location: string): BusinessLead => {
  const seed = location.length + index + Date.now();
  const rand = () => seededRandom(seed + Math.random());
  
  const type = BUSINESS_TYPES[Math.floor(rand() * BUSINESS_TYPES.length)];
  const prefix = BUSINESS_PREFIXES[Math.floor(rand() * BUSINESS_PREFIXES.length)];
  const street = STREET_NAMES[Math.floor(rand() * STREET_NAMES.length)];
  const num = Math.floor(rand() * 9000) + 100;
  
  // Weighted generation for realistic simulation
  // 60% chance of having a website (so 40% are potential leads if we filter for no website)
  const hasWebsite = rand() > 0.4;
  
  // Rating distribution: weighted towards 3.5 - 4.8
  let rating = 3.0 + (rand() * 2.0); 
  // Occasional low outlier
  if (rand() > 0.9) rating = 1.5 + (rand() * 2.0);
  
  const name = `${prefix} ${type}`;
  const sanitizedName = name.replace(/[^a-zA-Z]/g, "").toLowerCase();

  return {
    id: `biz-${index}-${Date.now()}`,
    name: name,
    type: type,
    rating: parseFloat(rating.toFixed(1)),
    reviews: Math.floor(rand() * 150) + 1,
    phone: generatePhone(),
    address: `${num} ${street}, ${location}`,
    postalCode: `${Math.floor(rand() * 90000) + 10000}`,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${location}`)}`,
    hasWebsite: hasWebsite,
    website: hasWebsite ? `https://www.${sanitizedName}.com` : undefined
  };
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));