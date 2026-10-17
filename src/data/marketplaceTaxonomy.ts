import { Product, ProductCategory, MarketplaceCategoryFilter } from '../types';

export interface CategoryDefinition {
  id: MarketplaceCategoryFilter;
  label: string;
  icon: string;
  description: string;
}

export const MARKETPLACE_MAIN_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'all',
    label: 'All Products',
    icon: 'Store',
    description: 'All verified produce, livestock, certified inputs and machinery',
  },
  {
    id: 'crops',
    label: 'Crops & Produce',
    icon: 'Sprout',
    description: 'Cereals, legumes, fruits, vegetables, root and tuber crops',
  },
  {
    id: 'livestock',
    label: 'Livestock & Cattle',
    icon: 'Beef',
    description: 'Dairy cattle, beef bulls, poultry, goats, sheep, and pigs',
  },
  {
    id: 'inputs',
    label: 'Certified Seeds & Fertilizers',
    icon: 'Package',
    description: 'Certified seeds, DAP/CAN fertilizers, animal feeds, and soil conditioners',
  },
  {
    id: 'equipment',
    label: 'Farm Equipment & Irrigation',
    icon: 'Wrench',
    description: 'Drip irrigation kits, water pumps, sprayers, tractors, and farm machinery',
  },
];

// Product Types per Category
export const CATEGORY_PRODUCT_TYPES: Record<string, string[]> = {
  crops: [
    'Cereals',
    'Legumes',
    'Fruits',
    'Vegetables',
    'Root and tuber crops',
    'Other agricultural produce',
  ],
  livestock: [
    'Cattle',
    'Goats',
    'Sheep',
    'Poultry',
    'Pigs',
    'Rabbits',
    'Fish',
    'Other livestock',
  ],
  inputs: [
    'Certified crop seeds',
    'Vegetable seeds',
    'Pasture seeds',
    'Organic fertilizers',
    'Inorganic fertilizers',
    'Soil conditioners',
    'Other available agricultural inputs',
  ],
  equipment: [
    'Irrigation systems',
    'Water pumps',
    'Drip irrigation kits',
    'Sprayers',
    'Tractors',
    'Ploughs and farm machinery',
    'Greenhouse equipment',
    'Farm tools',
    'Other available equipment',
  ],
};

