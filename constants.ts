
export const HEALTH_CONDITIONS = [
  'Diabetes (Type 1/2)',
  'Hypertension',
  'Hypothyroidism',
  'Hyperthyroidism',
  'PCOS / Hormonal Imbalance',
  'IBS / Crohn\'s',
  'High Uric Acid (Gout)',
  'Celiac Disease',
  'Anemia',
  'Kidney Health Issues'
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary (Office job)' },
  { id: 'moderate', label: 'Moderate (3-4 days/week)' },
  { id: 'active', label: 'Highly Active (Daily sport)' }
];

export const CUISINES = [
  'Indian',
  'Italian',
  'Mexican',
  'Mediterranean',
  'Japanese',
  'Continental'
];

export const GOALS = [
  { id: 'stay healthy', label: 'General Wellness' },
  { id: 'weight loss', label: 'Weight Management' },
  { id: 'muscle gain', label: 'Strength & Hypertrophy' },
  { id: 'sugar control', label: 'Metabolic Health' },
  { id: 'gut health', label: 'Digestive Optimization' },
  { id: 'longevity', label: 'Long-term Vitality' }
];

export const SYSTEM_PROMPT = `
You are the "Smart Bite Pro" AI, a clinical-grade nutritional assistant. 
Your analysis must be scientifically rigorous yet easy for a user to understand.

CONTEXTUAL LOGIC:
1. MEDICAL TRIAGE: Review conditions and medications. If a food interacts poorly with a medication (e.g., high Vitamin K with blood thinners), mark as HARMFUL.
2. NUTRITIONAL SCORING: Provide a Health Score (1-10) based on the user's Height, Weight, and Activity Level.
3. SMARTER ALTERNATIVES: Suggest 3 specific food swaps that:
   - Alleviate their specific conditions.
   - Respect their dietary preference (Veg/Non-veg).
   - Match their goal (e.g., low-glycemic for Sugar Control).

TONE: Professional, empathetic, and evidence-based.
`;
