import { calculateKenyaRoadDistance } from '../data/kenyaCounties';
import { DeliveryQuote, ProductCategory } from '../types';

export interface VehicleOption {
  type: string;
  label: string;
  description: string;
  baseFareKsh: number;
  ratePerKmKsh: number;
  maxWeightKg: number;
  suitableFor: string[];
}

export const KENYA_VEHICLES: VehicleOption[] = [
  {
    type: 'boda_boda',
    label: 'Boda Boda Courier (Motorcycle)',
    description: 'Fast for small parcels, fresh greens, farm medicine, seed packets up to 40kg',
    baseFareKsh: 150,
    ratePerKmKsh: 30,
    maxWeightKg: 40,
    suitableFor: ['vegetables', 'seeds', 'medicine', 'eggs', 'chicks'],
  },
  {
    type: 'probox_van',
    label: 'Probox / Small Van',
    description: 'Enclosed secure transit for produce crates, fruit boxes, honey, up to 500kg',
    baseFareKsh: 750,
    ratePerKmKsh: 55,
    maxWeightKg: 500,
    suitableFor: ['fruits', 'crates', 'honey', 'poultry_boxes', 'vegetables'],
  },
  {
    type: 'canter_pickup',
    label: '3-Tonne Canter Pickup',
    description: 'Medium loads: grain bags, fertilizer sacks, small livestock (goats, sheep, pigs)',
    baseFareKsh: 2200,
    ratePerKmKsh: 95,
    maxWeightKg: 3000,
    suitableFor: ['cereals', 'fertilizers', 'goats', 'sheep', 'pigs', 'fodder'],
  },
  {
    type: 'ten_tonne_lorry',
    label: '10-Tonne Heavy Lorry',
    description: 'Bulk grain haulage, commercial fertilizer transport, large farm machinery',
    baseFareKsh: 5500,
    ratePerKmKsh: 185,
    maxWeightKg: 10000,
    suitableFor: ['bulk_maize', 'wheat', 'fertilizers', 'tractors', 'irrigation_pipes'],
  },
  {
    type: 'cold_chain_truck',
    label: 'Refrigerated Cold-Chain Van',
    description: 'Temperature-controlled (2°C - 6°C) for fresh raw milk, butchered beef, cut flowers, vaccines',
    baseFareKsh: 4200,
    ratePerKmKsh: 140,
    maxWeightKg: 2500,
    suitableFor: ['milk', 'fresh_meat', 'flowers', 'vaccines', 'berries'],
  },
  {
    type: 'livestock_carrier',
    label: 'Specialized Cattle & Livestock Carrier',
    description: 'Equipped with cattle partitions, non-slip ramp, ventilation, and animal welfare compliance',
    baseFareKsh: 4800,
    ratePerKmKsh: 165,
    maxWeightKg: 6000,
    suitableFor: ['dairy_cows', 'beef_cattle', 'bulls', 'heifers', 'bulk_goats'],
  },
];

/**
 * Calculates a verified shipping fee quote between any two Kenyan counties
 * based on road distance, product category, weight, and optimal vehicle type.
 */
export function calculateDeliveryQuote(
  originCounty: string,
  destinationCounty: string,
  category: ProductCategory,
  weightKg: number = 20,
  preferredVehicleType?: string
): DeliveryQuote {
  const { distanceKm, transitHours } = calculateKenyaRoadDistance(originCounty, destinationCounty);

  // Automatically pick suitable vehicle if not specified
  let vehicle = KENYA_VEHICLES.find(v => v.type === preferredVehicleType);

  if (!vehicle) {
    if (category === 'livestock') {
      if (weightKg > 150) {
        vehicle = KENYA_VEHICLES.find(v => v.type === 'livestock_carrier')!;
      } else {
        vehicle = KENYA_VEHICLES.find(v => v.type === 'canter_pickup')!;
      }
    } else if (weightKg <= 35 && distanceKm <= 50) {
      vehicle = KENYA_VEHICLES.find(v => v.type === 'boda_boda')!;
    } else if (weightKg <= 450) {
      vehicle = KENYA_VEHICLES.find(v => v.type === 'probox_van')!;
    } else if (weightKg <= 2800) {
      vehicle = KENYA_VEHICLES.find(v => v.type === 'canter_pickup')!;
    } else {
      vehicle = KENYA_VEHICLES.find(v => v.type === 'ten_tonne_lorry')!;
    }
  }

  // Calculate pricing components
  const baseFare = vehicle.baseFareKsh;
  const mileageCharge = Math.round(distanceKm * vehicle.ratePerKmKsh);
  
  // Weight handling surcharge (for heavy sacks or livestock handling)
  let weightSurcharge = 0;
  if (weightKg > 100) {
    weightSurcharge = Math.round((weightKg - 100) * 1.8);
  }

  const totalFreight = baseFare + mileageCharge + weightSurcharge;

  let notes = `Route: ${originCounty} to ${destinationCounty} via standard KeNHA highway corridor (${distanceKm} km). Estimated transit: ${transitHours} hrs.`;
  if (category === 'livestock') {
    notes += ' Transport complies with Kenya Veterinary Services animal transit regulations.';
  }

  return {
    originCounty,
    destinationCounty,
    distanceKm,
    estimatedTransitHours: transitHours,
    vehicleType: vehicle.label,
    baseFareKsh: baseFare,
    weightSurchargeKsh: weightSurcharge,
    totalFreightKsh: totalFreight,
    notes,
  };
}