// Known Kenyan varieties, breeds, and models by category and product type
export const TAXONOMY_OPTIONS: Record<string, Record<string, string[]>> = {
  crops: {
    'Cereals': [
      'H614',
      'H6213',
      'H513',
      'DUMA 43',
      'Pishori / Basmati 370',
      'Highland White',
      'Local White Maize',
      'Sorghum E1291',
      'Finger Millet U-15',
      'Wheat (KS Mwamba)',
    ],
    'Legumes': [
      'Rosecoco',
      'Nyayo',
      'Wairimu',
      'Soya Njano',
      'Mwitemania',
      'Yellow Beans',
      'Green Grams (Ndengu)',
      'Pigeon Peas',
    ],
    'Fruits': [
      'Hass',
      'Fuerte',
      'Apple Mango',
      'Ngowe Mango',
      'Kent Mango',
      'Cavendish Banana',
      'Cooking Banana (Matoke / Ng\'ombe)',
      'Gross Michel Banana',
      'Passion Fruit',
      'Watermelon (Sukari F1)',
    ],
    'Vegetables': [
      'Anna F1',
      'Kilele F1',
      'Eden F1',
      'Red Pinoy Onion',
      'Red Creole Onion',
      'Gloria F1 Cabbage',
      'Thousand Headed Sukuma Wiki',
      'Collard Greens',
      'Spinach',
      'Traditional Greens (Managu / Kunde / Terere)',
      'French Beans (Samantha)',
    ],
    'Root and tuber crops': [
      'Shangi',
      'Tigoni',
      'Asante',
      'Unica',
      'Yellow Fleshed Sweet Potato',
      'Orange Fleshed Sweet Potato',
      'Cassava KME4',
      'Arrowroots (Nduma)',
    ],
    'Other agricultural produce': [
      'Arabica Coffee AA',
      'Purple Tea',
      'Green Tea',
      'Sugarcane',
      'Macadamia Nuts',
      'Boma Rhodes Hay',
      'Lucerne Fodder',
    ],
  },
  livestock: {
    'Cattle': [
      'Friesian',
      'Ayrshire',
      'Jersey',
      'Guernsey',
      'Sahiwal',
      'Boran',
      'Indigenous Cattle (Zebu)',
      'Crossbreed',
    ],
    'Goats': [
      'Galla',
      'Small East African',
      'Toggenburg',
      'Saanen',
      'Boer',
    ],
    'Sheep': [
      'Dorper',
      'Merino',
      'Red Maasai',
      'Blackhead Persian',
    ],
    'Poultry': [
      'Kienyeji',
      'Improved Kienyeji (KALRO)',
      'Kenbro',
      'Kuroiler',
      'Sasso',
      'Commercial Broilers',
      'Commercial Layers',
    ],
    'Pigs': [
      'Large White',
      'Landrace',
      'Pietrain',
      'Duroc',
      'Crossbreed',
    ],
    'Rabbits': [
      'California White',
      'New Zealand White',
      'Chinchilla',
      'Flemish Giant',
    ],
    'Fish': [
      'Tilapia (Oreochromis niloticus)',
      'African Catfish (Clarias gariepinus)',
    ],
    'Other livestock': [
      'African Honeybee (Apis mellifera)',
      'Dairy Camel',
      'Turkey',
      'Duck',
    ],
  },
  inputs: {
    'Certified crop seeds': [
      'H614D Highland Seed Maize',
      'H6213 Hybrid Seed Maize',
      'SC Duma 43 Seed Maize',
      'Certified Rosecoco Bean Seed',
      'Certified Wheat Seed KS Mwamba',
      'Certified Sorghum Seed Gadam',
    ],
    'Vegetable seeds': [
      'Anna F1 Tomato Seed',
      'Kilele F1 Tomato Seed',
      'Red Pinoy F1 Onion Seed',
      'Gloria F1 Cabbage Seed',
      'Collards Seed',
      'Sukari F1 Watermelon Seed',
    ],
    'Pasture seeds': [
      'Boma Rhodes Certified Seed',
      'Brachiaria Grass Seed',
      'Lucerne / Alfalfa Seed',
      'Desmodium Legume Seed',
    ],
    'Organic fertilizers': [
      'Enriched Cattle Compost',
      'Poultry Pellet Manure',
      'Vermicompost (Worm Castings)',
      'Bio-Fertilizer (Trichoderma)',
    ],
    'Inorganic fertilizers': [
      'DAP (18:46:0)',
      'CAN (26% N)',
      'NPK (17:17:17)',
      'NPK (23:23:0)',
      'Urea (46% N)',
      'Mavuno Planting Fertilizer',
      'Soluble Foliar Booster',
    ],
    'Soil conditioners': [
      'Agricultural Lime (CaCO3)',
      'Dolomitic Lime (CaMg(CO3)2)',
      'Agricultural Gypsum',
      'Humic Acid Extract',
      'Biochar Soil Enricher',
    ],
    'Other available agricultural inputs': [
      'Dairy Meal Concentrate (16% CP)',
      'Layers Mash Feed',
      'Chick Starter Crumbles',
      'Cattle Mineral Lick Block',
      'Calf Early Weaner Pellets',
    ],
  },
  equipment: {
    'Irrigation systems': [
      'Overhead Rain-Gun 1.5"',
      'Micro-Sprinkler Kit',
      'Center Pivot Lateral',
      'Mist Emitter Propagation Kit',
    ],
    'Water pumps': [
      'Solar Submersible Borehole Pump 1.5HP',
      '3-Inch Petrol High Head Pump',
      '2-Inch Diesel Booster Pump',
      'Electric Surface Pump',
    ],
    'Drip irrigation kits': [
      'Complete 1-Acre Drip Kit',
      'Half-Acre Button Drip Kit',
      'Kitchen Garden Gravity Drip Kit',
      '16mm UV Button-Dripper Lateral',
    ],
    'Sprayers': [
      '20L 2-Stroke Motorized Knapsack',
      '16L Manual Knapsack Sprayer',
      'Tractor Boom Sprayer 400L',
      'Battery Powered Knapsack 16L',
    ],
    'Tractors': [
      '75HP 4WD Agricultural Tractor',
      '50HP Compact Farm Tractor',
      'Walking Tractor Power Tiller 12HP',
    ],
    'Ploughs and farm machinery': [
      '3-Disc Furrow Plough',
      'Disc Harrow 16-Plate',
      'Rotary Slasher',
      'Chisel Subsoiler',
      'Maize Sheller & De-husker',
    ],
    'Greenhouse equipment': [
      '8m x 15m Tunnel Greenhouse Kit',
      '200 Micron UV Treated Poly Film',
      '50 Mesh Anti-Insect Netting',
      'Galvanized Hoop Frame Set',
    ],
    'Farm tools': [
      'Heavy Forged Crocodile Jembes',
      'Forged Steel Pangas',
      'Pruning Shears & Secateurs',
      '50L Stainless Steel Milk Can',
    ],
    'Other available equipment': [
      'Digital Grain Moisture Meter',
      '500-Egg Automatic Solar Incubator',
      'Heavy Duty Chaff Cutter 3HP',
    ],
  },
};

