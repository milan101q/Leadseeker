// Data used to simulate realistic results without an API key

export const BUSINESS_TYPES = [
  "Plumbing", "Bakery", "Auto Repair", "Dentist", "Florist", 
  "Consulting", "Law Firm", "Real Estate", "HVAC", "Diner",
  "Barbershop", "Dry Cleaners", "Landscaping", "Hardware Store"
];

export const BUSINESS_PREFIXES = [
  "Joe's", "City", "Downtown", "Elite", "Pro", "Family", "Star", 
  "Best", "Quick", "Local", "Main Street", "Corner", "Golden"
];

export const STREET_NAMES = [
  "Main St", "Broadway", "Park Ave", "Oak Ln", "Maple Dr", 
  "Cedar Blvd", "Washington St", "Highland Ave", "Elm St"
];

export const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Jones", "Brown", 
  "Davis", "Miller", "Wilson", "Moore", "Taylor"
];

// Helper to generate a random phone number
export const generatePhone = () => {
  const area = Math.floor(Math.random() * 800) + 200;
  const pre = Math.floor(Math.random() * 900) + 100;
  const line = Math.floor(Math.random() * 9000) + 1000;
  return `(${area}) ${pre}-${line}`;
};