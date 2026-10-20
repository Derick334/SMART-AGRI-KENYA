/**
 * SMART-AGRI KENYA - Comprehensive Agricultural Marketplace Taxonomy
 * Structured Kenyan Agricultural Products, Types, Varieties, and Breeds
 */

export type MarketplaceCategory = 'all' | 'crops' | 'livestock' | 'inputs' | 'equipment';

export interface CategoryDefinition {
  id: MarketplaceCategory;
  label: string;
  shortLabel: string;
  description: string;
  iconName: string;
  badgeColor: string;
}

export const MARKETPLACE_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'all',
    label: 'All Products',
    shortLabel: 'All',
    description: 'Browse all agricultural produce, livestock, certified seeds and machinery across Kenya',
    iconName: 'LayoutGrid',
    badgeColor: 'bg-stone-800 text-white',
  },
  {
    id: 'crops',
    label: 'Crops & Fresh Produce',
    shortLabel: 'Crops',
    description: 'Farm-fresh cereals, pulses, vegetables, tubers, and fruits direct from Kenyan growers',
    iconName: 'Sprout',
    badgeColor: 'bg-emerald-700 text-white',
  },
  {
    id: 'livestock',
    label: 'Livestock & Cattle',
    shortLabel: 'Livestock',
    description: 'Dairy cows, beef cattle, goats, sheep, improved kienyeji poultry, and breeding stock',
    iconName: 'Beef',
    badgeColor: 'bg-amber-700 text-white',
  },
  {
    id: 'inputs',
    label: 'Certified Seeds & Fertilizers',
    shortLabel: 'Seeds & Fertilizers',
    description: 'KEPHIS certified seeds, organic and mineral fertilizers, soil amendments, and agrochemicals',
    iconName: 'Sparkles',
    badgeColor: 'bg-teal-700 text-white',
  },
  {
    id: 'equipment',
    label: 'Farm Equipment & Irrigation',
    shortLabel: 'Equipment & Irrigation',
    description: 'Solar water pumps, drip kits, chaff cutters, sprayers, walking tractors and tools',
    iconName: 'Wrench',
    badgeColor: 'bg-blue-700 text-white',
  },
];

export const CATEGORY_PRODUCT_TYPES: Record<Exclude<MarketplaceCategory, 'all'>, string[]> = {
  crops: [
    'Maize',
    'Beans',
    'Potatoes',
    'Tomatoes',
    'Rice',
    'Fruits',
    'Vegetables & Greens',
    'Other crops',
  ],
  livestock: [
    'Dairy cattle',
    'Beef cattle',
    'Goats',
    'Sheep',
    'Poultry & Chickens',
    'Pigs',
    'Fish & Aquaculture',
    'Bees & Apiculture',
  ],
  inputs: [
    'Certified seeds',
    'Inorganic fertilizers',
    'Organic fertilizers',
    'Crop protection & Agrochemicals',
    'Animal feeds & Supplements',
  ],
  equipment: [
    'Irrigation systems',
    'Water pumps',
    'Sprayers & Spraying equipment',
    'Harvest & Processing machinery',
    'Tillage & Walking tractors',
  ],
};

