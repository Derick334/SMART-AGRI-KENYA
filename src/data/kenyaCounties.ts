/**
 * SMART-AGRI KENYA - 47 Kenyan Counties & Agro-Ecological Data
 * Grounded in Ministry of Agriculture & Kenya National Highways Authority (KeNHA) road routes
 */

export interface CountyInfo {
  code: number;
  name: string;
  capital: string;
  zone: 'Highlands (High Rainfall)' | 'Rift Valley Basin' | 'Western Lake Basin' | 'Eastern Semi-Arid' | 'Coastal Belt' | 'Northern Arid';
  lat: number;
  lon: number;
  primaryCrops: string[];
  primaryLivestock: string[];
  majorMarket: string;
}

export const KENYA_COUNTIES: CountyInfo[] = [
  { code: 1, name: 'Mombasa', capital: 'Mombasa City', zone: 'Coastal Belt', lat: -4.0435, lon: 39.6682, primaryCrops: ['Cassava', 'Coconuts', 'Mangoes', 'Vegetables'], primaryLivestock: ['Poultry', 'Dairy Goats'], majorMarket: 'Kongowea Wholesale Market' },
  { code: 2, name: 'Kwale', capital: 'Kwale', zone: 'Coastal Belt', lat: -4.1737, lon: 39.4521, primaryCrops: ['Cashew nuts', 'Cassava', 'Bixa', 'Citrus'], primaryLivestock: ['Beef Cattle', 'Goats'], majorMarket: 'Kwale Town Market' },
  { code: 3, name: 'Kilifi', capital: 'Kilifi', zone: 'Coastal Belt', lat: -3.5107, lon: 39.9093, primaryCrops: ['Cassava', 'Maize', 'Watermelons', 'Pineapples'], primaryLivestock: ['Dairy Cattle', 'Goats', 'Poultry'], majorMarket: 'Mtwapa Agribusiness Hub' },
  { code: 4, name: 'Tana River', capital: 'Hola', zone: 'Coastal Belt', lat: -1.5000, lon: 40.0000, primaryCrops: ['Rice (Bura/Hola)', 'Mangoes', 'Bananas'], primaryLivestock: ['Pastoral Cattle', 'Camels', 'Goats'], majorMarket: 'Hola Livestock Market' },
  { code: 5, name: 'Lamu', capital: 'Lamu', zone: 'Coastal Belt', lat: -2.2717, lon: 40.9020, primaryCrops: ['Cotton', 'Simsim', 'Cashew nuts', 'Coconut'], primaryLivestock: ['Beef Cattle', 'Poultry'], majorMarket: 'Mpeketoni Farmers Market' },
  { code: 6, name: 'Taita-Taveta', capital: 'Mwatate', zone: 'Highlands (High Rainfall)', lat: -3.3161, lon: 38.3570, primaryCrops: ['Bananas', 'Tomatoes', 'French Beans', 'Macadamia'], primaryLivestock: ['Dairy Cattle', 'Rabbits'], majorMarket: 'Taveta Cross-Border Market' },
  { code: 7, name: 'Garissa', capital: 'Garissa', zone: 'Northern Arid', lat: -0.4532, lon: 39.6460, primaryCrops: ['Watermelon', 'Tomatoes (River Tana irrigation)'], primaryLivestock: ['Galla Goats', 'Boran Cattle', 'Camels'], majorMarket: 'Garissa International Livestock Market' },
  { code: 8, name: 'Wajir', capital: 'Wajir', zone: 'Northern Arid', lat: 1.7471, lon: 40.0573, primaryCrops: ['Sorghum', 'Watermelon'], primaryLivestock: ['Camels', 'Sheep', 'Goats'], majorMarket: 'Wajir Livestock Yard' },
  { code: 9, name: 'Mandera', capital: 'Mandera', zone: 'Northern Arid', lat: 3.9373, lon: 41.8569, primaryCrops: ['Mangoes', 'Onions (Irrigation)'], primaryLivestock: ['Camels', 'Black-head Persian Sheep'], majorMarket: 'Mandera Central Market' },
  { code: 10, name: 'Marsabit', capital: 'Marsabit', zone: 'Northern Arid', lat: 2.3370, lon: 37.9900, primaryCrops: ['Maize (Mountain micro-climate)', 'Beans'], primaryLivestock: ['Boran Cattle', 'Red Maasai Sheep', 'Camels'], majorMarket: 'Moyale Border Market' },
  { code: 11, name: 'Isiolo', capital: 'Isiolo', zone: 'Eastern Semi-Arid', lat: 0.3546, lon: 37.5822, primaryCrops: ['Onions', 'Tomatoes'], primaryLivestock: ['Camels', 'Beef Cattle', 'Goats'], majorMarket: 'Isiolo Abattoir & Livestock Yard' },
  { code: 12, name: 'Meru', capital: 'Meru', zone: 'Highlands (High Rainfall)', lat: 0.0463, lon: 37.6559, primaryCrops: ['Miraa', 'Coffee', 'Tea', 'Bananas', 'Potatoes', 'Avocados'], primaryLivestock: ['Friesian Dairy Cattle', 'Pigs'], majorMarket: 'Gakoromone Wholesale Market' },
  { code: 13, name: 'Tharaka-Nithi', capital: 'Kathwana', zone: 'Eastern Semi-Arid', lat: -0.2974, lon: 37.8690, primaryCrops: ['Green grams (Ndengu)', 'Millet', 'Sorghum', 'Bananas'], primaryLivestock: ['Indigenous Goats', 'Dairy Cattle'], majorMarket: 'Chuka Fresh Produce Market' },
  { code: 14, name: 'Embu', capital: 'Embu', zone: 'Highlands (High Rainfall)', lat: -0.5344, lon: 37.4586, primaryCrops: ['Macadamia', 'Coffee', 'Tea', 'French Beans', 'Mangoes'], primaryLivestock: ['Dairy Cows', 'Kenbro Chickens'], majorMarket: 'Embu Municipal Market' },
  { code: 15, name: 'Kitui', capital: 'Kitui', zone: 'Eastern Semi-Arid', lat: -1.3683, lon: 38.0106, primaryCrops: ['Green Grams', 'Pigeon peas', 'Cowpeas', 'Sorghum'], primaryLivestock: ['Galla Goats', 'Apiculture (Honey)'], majorMarket: 'Kalundu Market' },
  { code: 16, name: 'Machakos', capital: 'Machakos', zone: 'Eastern Semi-Arid', lat: -1.5177, lon: 37.2634, primaryCrops: ['French Beans', 'Tomatoes', 'Hass Avocados', 'Maize'], primaryLivestock: ['Dairy Cows', 'Poultry', 'Bees'], majorMarket: 'Machakos Town Wholesale Market' },
  { code: 17, name: 'Makueni', capital: 'Wote', zone: 'Eastern Semi-Arid', lat: -1.7808, lon: 37.6288, primaryCrops: ['Apple Mangoes', 'Citrus', 'Green Grams', 'Watermelons'], primaryLivestock: ['Galla Goats', 'Boran Cattle'], majorMarket: 'Wote Agribusiness Center' },
  { code: 18, name: 'Nyandarua', capital: 'Ol Kalou', zone: 'Highlands (High Rainfall)', lat: -0.2671, lon: 36.3789, primaryCrops: ['Irish Potatoes (Shangi)', 'Cabbage', 'Carrots', 'Peas'], primaryLivestock: ['High-Yield Friesian & Ayrshire Dairy'], majorMarket: 'Ol Kalou Potato Exchange' },
  { code: 19, name: 'Nyeri', capital: 'Nyeri', zone: 'Highlands (High Rainfall)', lat: -0.4201, lon: 36.9476, primaryCrops: ['Coffee (Arabica)', 'Tea', 'Macadamia', 'Horticulture'], primaryLivestock: ['Dairy Cows', 'Trout Fish', 'Pigs'], majorMarket: 'Nyeri Mudavadi Market' },
  { code: 20, name: 'Kirinyaga', capital: 'Kerugoya', zone: 'Highlands (High Rainfall)', lat: -0.4990, lon: 37.2803, primaryCrops: ['Pishori Rice (Mwea)', 'Tomatoes', 'French Beans', 'Watermelons'], primaryLivestock: ['Dairy Cattle', 'Poultry'], majorMarket: 'Wanguru Mwea Rice Market' },
  { code: 21, name: 'Murang\'a', capital: 'Murang\'a', zone: 'Highlands (High Rainfall)', lat: -0.7167, lon: 37.1500, primaryCrops: ['Hass Avocados', 'Bananas', 'Coffee', 'Tea', 'Macadamia'], primaryLivestock: ['Dairy Farming', 'Pigs'], majorMarket: 'Maragua Produce Exchange' },
  { code: 22, name: 'Kiambu', capital: 'Kiambu', zone: 'Highlands (High Rainfall)', lat: -1.1714, lon: 36.8356, primaryCrops: ['Tea', 'Coffee', 'Dairy Fodder', 'Strawberries', 'Cabbages'], primaryLivestock: ['Intensive Dairy', 'Broilers & Layers', 'Pigs'], majorMarket: 'Thika Agro-Hub Market' },
  { code: 23, name: 'Turkana', capital: 'Lodwar', zone: 'Northern Arid', lat: 3.1167, lon: 35.6000, primaryCrops: ['Sorghum (Katilu Scheme)', 'Dates', 'Fish (Lake Turkana)'], primaryLivestock: ['Pastoral Goats', 'Zebu Cattle', 'Camels'], majorMarket: 'Lodwar Central Market' },
  { code: 24, name: 'West Pokot', capital: 'Kapenguria', zone: 'Rift Valley Basin', lat: 1.2389, lon: 35.1119, primaryCrops: ['Maize', 'Beans', 'Potatoes'], primaryLivestock: ['Sahiwal Cattle', 'Dairy Goats'], majorMarket: 'Chepareria Livestock Market' },
  { code: 25, name: 'Samburu', capital: 'Maralal', zone: 'Northern Arid', lat: 1.0969, lon: 36.6980, primaryCrops: ['Barley', 'Wheat'], primaryLivestock: ['Boran Beef Cattle', 'Red Maasai Sheep'], majorMarket: 'Maralal Livestock Auction' },
  { code: 26, name: 'Trans-Nzoia', capital: 'Kitale', zone: 'Highlands (High Rainfall)', lat: 1.0157, lon: 35.0062, primaryCrops: ['Maize (Granary of Kenya)', 'Certified Seed Maize', 'Beans', 'Sunflower'], primaryLivestock: ['Pedigree Dairy Cattle', 'Poultry'], majorMarket: 'Kitale Municipal Market' },
  { code: 27, name: 'Uasin Gishu', capital: 'Eldoret City', zone: 'Highlands (High Rainfall)', lat: 0.5143, lon: 35.2698, primaryCrops: ['Wheat', 'Maize', 'Barley', 'Passion Fruit', 'Potatoes'], primaryLivestock: ['Commercial Dairy', 'Pedigree Bulls', 'Layers'], majorMarket: 'Eldoret Wholesale Market' },
  { code: 28, name: 'Elgeyo-Marakwet', capital: 'Iten', zone: 'Highlands (High Rainfall)', lat: 0.6734, lon: 35.5082, primaryCrops: ['Potatoes', 'Mangoes (Kerio Valley)', 'Pyrethrum'], primaryLivestock: ['Dairy Cattle', 'Sheep'], majorMarket: 'Iten Farmers Market' },
  { code: 29, name: 'Nandi', capital: 'Kapsabet', zone: 'Highlands (High Rainfall)', lat: 0.2033, lon: 35.1056, primaryCrops: ['Tea', 'Maize', 'Sugarcane', 'Coffee'], primaryLivestock: ['Dairy Cows', 'Dairy Goats', 'Indigenous Poultry'], majorMarket: 'Kapsabet Agricultural Market' },
  { code: 30, name: 'Baringo', capital: 'Kabarnet', zone: 'Rift Valley Basin', lat: 0.5794, lon: 35.7432, primaryCrops: ['Finger Millet', 'Sorghum', 'Watermelon (Perkerra)'], primaryLivestock: ['Baringo Acacia Honey', 'Goats', 'Beef Cattle'], majorMarket: 'Marigat Irrigation Hub' },
  { code: 31, name: 'Laikipia', capital: 'Nanyuki', zone: 'Rift Valley Basin', lat: 0.0167, lon: 37.0722, primaryCrops: ['Wheat', 'Barley', 'Snow Peas', 'Tomatoes'], primaryLivestock: ['Boran Beef Ranches', 'Dorper Sheep', 'Dairy'], majorMarket: 'Nanyuki Farmers Market' },
  { code: 32, name: 'Nakuru', capital: 'Nakuru City', zone: 'Rift Valley Basin', lat: -0.3031, lon: 36.0800, primaryCrops: ['Potatoes (Molo)', 'Pyrethrum', 'Carrots', 'Maize', 'Cut Flowers (Naivasha)'], primaryLivestock: ['Dairy Cattle', 'Pigs', 'Commercial Poultry'], majorMarket: 'Nakuru Top Market' },
  { code: 33, name: 'Narok', capital: 'Narok', zone: 'Rift Valley Basin', lat: -1.0833, lon: 35.8667, primaryCrops: ['Wheat (Largest producer)', 'Barley', 'Maize'], primaryLivestock: ['Maasai Pastoral Cattle', 'Dorper Sheep'], majorMarket: 'Narok Central Wheat Hub' },
  { code: 34, name: 'Kajiado', capital: 'Kajiado', zone: 'Rift Valley Basin', lat: -1.8500, lon: 36.7833, primaryCrops: ['Greenhouse Tomatoes (Isinya)', 'Onions', 'Hay Fodder (Boma Rhodes)'], primaryLivestock: ['Beef Cattle', 'Dairy Goats', 'Rabbits'], majorMarket: 'Kitengela Livestock & Produce Market' },
  { code: 35, name: 'Kericho', capital: 'Kericho', zone: 'Highlands (High Rainfall)', lat: -0.3689, lon: 35.2863, primaryCrops: ['Tea (Capital of Kenya Tea)', 'Pyrethrum', 'Sugarcane', 'Sweet Potatoes'], primaryLivestock: ['Dairy Cattle', 'Fish Farming'], majorMarket: 'Kericho Town Market' },
  { code: 36, name: 'Bomet', capital: 'Bomet', zone: 'Highlands (High Rainfall)', lat: -0.7813, lon: 35.3416, primaryCrops: ['Tea', 'Maize', 'Irish Potatoes', 'Avocados'], primaryLivestock: ['Dairy Cows', 'Indigenous Chickens'], majorMarket: 'Silibwet Agricultural Market' },
  { code: 37, name: 'Kakamega', capital: 'Kakamega', zone: 'Western Lake Basin', lat: 0.2827, lon: 34.7519, primaryCrops: ['Sugarcane', 'Maize', 'Beans', 'Indigenous Vegetables (Kunde, Managu)'], primaryLivestock: ['Dairy Cattle', 'Kienyeji Chicken', 'Fish Ponds'], majorMarket: 'Kakamega Central Market' },
  { code: 38, name: 'Vihiga', capital: 'Mbale', zone: 'Western Lake Basin', lat: 0.0765, lon: 34.7223, primaryCrops: ['Tea', 'Bananas', 'Traditional leafy greens', 'Maize'], primaryLivestock: ['Zero-grazing Dairy', 'Improved Poultry'], majorMarket: 'Mbale Fresh Produce Market' },
  { code: 39, name: 'Bungoma', capital: 'Bungoma', zone: 'Western Lake Basin', lat: 0.5695, lon: 34.5584, primaryCrops: ['Sugarcane (Nzoia)', 'Maize', 'Sweet Potatoes', 'Onions', 'Coffee'], primaryLivestock: ['Dairy Cattle', 'Poultry Hatcheries'], majorMarket: 'Chwele Agri-Wholesale Market' },
  { code: 40, name: 'Busia', capital: 'Busia', zone: 'Western Lake Basin', lat: 0.4608, lon: 34.1115, primaryCrops: ['Cassava', 'Groundnuts', 'Sugarcane', 'Sorghum'], primaryLivestock: ['Zebu Cattle', 'Fish (Tilapia/Omena)'], majorMarket: 'Busia Cross-Border Hub' },
  { code: 41, name: 'Siaya', capital: 'Siaya', zone: 'Western Lake Basin', lat: 0.0607, lon: 34.2882, primaryCrops: ['Maize', 'Sorghum', 'Cassava', 'Cotton', 'Tomatoes'], primaryLivestock: ['Lake Tilapia & Nile Perch', 'Indigenous Poultry', 'Goats'], majorMarket: 'Bondo Fish & Produce Market' },
  { code: 42, name: 'Kisumu', capital: 'Kisumu City', zone: 'Western Lake Basin', lat: -0.0917, lon: 34.7680, primaryCrops: ['Rice (Ahero Scheme)', 'Sugarcane', 'Sorghum', 'Vegetables'], primaryLivestock: ['Lake Fishery', 'Dairy Cattle', 'Kuroiler Chickens'], majorMarket: 'Kibuye Wholesale Market' },
  { code: 43, name: 'Homa Bay', capital: 'Homa Bay', zone: 'Western Lake Basin', lat: -0.5273, lon: 34.4571, primaryCrops: ['Cotton', 'Sunflower', 'Pineapples', 'Sweet Potatoes'], primaryLivestock: ['Cage Aquaculture', 'Zebu Beef', 'Goats'], majorMarket: 'Homa Bay Pier Market' },
  { code: 44, name: 'Migori', capital: 'Migori', zone: 'Western Lake Basin', lat: -1.0634, lon: 34.4731, primaryCrops: ['Tobacco', 'Sugarcane (Sony)', 'Sweet Potatoes', 'Maize', 'Bananas'], primaryLivestock: ['Beef Cattle', 'Dairy Goats'], majorMarket: 'Isebania Border Market' },
  { code: 45, name: 'Kisii', capital: 'Kisii', zone: 'Highlands (High Rainfall)', lat: -0.6817, lon: 34.7667, primaryCrops: ['Bananas (Ng\'ombe, Cavendish)', 'Avocados', 'Tea', 'Coffee', 'Sugarcane'], primaryLivestock: ['Dairy Cattle', 'Poultry'], majorMarket: 'Daraja Mbili Market' },
  { code: 46, name: 'Nyamira', capital: 'Nyamira', zone: 'Highlands (High Rainfall)', lat: -0.5633, lon: 34.9358, primaryCrops: ['Tea', 'Bananas', 'Pyrethrum', 'Passion Fruit'], primaryLivestock: ['Dairy Farming', 'Beekeeping'], majorMarket: 'Nyamira Town Market' },
  { code: 47, name: 'Nairobi', capital: 'Nairobi City', zone: 'Highlands (High Rainfall)', lat: -1.286389, lon: 36.817223, primaryCrops: ['Urban Horticulture', 'Hydroponics', 'Microgreens'], primaryLivestock: ['Intensive Poultry', 'Rabbits', 'Quails'], majorMarket: 'Wakulima (Marikiti) Wholesale Market' }
];