// Cattle Production Purpose options
export const CATTLE_PURPOSES = ['Dairy', 'Beef', 'Dual-purpose'];

/**
 * Normalizes category mapping so that:
 * - crops, fodder, seedlings map to 'crops'
 * - livestock maps to 'livestock'
 * - inputs maps to 'inputs'
 * - equipment maps to 'equipment'
 */
export function getNormalizedCategory(category: ProductCategory): MarketplaceCategoryFilter {
  if (category === 'crops' || category === 'seedlings' || category === 'fodder') return 'crops';
  if (category === 'livestock') return 'livestock';
  if (category === 'inputs') return 'inputs';
  if (category === 'equipment') return 'equipment';
  return 'crops';
}

/**
 * Returns dynamic product types available from both taxonomy and actual catalog data
 */
export function getProductTypesForCategory(category: MarketplaceCategoryFilter, actualProducts: Product[]): string[] {
  if (category === 'all') {
    const typesSet = new Set<string>();
    Object.values(CATEGORY_PRODUCT_TYPES).forEach(list => list.forEach(t => typesSet.add(t)));
    actualProducts.forEach(p => {
      if (p.productType) typesSet.add(p.productType);
    });
    return Array.from(typesSet);
  }

  const baseTypes = CATEGORY_PRODUCT_TYPES[category] || [];
  const dynamicSet = new Set<string>(baseTypes);

  // Scan actual products for any seller-specified productTypes in this category
  actualProducts.forEach(p => {
    if (getNormalizedCategory(p.category) === category && p.productType) {
      dynamicSet.add(p.productType);
    }
  });

  return Array.from(dynamicSet);
}

/**
 * Returns dynamic varieties, breeds, or models for a selected category and productType.
 * Merges baseline Kenyan taxonomy with any actual variety/breed/model present in current products.
 */
export function getVarietiesForType(
  category: MarketplaceCategoryFilter,
  productType: string,
  actualProducts: Product[]
): string[] {
  const optionsSet = new Set<string>();

  // 1. Add known taxonomy options
  if (category !== 'all' && TAXONOMY_OPTIONS[category] && TAXONOMY_OPTIONS[category][productType]) {
    TAXONOMY_OPTIONS[category][productType].forEach(opt => optionsSet.add(opt));
  } else if (category === 'all') {
    // Search across all categories for this productType
    Object.keys(TAXONOMY_OPTIONS).forEach(catKey => {
      if (TAXONOMY_OPTIONS[catKey][productType]) {
        TAXONOMY_OPTIONS[catKey][productType].forEach(opt => optionsSet.add(opt));
      }
    });
  }

  // 2. Add actual varieties / breeds / models found in database/store for this category & productType
  actualProducts.forEach(p => {
    const matchesCat = category === 'all' || getNormalizedCategory(p.category) === category;
    const matchesType = !productType || p.productType === productType || (
      // For livestock animalType checks
      p.livestockDetails && (
        (productType === 'Cattle' && ['dairy_cow', 'beef_cattle', 'bull', 'heifer', 'calf'].includes(p.livestockDetails.animalType)) ||
        (productType === 'Poultry' && p.livestockDetails.animalType === 'chicken') ||
        (productType === 'Goats' && p.livestockDetails.animalType === 'goat') ||
        (productType === 'Sheep' && p.livestockDetails.animalType === 'sheep') ||
        (productType === 'Pigs' && p.livestockDetails.animalType === 'pig') ||
        (productType === 'Rabbits' && p.livestockDetails.animalType === 'rabbit') ||
        (productType === 'Fish' && p.livestockDetails.animalType === 'fish') ||
        (productType === 'Other livestock' && ['bees', 'duck', 'turkey'].includes(p.livestockDetails.animalType))
      )
    );

    if (matchesCat && matchesType) {
      if (p.variety) optionsSet.add(p.variety);
      if (p.breed) optionsSet.add(p.breed);
      if (p.livestockDetails?.breed) optionsSet.add(p.livestockDetails.breed);
      if (p.model) optionsSet.add(p.model);
    }
  });

  return Array.from(optionsSet);
}