export const VARIETIES_BY_PRODUCT_TYPE: Record<string, string[]> = {
  // Crops
  'Maize': [
    'H614',
    'H6213',
    'H628',
    'SC Duma 43',
    'Pannar 67',
    'Katumani Composite (Dryland)',
    'Yellow Maize (Animal Feed Grade)',
  ],
  'Beans': [
    'Rosecoco (GLP 2)',
    'Wairimu (Red Haricot)',
    'Yellow Beans (Nyayo)',
    'Mwitemania',
    'Chelalang',
    'Green Grams (Ndengu KS20)',
    'Cowpeas (Kundee)',
  ],
  'Potatoes': [
    'Shangi',
    'Dutch Robjin',
    'Unica',
    'Markies',
    'Sherekea',
    'Destiny',
  ],
  'Tomatoes': [
    'Anna F1',
    'Kilele F1',
    'Rambo F1',
    'Rio Grande',
    'Prostar F1',
    'Zara F1',
  ],
  'Rice': [
    'Pishori / Basmati 370',
    'Sindano',
    'Nerica 4',
    'BW 196',
    'Komboka',
  ],
  'Fruits': [
    'Hass Avocado',
    'Fuerte Avocado',
    'Apple Mango',
    'Ngowe Mango',
    'Cavendish Banana',
    'Tissue Culture Banana',
    'Macadamia (Murang\'a)',
    'Passion Fruit (Purple Grafted)',
    'Watermelon (Sukari F1)',
  ],
  'Vegetables & Greens': [
    'Sukuma Wiki (Collard Greens)',
    'Managu (African Nightshade)',
    'Terere (Amaranth)',
    'Cabbage (Gloria F1)',
    'Spinach (Fordhook Giant)',
    'Red Onions (Red Bombay)',
    'Carrots (Nantes)',
  ],
  'Other crops': [
    'Boma Rhodes Hay',
    'Brachiaria Hay',
    'Lucerne (Alfalfa)',
    'Maize Silage',
    'Sorghum (Seredo)',
    'Finger Millet',
  ],

  // Livestock
  'Dairy cattle': [
    'Friesian (High Yield Pedigree)',
    'Ayrshire (High Butterfat)',
    'Jersey',
    'Guernsey',
    'Fleckvieh',
  ],
  'Beef cattle': [
    'Boran (Pedigree Beef)',
    'Sahiwal Dual-Purpose',
    'East African Zebu',
    'Charolais Cross',
  ],
  'Goats': [
    'Galla (White Boran Goat)',
    'Toggenburg Dairy Goat',
    'Boer Meat Goat',
    'Saanen Dairy Goat',
    'East African Dwarf',
  ],
  'Sheep': [
    'Dorper Meat Sheep',
    'Red Maasai (Parasite Resistant)',
    'Blackhead Persian',
    'Merino Wool Sheep',
  ],
  'Poultry & Chickens': [
    'Improved Kienyeji (KALRO)',
    'Kenbro Dual-Purpose',
    'Kuroiler High-Yield',
    'Rainbow Rooster',
    'ISA Brown (Commercial Layers)',
    'Cobb 500 (Fast Broilers)',
  ],
  'Pigs': [
    'Large White',
    'Landrace',
    'Duroc (High Muscle)',
    'Camborough F1 Hybrid',
  ],
  'Fish & Aquaculture': [
    'Nile Tilapia (Fingerlings & Table-size)',
    'African Catfish (Clarias)',
  ],
  'Bees & Apiculture': [
    'Colonized Langstroth Hive',
    'Kenya Top Bar Hive (KTB)',
  ],

  // Inputs
  'Certified seeds': [
    'Kenya Seed H614D (Maize)',
    'Seed Co Duma 43 (Maize)',
    'Simlaw Anna F1 (Tomato)',
    'KALRO Certified Rosecoco Beans',
    'Certified Shangi Seed Tubers',
  ],
  'Inorganic fertilizers': [
    'DAP (18:46:0 Planting)',
    'CAN (26% N Topdressing)',
    'NPK 17:17:17 Balanced',
    'Urea (46% High Nitrogen)',
    'YaraMila Power (Fast Acting)',
    'Mavuno Planting Fertilizer',
  ],
  'Organic fertilizers': [
    'Fortified Earthworm Vermicompost',
    'Mature Bovine Manure (Cured)',
    'Bio-Organic Seaweed Foliar',
    'Neem Kernel Organic Cake',
  ],
  'Crop protection & Agrochemicals': [
    'Emamectin Benzoate (Armyworm)',
    'Chlorantraniliprole (Coragen)',
    'Mancozeb 80% WP (Fungicide)',
    'Broad Spectrum Glyphosate Herbicide',
  ],
  'Animal feeds & Supplements': [
    '16% Dairy Meal Concentrate',
    'Chick Starter Crumbs',
    'Growers Mash 18%',
    'Layers Complete Mash',
    'Mineral Lick Blocks (Macro/Micro)',
  ],

  // Equipment
  'Irrigation systems': [
    'Drip Kit (1/8 Acre Gravity Fed)',
    'Drip Kit (1/4 Acre Button Emitter)',
    'Drip Kit (1/2 Acre Commercial)',
    'Overhead Rain Gun (1.5" Brass)',
    'Micro-Sprinkler Overhead Kit',
  ],
  'Water pumps': [
    'Submersible Solar Pump (DC 48V)',
    'Surface Solar Water Pump',
    '3-Inch Petrol High Pressure Pump',
    '2-Inch Diesel Booster Pump',
  ],
  'Sprayers & Spraying equipment': [
    'Knapsack Sprayer (16L Manual)',
    'Battery Electric Knapsack (20L Rechargeable)',
    'Motorized 2-Stroke Backpack Mistblower',
  ],
  'Harvest & Processing machinery': [
    'Motorized Chaff Cutter (3-Blade 3HP)',
    'Single Bucket Electric Milking Machine',
    'Double Bucket Cow Milking Machine',
    'Grain Thresher (Maize & Beans)',
  ],
  'Tillage & Walking tractors': [
    'Walking Hand Tractor / Power Tiller (10HP Diesel)',
    'Walk-Behind Rotary Weeder',
  ],
};
