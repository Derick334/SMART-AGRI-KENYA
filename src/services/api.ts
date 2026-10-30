import {
  SoilAnalysisInput,
  SoilAnalysisReport,
  IrrigationInput,
  IrrigationScheduleReport,
  PestDiagnosisSubmission,
  PestDiagnosisReport,
  AiTelemetryMetric,
  AiFeedbackReport,
  ChatModelTier,
  ChatbotRole,
  GroundingMode,
  MultiTurnChatMessage,
  GroundingChunkWeb,
  GroundingChunkMap
} from '../types';

export interface AiAssistantResponse {
  text: string;
  isFallback?: boolean;
  latencyMs?: number;
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
  isOfflineCached?: boolean;
  cachedAt?: string;
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

  // 5. Weather Forecast for Kenyan County (with offline caching)
  async fetchCountyWeather(countyName: string, lat: number, lon: number): Promise<WeatherResponse> {
    const cacheKey = `smart_agri_weather_${countyName.toLowerCase().trim()}`;
    try {
      const res = await fetch(`/api/weather?county=${encodeURIComponent(countyName)}&lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error('Failed to fetch weather');
      const data: WeatherResponse = await res.json();
      
      // Store into local cache for offline availability
      if (typeof window !== 'undefined' && data) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            ...data,
            cachedAt: new Date().toISOString()
          }));
        } catch {}
      }
      return data;
    } catch (err) {
      console.warn('Weather network error, retrieving cached forecast for', countyName, err);
      // Retrieve from offline cache if available
      if (typeof window !== 'undefined') {
        try {
          const cachedStr = localStorage.getItem(cacheKey);
          if (cachedStr) {
            const cachedData = JSON.parse(cachedStr);
            return {
              ...cachedData,
              isFallback: false,
              isOfflineCached: true,
            };
          }
        } catch {}
      }

      // Return synthetic default if not previously cached
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
        isOfflineCached: true,
      };
    }
  },

  // 6. Secure Authentication endpoints
  async login(identifier: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed. Please check your credentials.');
    }
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('deriv_agri_session_token', data.token);
    }
    return data;
  },

  async register(userData: any) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed. Please review your details.');
    }
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('deriv_agri_session_token', data.token);
    }
    return data;
  },

  async getMe() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('deriv_agri_session_token') : null;
    if (!token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('deriv_agri_session_token');
        }
        return null;
      }
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  },

  async logout() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('deriv_agri_session_token') : null;
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch {}
      if (typeof window !== 'undefined') {
        localStorage.removeItem('deriv_agri_session_token');
      }
    }
  },

  async verifyMemberId(memberId: string) {
    const res = await fetch('/api/auth/verify-member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Verification request failed.');
    }
    return data;
  },

  async requestPasswordReset(identifier: string) {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Password reset request failed.');
    }
    return data;
  },

  async resetPassword(token: string, newPassword: string) {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Password update failed.');
    }
    return data;
  },

  // 8.5 Multi-turn Gemini Chatbot with Search and Maps Grounding
  async sendMultiTurnChat(payload: {
    message: string;
    history?: Array<{ role: 'user' | 'assistant'; text: string }>;
    model?: ChatModelTier | 'auto';
    roleId?: ChatbotRole;
    groundingMode?: GroundingMode;
    county?: string;
    userLocation?: { latitude: number; longitude: number };
    language?: 'English' | 'Kiswahili';
  }): Promise<{ success: boolean; response: MultiTurnChatMessage }> {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to process chat with Gemini');
    }
    return data;
  },

  // 9. Fast Streaming Multi-Turn Farming Assistant (Server-Sent Events)
  async askFarmingAssistantStream(
    payload: {
      message: string;
      county?: string;
      crop?: string;
      livestock?: string;
      history?: Array<{ role: 'user' | 'assistant'; content?: string; text?: string }>;
      language?: 'English' | 'Kiswahili';
      liveContext?: any;
      model?: ChatModelTier | 'auto';
      roleId?: ChatbotRole;
      groundingMode?: GroundingMode;
      userLocation?: { latitude: number; longitude: number };
    },
    onChunk: (chunk: string) => void,
    onDone: (data: { 
      citations: Array<{ title: string; organization: string; citationCode: string; year: number }>; 
      latencyMs: number;
      modelUsed?: string;
      groundingType?: 'search' | 'maps' | 'none' | 'rag';
      searchSources?: GroundingChunkWeb[];
      mapSources?: GroundingChunkMap[];
    }) => void,
    onError: (err: string) => void
  ) {
    try {
      const response = await fetch('/api/gemini/assistant/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to connect to streaming advisory service');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.error) {
                onError(data.error);
                return;
              }
              if (data.chunk) {
                onChunk(data.chunk);
              }
              if (data.done) {
                onDone({
                  citations: data.citations || [],
                  latencyMs: data.latencyMs || 0,
                  modelUsed: data.modelUsed,
                  groundingType: data.groundingType,
                  searchSources: data.searchSources,
                  mapSources: data.mapSources,
                });
              }
            } catch {
              // Ignore line parsing anomaly
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('Streaming failed, fallback invoked:', err);
      onError(err.message || 'Advisory connection interrupted.');
    }
  },

  // 10. Soil Health Analysis (Deterministic agronomic calculation engine)
  async analyzeSoil(input: SoilAnalysisInput): Promise<{ success: boolean; report: SoilAnalysisReport; latencyMs: number }> {
    const res = await fetch('/api/soil/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Soil analysis calculation failed');
    }
    return data;
  },

  // 11. Smart Irrigation Calculation (FAO-56 Penman-Monteith)
  async calculateIrrigation(input: IrrigationInput): Promise<{ success: boolean; report: IrrigationScheduleReport; latencyMs: number }> {
    const res = await fetch('/api/irrigation/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Irrigation schedule calculation failed');
    }
    return data;
  },

  // 12. Upgraded AI Pest & Disease Diagnosis
  async diagnosePestSubmission(submission: PestDiagnosisSubmission & { isImageBlurry?: boolean }): Promise<{ success: boolean; diagnosis: PestDiagnosisReport; latencyMs: number }> {
    const res = await fetch('/api/gemini/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Pest diagnosis service failed');
    }
    return data;
  },

  // 13. Admin AI Telemetry & Observability
  async fetchAiMetrics(): Promise<{
    metrics: AiTelemetryMetric[];
    summary: {
      totalQueries: number;
      averageLatencyMs: number;
      cacheHitRatePercent: number;
      successRatePercent: number;
      activeModel: string;
    };
  }> {
    const res = await fetch('/api/admin/ai/metrics');
    return await res.json();
  },

  // 14. Farmer Feedback Submission
  async submitAiFeedback(payload: {
    farmerEmail: string;
    farmerQuery: string;
    aiResponseText: string;
    feedbackType: string;
    notes?: string;
  }): Promise<{ success: boolean; feedback: AiFeedbackReport }> {
    const res = await fetch('/api/ai/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  // 15. Admin AI Feedback List & Resolution
  async fetchAiFeedbackList(): Promise<{ feedbackList: AiFeedbackReport[]; total: number }> {
    const res = await fetch('/api/admin/ai/feedback');
    return await res.json();
  },

  async resolveAiFeedback(id: string): Promise<boolean> {
    const res = await fetch(`/api/admin/ai/feedback/${id}/resolve`, { method: 'PUT' });
    return res.ok;
  },
};

export const apiService = api;


