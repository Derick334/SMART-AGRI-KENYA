export interface SoilLabPartner {
  id: string;
  name: string;
  institution: string;
  county: string;
  address: string;
  phone: string;
  accreditation: string;
  standardFeeKsh: number;
  expressFeeKsh: number;
  turnaroundDays: number;
  availableTests: string[];
}

export const SOIL_LAB_PARTNERS: SoilLabPartner[] = [
  {
    id: 'lab-kalro-narl',
    name: 'KALRO National Agricultural Research Laboratories (NARL)',
    institution: 'Kenya Agricultural and Livestock Research Organization',
    county: 'Nairobi',
    address: 'Waiyaki Way, Kabete, Nairobi',
    phone: '0722206986',
    accreditation: 'ISO/IEC 17025 Accredited (KENAS/TL/014)',
    standardFeeKsh: 1500,
    expressFeeKsh: 2500,
    turnaroundDays: 5,
    availableTests: ['Full Chemical Profile (pH, N, P, K, Ca, Mg, S)', 'Soil Texture & Particle Size', 'Organic Carbon & Matter', 'Heavy Metals & Salinity EC', 'Nematode Screening'],
  },
  {
    id: 'lab-cropnuts',
    name: 'Crop Nutrition Laboratory Services (CropNuts)',
    institution: 'CropNuts Agronomy Diagnostics Ltd',
    county: 'Kiambu',
    address: 'Cooper Center, Kaptagat Rd, Loresho / Limuru',
    phone: '0711094444',
    accreditation: 'UKAS & KENAS International ISO 17025 Accredited',
    standardFeeKsh: 2800,
    expressFeeKsh: 4200,
    turnaroundDays: 3,
    availableTests: ['Comprehensive Precision Agronomy (16 Nutrients)', 'Cation Exchange Capacity (CEC)', 'Lime & Gypsum Requirement Modeling', 'Spectroscopy Micro-nutrients (B, Zn, Cu, Fe, Mn)', 'Plant Tissue Leaf Analysis'],
  },
  {
    id: 'lab-kephis',
    name: 'KEPHIS Plant Inspection & Soil Analytics Lab',
    institution: 'Kenya Plant Health Inspectorate Service',
    county: 'Nairobi',
    address: 'Oloolua Ridge, Karen, Nairobi',
    phone: '0709841000',
    accreditation: 'Official National Phytosanitary Authority',
    standardFeeKsh: 2000,
    expressFeeKsh: 3000,
    turnaroundDays: 4,
    availableTests: ['Soil pH & Acidity Saturation', 'Soil-Borne Bacterial & Fungal Pathogens', 'Phosphorus Sorption Index', 'Irrigation Water Salinity suitability'],
  },
  {
    id: 'lab-tri-kericho',
    name: 'Tea Research Institute Soil & Fertilizer Lab',
    institution: 'KALRO Tea Research Institute',
    county: 'Kericho',
    address: 'Timbilil Estate, Kericho',
    phone: '0722203456',
    accreditation: 'Specialized Acid Soils Research Center',
    standardFeeKsh: 1800,
    expressFeeKsh: 2800,
    turnaroundDays: 4,
    availableTests: ['Acid Soil Aluminum Toxicity Index', 'Potassium-to-Magnesium Ratio', 'Organic Matter & Humus Content', 'Nitrogen Mineralization Potential'],
  }
];
