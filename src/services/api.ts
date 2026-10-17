/**
 * SMART-AGRI KENYA - Client API Service
 * Interacts with backend server routes (/api/*)
 */

export interface AiAssistantResponse {
  text: string;
  isFallback?: boolean;
}

export interface DiagnoseResponse {
  rawText?: string;
  diagnosis?: {
    diseaseOrPest: string;
    confidence: string;
    symptomsMatched: string;
    activeIngredients: string[];
    safetyPrecautions: string;
    immediateAction: string;
    professionalReferralRequired: boolean;
  };
  isFallback?: boolean;
}

export interface MpesaStkResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
  Timestamp?: string;
  Amount?: number;
}

export interface MpesaStatusResponse {
  ResponseCode: string;
  ResponseDescription: string;
  ResultCode: string;
  ResultDesc: string;
  MpesaReceiptNumber: string;
  TransactionDate: string;
  Status: string;
}

export interface WeatherResponse {
  county: string;
  coordinates: { lat: number; lon: number };
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
  };
  source: string;
  updatedAt: string;
  isFallback?: boolean;
}

export const api = {
  // 1. Farming Advice AI Assistant (Powered by server-side Gemini 3.8 Flash)
  async askFarmingAssistant(payload: {
    message: string;
    county?: string;
    crop?: string;
    livestock?: string;
    soilData?: any;
    language?: 'English' | 'Swahili';
  }): Promise<AiAssistantResponse> {
    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to get advisory from server');
      return await res.json();
    } catch (err: any) {
      console.warn('AI Assistant endpoint fallback:', err);
      return {
        text: `[Offline Kenya Agricultural Advisory]\n\nRegarding your query about ${payload.crop || payload.livestock || 'your farm'} in ${payload.county || 'Kenya'}:\n\n` +
          `1. **Agro-Ecological Practice**: Ensure recommended plant spacing and purchase KEPHIS-certified inputs from registered agrovets.\n` +
          `2. **Soil Health**: Avoid continuous application of acidifying fertilizers (such as DAP) without periodic liming.\n` +
          `3. **Pest Scouting**: Scout crops at least twice weekly during early morning hours.\n` +
          `4. **Advisory**: Check the Pest Diagnosis tab or consult a registered extension officer in ${payload.county || 'your county'}.`,
        isFallback: true,
      };
    }
  },

  // 2. Pest & Disease Diagnosis (Image or Text)
  async diagnosePest(payload: {
    targetType: 'crop' | 'livestock';
    targetName: string;
    symptoms: string;
    county?: string;
    imageBase64?: string;
    mimeType?: string;
  }): Promise<DiagnoseResponse> {
    try {
      const res = await fetch('/api/gemini/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Diagnosis service error');
      return await res.json();
    } catch (err) {
      console.warn('Diagnosis endpoint error:', err);
      return {
        isFallback: true,
        diagnosis: {
          diseaseOrPest: payload.targetType === 'crop' ? 'Suspected Fungal / Insect Infestation' : 'Suspected Tick-Borne / Viral Condition',
          confidence: 'Moderate (Offline Estimate)',
          symptomsMatched: payload.symptoms,
          activeIngredients: payload.targetType === 'crop' 
            ? ['Mancozeb 800g/kg', 'Chlorantraniliprole 200g/L']
            : ['Amitraz 12.5% Acaricide', 'Buparvaquone (Vet Rx)'],
          safetyPrecautions: 'Wear full PPE (gloves, gumboots, mask). Observe Pre-Harvest Interval (PHI) as labeled.',
          immediateAction: 'Isolate affected crops or animals immediately and notify the Sub-County Agricultural or Veterinary Office.',
          professionalReferralRequired: true,
        },
      };
    }
  },

  // 3. M-Pesa Daraja STK Push Initiation
  async initiateMpesaStk(payload: {
    phoneNumber: string;
    amount: number;
    accountReference?: string;
    transactionDesc?: string;
  }): Promise<MpesaStkResponse> {
    const res = await fetch('/api/mpesa/stkpush', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || data.ResponseCode !== '0') {
      throw new Error(data.ResponseDescription || 'M-Pesa STK push failed');
    }
    return data;
  },

  // 4. M-Pesa Transaction Query
  async queryMpesa(checkoutRequestID: string): Promise<MpesaStatusResponse> {
    const res = await fetch('/api/mpesa/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkoutRequestID }),
    });
    return await res.json();
  },

  // 5. Weather Forecast for Kenyan County
  async fetchCountyWeather(countyName: string, lat: number, lon: number): Promise<WeatherResponse> {
    try {
      const res = await fetch(`/api/weather?county=${encodeURIComponent(countyName)}&lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error('Failed to fetch weather');
      return await res.json();
    } catch (err) {
      return {
        county: countyName,
        coordinates: { lat, lon },
        current: {
          temperature_2m: 23.0,
          relative_humidity_2m: 65,
          precipitation: 0.0,
          wind_speed_10m: 12.0,
          weather_code: 1,
        },
        daily: {
          time: ['2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23'],
          temperature_2m_max: [24, 25, 23, 23, 24, 25, 24],
          temperature_2m_min: [14, 15, 14, 13, 14, 15, 14],
          precipitation_sum: [0.5, 2.1, 0.0, 0.0, 1.8, 0.2, 0.0],
          precipitation_probability_max: [30, 55, 10, 10, 45, 15, 10],
        },
        source: 'Kenya Agro-Meteorological Advisory Grid',
        updatedAt: new Date().toISOString(),
        isFallback: true,
      };
    }
  },
};