// Reference Road Distances in KM between key Kenya logistics hubs
// Based on actual paved highway routes (A104, A109, A1, A2, B3)
const HUBS_DISTANCE: Record<string, Record<string, number>> = {
  'Nairobi': {
    'Mombasa': 485,
    'Nakuru': 158,
    'Eldoret': 312,
    'Kisumu': 348,
    'Kiambu': 18,
    'Machakos': 64,
    'Murang\'a': 85,
    'Nyeri': 150,
    'Meru': 225,
    'Kitale': 380,
    'Embu': 130,
    'Nyandarua': 140,
    'Kericho': 260,
    'Kisii': 310,
    'Kakamega': 390,
    'Narok': 142,
    'Kajiado': 80,
  },
  'Eldoret': {
    'Nairobi': 312,
    'Nakuru': 156,
    'Kitale': 72,
    'Kisumu': 118,
    'Kakamega': 105,
    'Kericho': 110,
    'Mombasa': 797,
    'Bungoma': 98,
    'Kapsabet': 45,
  },
  'Nakuru': {
    'Nairobi': 158,
    'Eldoret': 156,
    'Kisumu': 185,
    'Kericho': 105,
    'Nyandarua': 80,
    'Nyeri': 160,
    'Mombasa': 643,
  },
  'Kisumu': {
    'Nairobi': 348,
    'Eldoret': 118,
    'Nakuru': 185,
    'Kakamega': 52,
    'Kisii': 112,
    'Homa Bay': 108,
    'Busia': 115,
    'Siaya': 72,
    'Kericho': 85,
  },
  'Mombasa': {
    'Nairobi': 485,
    'Kilifi': 58,
    'Kwale': 35,
    'Malindi': 118,
    'Nakuru': 643,
    'Eldoret': 797,
    'Kisumu': 833,
  }
};

