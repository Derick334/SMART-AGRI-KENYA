import { PestProblemReference } from '../types';

export const PEST_AND_DISEASE_DATABASE: PestProblemReference[] = [
  // CROP PROBLEMS
  {
    id: 'pest-crop-1',
    targetType: 'crop',
    targetHost: 'Maize (Zea mays)',
    commonName: 'Fall Armyworm (FAW)',
    scientificName: 'Spodoptera frugiperda',
    category: 'pest',
    symptoms: [
      'Window pane feeding marks on young maize leaves',
      'Pin-hole perforations and ragged leaf margins',
      'Moist yellowish-brown frass (caterpillar droppings) inside whorl',
      'Caterpillar with 4 dark spots arranged in a square on 8th abdominal segment and inverted Y on head'
    ],
    severity: 'Severe Quarantine Risk',
    pcpbApprovedActives: [
      {
        activeIngredient: 'Chlorantraniliprole 200 g/L (Coragen / Voliam)',
        tradeExamples: 'Coragen 20 SC, Belt 480 SC',
        targetStage: 'Early instars (L1-L3) directed into the central funnel/whorl',
        phiDays: 14,
        ppeRequirement: 'Full overalls, chemical-resistant nitrile gloves, face shield, gumboots',
      },
      {
        activeIngredient: 'Emamectin Benzoate 50 g/kg (Proclaim / Match)',
        tradeExamples: 'Prove 1.92 EC, Proclaim 05 SG',
        targetStage: 'Active caterpillar feeding stage',
        phiDays: 7,
        ppeRequirement: 'Protective goggles, respirator mask, chemical gloves',
      },
      {
        activeIngredient: 'Bacillus thuringiensis (Bt) - Biological',
        tradeExamples: 'Dipel 2X, Thuricide HP',
        targetStage: 'Egg hatch and tiny larvae (Organic compliant)',
        phiDays: 1,
        ppeRequirement: 'Dust mask, protective spectacles, standard cotton overalls',
      }
    ],
    culturalControls: [
      'Early planting with first soaking rains to escape peak moth migration',
      'Push-pull technology intercropping with Desmodium and Napier grass border',
      'Hand-picking caterpillars and putting fine sand or wood ash in whorls',
      'Crop rotation with non-host legumes (Cowpeas, Beans, Groundnuts)'
    ],
  },
  {
    id: 'pest-crop-2',
    targetType: 'crop',
    targetHost: 'Tomato (Solanum lycopersicum)',
    commonName: 'Tomato Leafminer / Tuta Absoluta',
    scientificName: 'Phthorimaea absoluta (Tuta absoluta)',
    category: 'pest',
    symptoms: [
      'Serpentine leaf blotches and silver mines on foliage',
      'Larvae boring into apical buds and flower stems',
      'Exit puncture holes on fruit with black frass, leading to secondary fungal rot',
      'Drying and burning appearance of whole canopy in severe infestations'
    ],
    severity: 'High',
    pcpbApprovedActives: [
      {
        activeIngredient: 'Spinetoram 120 g/L (Radiant)',
        tradeExamples: 'Radiant 120 SC, Delegate 250 WG',
        targetStage: 'Active leaf-mining larvae before fruit penetration',
        phiDays: 3,
        ppeRequirement: 'Organic vapor respirator, chemical overalls, nitrile gloves',
      },
      {
        activeIngredient: 'Flubendiamide 480 g/L (Fame)',
        tradeExamples: 'Fame 480 SC',
        targetStage: 'Larval feeding stages',
        phiDays: 3,
        ppeRequirement: 'Chemical splash goggles, heavy gloves, gumboots',
      }
    ],
    culturalControls: [
      'Install sex pheromone delta water traps (4-6 traps per acre) for mass trapping',
      'Insect-proof net screens on greenhouse side vents',
      'Destruction and burning of infested crop residues immediately after harvest',
      'Strict nursery hygiene and seedling inspection'
    ],
  },
  {
    id: 'pest-crop-3',
    targetType: 'crop',
    targetHost: 'Potato & Tomato',
    commonName: 'Late Blight (Fungal)',
    scientificName: 'Phytophthora infestans',
    category: 'fungal',
    symptoms: [
      'Water-soaked pale green or dark brown lesions rapidly enlarging on leaves',
      'White cottony fungal mold visible on leaf undersides during humid/misty mornings',
      'Foul rotting smell in field',
      'Purplish-brown dry rot extending into potato tubers or tomato fruit'
    ],
    severity: 'High',
    pcpbApprovedActives: [
      {
        activeIngredient: 'Mancozeb 800 g/kg (Preventative Contact)',
        tradeExamples: 'Dithane M-45, Oshothane 80 WP, Penncozeb',
        targetStage: 'Preventative application before disease onset during wet cold weather',
        phiDays: 14,
        ppeRequirement: 'Particulate dust mask, chemical rubber gloves, waterproof apron',
      },
      {
        activeIngredient: 'Metalaxyl-M 40 g/kg + Mancozeb 640 g/kg (Systemic Curative)',
        tradeExamples: 'Ridomil Gold MZ 68 WG, Milraz WP',
        targetStage: 'Early curative spray when first lesions appear',
        phiDays: 14,
        ppeRequirement: 'Full chemical spray suit, vapor respirator, gumboots',
      }
    ],
    culturalControls: [
      'Plant certified blight-resistant varieties (e.g., Shangi, Unica, Asante)',
      'Ensure wide plant spacing to promote air circulation and quick leaf drying',
      'Hilling up soil around potato roots to protect tubers from fungal spore wash',
      'Avoid overhead sprinkler irrigation during late afternoon'
    ],
  },

  // LIVESTOCK PROBLEMS
  {
    id: 'pest-live-1',
    targetType: 'livestock',
    targetHost: 'Dairy & Beef Cattle',
    commonName: 'East Coast Fever (ECF / Ndigana Kali)',
    scientificName: 'Theileria parva (Vector: Rhipicephalus appendiculatus brown ear tick)',
    category: 'tick_borne',
    symptoms: [
      'Swelling of parotid lymph nodes below ear, followed by prescapular nodes',
      'High persistent fever (40.5°C - 42.0°C)',
      'Labored breathing, coughing, and white frothy nasal discharge (pulmonary edema)',
      'Corneal opacity (cloudy eyes), anorexia, rapid loss of milk yield',
      'Severe recumbency and death within 14-21 days if untreated'
    ],
    severity: 'Severe Quarantine Risk',
    pcpbApprovedActives: [
      {
        activeIngredient: 'Parvaquone 150 mg/mL or Buparvaquone 50 mg/mL',
        tradeExamples: 'Citarin, Buparex, Butalex (Veterinary Prescription Only)',
        targetStage: 'Administer at earliest onset of fever before lung edema progresses',
        phiDays: 28,
        ppeRequirement: 'Veterinary sterile hypodermic needles, disinfectant, restraint crush',
      },
      {
        activeIngredient: 'Amitraz 12.5% EC (Acaricide Dip/Spray)',
        tradeExamples: 'Triatix 125, Aludex, Ectocare',
        targetStage: 'Weekly plunge dipping or knapsack crush spraying of ears and tail',
        phiDays: 1,
        ppeRequirement: 'Rubber apron, waterproof gauntlet gloves, protective eye goggles',
      }
    ],
    culturalControls: [
      'Vaccinate calves with the "Muguga Cocktail" ECF ITM (Infection & Treatment Method) vaccine',
      'Strict weekly tick control regime using registered acaricides',
      'Fencing farm perimeter to prevent contact with wildlife or stray pastoral herds'
    ],
    vetAlertNote: 'CRITICAL EMERGENCY: ECF causes irreversible lung flooding. Contact a registered Kenya Veterinary Board (KVB) veterinarian immediately for buparvaquone and diuretic therapy.'
  },
  {
    id: 'pest-live-2',
    targetType: 'livestock',
    targetHost: 'Poultry & Chickens',
    commonName: 'Newcastle Disease (Kideri / Lukufwi)',
    scientificName: 'Avian Paramyxovirus Serotype 1 (APMV-1)',
    category: 'viral',
    symptoms: [
      'Gasping, coughing, sneezing, and gurgling respiratory distress',
      'Bright greenish watery diarrhea',
      'Twisting of head and neck (torticollis), circling, paralysis of legs and wings',
      'Sudden drop in egg production with soft-shelled or deformed eggs',
      'Massive mortality up to 90-100% within 48-72 hours in unvaccinated flocks'
    ],
    severity: 'Severe Quarantine Risk',
    pcpbApprovedActives: [
      {
        activeIngredient: 'Live Attenuated Viral Vaccine (Lasota / Hitchner B1 / I-2 Thermostable)',
        tradeExamples: 'Avinew, CEVA Newcastle, KALRO Thermostable I-2',
        targetStage: 'Preventative vaccination schedule at Day 1, Week 3, and every 3 months',
        phiDays: 0,
        ppeRequirement: 'Clean veterinary gloves, dropper bottles, ice cooler box for cold chain',
      }
    ],
    culturalControls: [
      'No curative drug exists for viral Newcastle; antibiotics only treat secondary bacterial infections',
      'Quarantine new birds for 14 days before introducing to flock',
      'Strict footbaths with disinfectant (Virkon S) at poultry house entrance',
      'Burn or deeply bury (with lime) all carcasses of dead birds; never consume or sell infected birds'
    ],
    vetAlertNote: 'Notify Sub-County Veterinary Officer immediately of suspected outbreaks. Newcastle is a notifiable disease in Kenya.'
  },
  {
    id: 'pest-live-3',
    targetType: 'livestock',
    targetHost: 'Dairy Cattle & Dairy Goats',
    commonName: 'Bovine Mastitis (Clinical & Sub-Clinical)',
    scientificName: 'Staphylococcus aureus, Streptococcus agalactiae, E. coli',
    category: 'bacterial',
    symptoms: [
      'Swollen, hot, hard, or painful udder quarter',
      'Clots, flakes, watery or blood-stained milk in strip cup test',
      'Cow kicking or resisting milking due to tenderness',
      'Sub-clinical form shows no visible signs but positive California Mastitis Test (CMT) reaction'
    ],
    severity: 'Moderate',
    pcpbApprovedActives: [
      {
        activeIngredient: 'Intramammary Cloxacillin + Ampicillin Tubes',
        tradeExamples: 'Multimast, Noroclox DC (Dry Cow), Mastalone',
        targetStage: 'Infuse into affected teat canal after complete hand stripping',
        phiDays: 7,
        ppeRequirement: 'Sterile teat alcohol wipes, disposable nitrile gloves',
      }
    ],
    culturalControls: [
      'Always test milk with a Strip Cup before attaching milking machine or hand milking',
      'Dip teats in 0.5% Iodine teat dip immediately post-milking',
      'Milk older cows or previously treated cows last to prevent cross-contamination',
      'Provide feed immediately after milking to keep cows standing for 30 minutes while teat sphincter closes'
    ],
    vetAlertNote: 'Milk from treated quarters contains antibiotic residues and MUST be discarded during the withholding period. Do not deliver to milk collection cooling plants.'
  }
];