/**
 * Calculates road distance between any two Kenyan counties.
 * Uses hub-and-spoke highway logic with Haversine road detour factor (1.35x)
 * to reflect actual Kenyan terrain and road routes.
 */
export function calculateKenyaRoadDistance(originCounty: string, destinationCounty: string): { distanceKm: number; transitHours: number } {
  if (originCounty === destinationCounty) {
    return { distanceKm: 25, transitHours: 1.0 }; // intra-county average
  }

  // Check direct hub lookup
  if (HUBS_DISTANCE[originCounty] && HUBS_DISTANCE[originCounty][destinationCounty]) {
    const km = HUBS_DISTANCE[originCounty][destinationCounty];
    const hours = Math.round((km / 55 + 0.5) * 10) / 10;
    return { distanceKm: km, transitHours: hours };
  }
  if (HUBS_DISTANCE[destinationCounty] && HUBS_DISTANCE[destinationCounty][originCounty]) {
    const km = HUBS_DISTANCE[destinationCounty][originCounty];
    const hours = Math.round((km / 55 + 0.5) * 10) / 10;
    return { distanceKm: km, transitHours: hours };
  }

  // Fallback using Haversine * 1.38 road topography winding factor
  const c1 = KENYA_COUNTIES.find(c => c.name.toLowerCase() === originCounty.toLowerCase());
  const c2 = KENYA_COUNTIES.find(c => c.name.toLowerCase() === destinationCounty.toLowerCase());

  if (!c1 || !c2) {
    return { distanceKm: 120, transitHours: 2.5 };
  }

  const R = 6371; // Earth radius in km
  const dLat = (c2.lat - c1.lat) * (Math.PI / 180);
  const dLon = (c2.lon - c1.lon) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(c1.lat * (Math.PI / 180)) * Math.cos(c2.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineKm = R * c;

  // Kenya road detour coefficient: 1.36 for highlands/plains, 1.45 for Rift Valley escarpments
  const detour = 1.38;
  const roadKm = Math.max(30, Math.round(straightLineKm * detour));
  const transitHours = Math.round((roadKm / 55 + 0.5) * 10) / 10;

  return { distanceKm: roadKm, transitHours };
}
