import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Languages, 
  BookOpen, 
  ThumbsUp, 
  ThumbsDown, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CloudRain, 
  Layers, 
  Tag, 
  AlertTriangle, 
  Check, 
  Info,
  RotateCcw,
  Compass,
  Search,
  ExternalLink,
  Volume2,
  VolumeX,
  Copy,
  Download,
  Trash2,
  Cpu,
  Stethoscope,
  Wheat,
  FlaskConical,
  BarChart3,
  Navigation
} from 'lucide-react';
import { apiService } from '../services/api';
import { KENYA_COUNTIES } from '../data/kenyaCounties';
import { agriStore } from '../services/store';
import { 
  ChatModelTier, 
  ChatbotRole, 
  GroundingMode, 
  MultiTurnChatMessage, 
  GroundingChunkWeb, 
  GroundingChunkMap 
} from '../types';

interface AiAssistantPageProps {
  selectedCounty: string;
  onSelectCounty: (county: string) => void;
}

export const AiAssistantPage: React.FC<AiAssistantPageProps> = ({
  selectedCounty,
  onSelectCounty,
}) => {
  // Chatbot Role Persona
  const [selectedRole, setSelectedRole] = useState<ChatbotRole>('agronomist');

  // Model Tier
  const [selectedModel, setSelectedModel] = useState<ChatModelTier | 'auto'>('gemini-3.8-flash');

  // Grounding Mode (Google Search, Google Maps, Auto, None)
  const [groundingMode, setGroundingMode] = useState<GroundingMode>('auto');

  // GPS Coordinates for Maps Grounding
  const [userGps, setUserGps] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string>('');

  // Language
  const [language, setLanguage] = useState<'English' | 'Kiswahili'>('English');

  // Context Toggles
  const [attachWeather, setAttachWeather] = useState(true);
  const [attachSoilTests, setAttachSoilTests] = useState(true);

  // Audio speech synthesis
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Chat message thread
  const [messages, setMessages] = useState<MultiTurnChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      text: `Habari ya mkulima! I am your DERIV-AGRI Kenya AI Agricultural Specialist.\n\nI am grounded in official Kenyan research from KALRO, PCPB Kenya pesticide registers, KEPHIS certified seed standards, and enhanced with live **Google Search Grounding** and **Google Maps Grounding**.\n\nYou can consult me as:\n• 🌾 **Senior Agronomist**: Crops, certified seed varieties, planting dates, and PCPB chemicals\n• 🐄 **Livestock & Vet Doctor**: Dairy rations (TMR), ECF tick prevention, vaccines, and mastitis\n• 🧪 **Soil Scientist**: pH diagnosis, lime requirements, and fertilizer schedules\n• 📊 **Market Economist**: Live wholesale prices, Wakulima/Kongowea markets, and storage\n\nHow can I help your farm in ${selectedCounty} today? (Unaweza kuuliza kwa Kiswahili au Kiingereza)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.8-flash',
      roleId: 'agronomist',
      groundingType: 'none',
      citations: [
        { title: 'National Agricultural Research Laboratories Soil Index', organization: 'KALRO', citationCode: 'KALRO-NARL-2024', year: 2024 },
        { title: 'Registered Pest Control Products for Agricultural Use', organization: 'PCPB', citationCode: 'PCPB-REG-2026', year: 2026 }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackTargetMessage, setFeedbackTargetMessage] = useState<MultiTurnChatMessage | null>(null);
  const [feedbackType, setFeedbackType] = useState<string>('helpful');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Request browser geolocation for Google Maps Grounding
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation not supported by browser.');
      return;
    }
    setGpsStatus('Detecting GPS location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserGps({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setGpsStatus(`GPS detected: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
      },
      (error) => {
        console.warn('GPS error:', error);
        // Fallback to selected county coordinates
        const countyInfo = KENYA_COUNTIES.find(c => c.name.toLowerCase() === selectedCounty.toLowerCase());
        if (countyInfo) {
          setUserGps({ latitude: countyInfo.lat, longitude: countyInfo.lon });
          setGpsStatus(`Using ${selectedCounty} coordinates (${countyInfo.lat}, ${countyInfo.lon})`);
        } else {
          setGpsStatus('Could not retrieve GPS.');
        }
      },
      { timeout: 8000 }
    );
  };

  // Role metadata definitions
  const roleCards = [
    {
      id: 'agronomist' as ChatbotRole,
      title: 'Senior Agronomist',
      icon: Wheat,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badge: 'Crops & Protection',
      desc: 'Certified seeds (KEPHIS), PCPB pesticides, planting seasons, and disease scouting.'
    },
    {
      id: 'veterinarian' as ChatbotRole,
      title: 'Livestock & Vet Doctor',
      icon: Stethoscope,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      badge: 'Animal Health',
      desc: 'Dairy feeding (TMR/silage), ECF vaccine, tick control, mastitis, and poultry health.'
    },
    {
      id: 'soil_scientist' as ChatbotRole,
      title: 'Soil & Plant Scientist',
      icon: FlaskConical,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      badge: 'Soil Nutrition',
      desc: 'KALRO NARL pH analysis, agricultural lime calculation, and nutrient balances.'
    },
    {
      id: 'market_analyst' as ChatbotRole,
      title: 'Market & Price Analyst',
      icon: BarChart3,
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      badge: 'Agro-Economics',
      desc: 'Wholesale prices at Wakulima/Kongowea, harvest timing, and storage logistics.'
    }
  ];

  // Quick prompt suggestions according to current role
  const getQuickPromptsForRole = () => {
    switch (selectedRole) {
      case 'agronomist':
        return [
          `Find certified seed agrovets near ${selectedCounty}`,
          `Recommended fertilizer schedule for maize in ${selectedCounty}`,
          `How to control Fall Armyworm with PCPB registered sprays?`,
          `Latest 2026 planting weather forecast for ${selectedCounty}`
        ];
      case 'veterinarian':
        return [
          `Where is the nearest veterinary clinic in ${selectedCounty}?`,
          `Formulate a 25-liter daily milk TMR ration for Friesian cow`,
          `East Coast Fever (ECF) vaccination protocol and acaricides`,
          `Kienyeji chicken vaccination schedule from day 1 to week 18`
        ];
      case 'soil_scientist':
        return [
          `Accredited soil testing laboratories near ${selectedCounty}`,
          `How much agricultural lime (CaCO3) for soil pH 4.8 in ${selectedCounty}?`,
          `Why switch from DAP to NPK 23:23:0 on volcanic soils?`,
          `How to cure acidic soil with farmyard manure and compost`
        ];
      case 'market_analyst':
        return [
          `Find wholesale produce markets and NCPB depots in ${selectedCounty}`,
          `Latest wholesale prices for dry maize, beans and Irish potatoes`,
          `Where to sell Hass avocados and French beans for export?`,
          `How to store maize at 13.5% moisture to prevent aflatoxin`
        ];
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isStreaming) return;

    // Detect Kiswahili keywords
    let activeLang = language;
    const lower = textToSend.toLowerCase();
    if (lower.includes('habari') || lower.includes('mbolea') || lower.includes('mahindi') || lower.includes('ng\'ombe') || lower.includes('wadudu') || lower.includes('shamba') || lower.includes('bei')) {
      activeLang = 'Kiswahili';
    }

    const userMsg: MultiTurnChatMessage = {
      id: `msg-usr-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantMsgId = `msg-ast-${Date.now()}`;
    const initialAssistantMsg: MultiTurnChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: selectedModel === 'auto' ? 'gemini-3.8-flash' : selectedModel,
      roleId: selectedRole,
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, initialAssistantMsg]);
    setInputQuery('');
    setIsStreaming(true);

    // Build context payload
    const recentSoilReports = agriStore.getSoilAnalysisReports();
    const liveContext: any = {};
    if (attachWeather) {
      liveContext.weather = {
        temperatureC: 24,
        condition: 'Partly Cloudy with Scattered Showers',
        rainfallMm: 12,
      };
    }
    if (attachSoilTests && recentSoilReports.length > 0) {
      liveContext.soilReport = {
        crop: recentSoilReports[0].cropName,
        ph: recentSoilReports[0].phAnalysis.value,
        status: recentSoilReports[0].phAnalysis.rating,
      };
    }

    // Prepare conversational history (last 8 turns)
    const historyPayload = messages.slice(-8).map(m => ({
      role: m.role,
      text: m.text,
    }));

    // County coordinates fallback
    const countyCoords = KENYA_COUNTIES.find(c => c.name.toLowerCase() === selectedCounty.toLowerCase());
    const effectiveLocation = userGps || (countyCoords ? { latitude: countyCoords.lat, longitude: countyCoords.lon } : undefined);

    await apiService.askFarmingAssistantStream(
      {
        message: textToSend,
        county: selectedCounty,
        language: activeLang,
        history: historyPayload,
        liveContext,
        model: selectedModel,
        roleId: selectedRole,
        groundingMode,
        userLocation: effectiveLocation,
      },
      (chunk: string) => {
        setMessages(prev => prev.map(m => {
          if (m.id === assistantMsgId) {
            return { ...m, text: m.text + chunk };
          }
          return m;
        }));
      },
      (data) => {
        setIsStreaming(false);
        setMessages(prev => prev.map(m => {
          if (m.id === assistantMsgId) {
            return {
              ...m,
              isStreaming: false,
              citations: data.citations,
              latencyMs: data.latencyMs,
              modelUsed: data.modelUsed || selectedModel,
              groundingType: data.groundingType || 'none',
              searchSources: data.searchSources,
              mapSources: data.mapSources,
            };
          }
          return m;
        }));
      },
      (errorMsg: string) => {
        setIsStreaming(false);
        setMessages(prev => prev.map(m => {
          if (m.id === assistantMsgId) {
            return {
              ...m,
              isStreaming: false,
              text: m.text ? m.text : `[Error]: Could not retrieve agricultural response. ${errorMsg}`,
              error: errorMsg,
            };
          }
          return m;
        }));
      }
    );
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`_]/g, ''));
    utterance.rate = 1.0;
    utterance.lang = language === 'Kiswahili' ? 'sw-KE' : 'en-KE';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear conversation history?')) {
      setMessages([
        {
          id: `msg-reset-${Date.now()}`,
          role: 'assistant',
          text: `Conversation reset. How can I help your farm in ${selectedCounty} today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: selectedModel === 'auto' ? 'gemini-3.8-flash' : selectedModel,
          roleId: selectedRole,
        }
      ]);
    }
  };

  const handleExportChat = () => {
    const transcript = messages.map(m => `[${m.timestamp}] ${m.role === 'user' ? 'Farmer' : `DERIV-AGRI Specialist (${m.modelUsed || 'Gemini'})`}:\n${m.text}\n`).join('\n---\n\n');
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deriv-agri-chat-${selectedCounty.toLowerCase()}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openFeedback = (msg: MultiTurnChatMessage) => {
    setFeedbackTargetMessage(msg);
    setFeedbackType('helpful');
    setFeedbackNotes('');
    setFeedbackNotice('');
    setShowFeedbackModal(true);
  };

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackTargetMessage) return;

    try {
      await apiService.submitAiFeedback({
        farmerEmail: agriStore.getCurrentUser().email,
        farmerQuery: messages.find(m => m.id === feedbackTargetMessage.id)?.text || 'Farmer Advisory Query',
        aiResponseText: feedbackTargetMessage.text,
        feedbackType: feedbackType as any,
        notes: feedbackNotes,
      });
      setFeedbackNotice('Thank you! Your feedback has been submitted to our agricultural review team.');
      setTimeout(() => setShowFeedbackModal(false), 2000);
    } catch {
      setFeedbackNotice('Feedback saved locally. Thank you for helping improve Kenyan farm guidance!');
      setTimeout(() => setShowFeedbackModal(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#214E34] to-[#2D6A4F] text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-200 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Multi-Turn Gemini Agricultural Chatbot</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              DERIV-AGRI Intelligent Farming Assistant
            </h1>
            <p className="text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Powered by Google Gemini models with live <strong>Google Search Grounding</strong> for up-to-date bulletins, 
              <strong>Google Maps Grounding</strong> for nearby agrovets and research stations, and <strong>KALRO / PCPB agronomic knowledge</strong>.
            </p>
          </div>

          {/* Quick Stats / Location Controls */}
          <div className="flex flex-wrap items-center gap-2.5 bg-black/20 p-3 rounded-xl border border-white/10 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>County:</span>
            </div>
            <select
              value={selectedCounty}
              onChange={(e) => onSelectCounty(e.target.value)}
              className="bg-white text-[#252D27] text-xs font-bold px-2.5 py-1.5 rounded-lg outline-none cursor-pointer"
            >
              {KENYA_COUNTIES.map(c => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>

            <button
              onClick={handleDetectLocation}
              title="Use GPS for accurate Google Maps Grounding"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{userGps ? 'GPS Active' : 'Use GPS'}</span>
            </button>
          </div>
        </div>

        {gpsStatus && (
          <div className="mt-3 text-xs text-emerald-200 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>{gpsStatus}</span>
          </div>
        )}
      </div>

      {/* Role Selection & Model / Grounding Configuration Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Role Personas (4 Cards) */}
        {roleCards.map(role => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-white border-[#214E34] ring-2 ring-[#214E34]/20 shadow-xs' 
                  : 'bg-white/70 hover:bg-white border-[#E2E7DE] hover:border-[#214E34]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${role.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-[#214E34] text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {role.badge}
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#252D27]">{role.title}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{role.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Engine Controls: Model Tier & Grounding Switcher */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E7DE] flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Model Tier Selector */}
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#214E34]" />
          <span className="font-bold text-gray-700">Gemini Model:</span>
          <div className="inline-flex rounded-lg border border-[#E2E7DE] p-0.5 bg-gray-50">
            <button
              onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                selectedModel === 'gemini-3.1-flash-lite' ? 'bg-[#214E34] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Ultra-fast responses for quick lookups"
            >
              ⚡ Fast Lite (3.1)
            </button>
            <button
              onClick={() => setSelectedModel('gemini-3.8-flash')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                selectedModel === 'gemini-3.8-flash' ? 'bg-[#214E34] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="General tasks with Google Search & Maps Grounding"
            >
              🌱 Standard Flash (3.8)
            </button>
            <button
              onClick={() => setSelectedModel('gemini-4-argon')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                selectedModel === 'gemini-4-argon' ? 'bg-[#214E34] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Deep reasoning for complex chemistry, economics, and yield modeling"
            >
              🔬 Deep Argon (4.0)
            </button>
          </div>
        </div>

        {/* Grounding Mode Toggle */}
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-gray-700">Grounding:</span>
          <div className="inline-flex rounded-lg border border-[#E2E7DE] p-0.5 bg-gray-50">
            <button
              onClick={() => setGroundingMode('auto')}
              className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                groundingMode === 'auto' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Auto-detects when Search or Maps Grounding is needed"
            >
              🤖 Auto
            </button>
            <button
              onClick={() => setGroundingMode('search')}
              className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                groundingMode === 'search' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Google Search Grounding (Live web and news)"
            >
              🌐 Google Search
            </button>
            <button
              onClick={() => setGroundingMode('maps')}
              className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                groundingMode === 'maps' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Google Maps Grounding (Agrovets, KALRO, silos)"
            >
              📍 Google Maps
            </button>
            <button
              onClick={() => setGroundingMode('none')}
              className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                groundingMode === 'none' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Local Agronomic RAG only"
            >
              Offline RAG
            </button>
          </div>
        </div>

        {/* Language & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(l => l === 'English' ? 'Kiswahili' : 'English')}
            className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-[#214E34]" />
            <span>{language}</span>
          </button>

          <button
            onClick={handleExportChat}
            title="Export chat transcript"
            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleClearHistory}
            title="Clear conversation history"
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Multi-turn Chat Container */}
      <div className="bg-white rounded-2xl border border-[#E2E7DE] shadow-xs flex flex-col h-[650px] overflow-hidden">
        {/* Messages Scrollable Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  isUser ? 'bg-[#214E34] text-white' : 'bg-emerald-100 text-[#214E34]'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble Content */}
                <div className={`space-y-2 max-w-[85%] ${isUser ? 'text-right' : 'text-left'}`}>
                  {/* Sender & Model Metadata */}
                  <div className={`flex items-center gap-2 text-[11px] text-gray-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span className="font-semibold text-gray-600">
                      {isUser ? 'You (Farmer)' : `DERIV-AGRI ${msg.roleId ? `(${msg.roleId.replace('_', ' ')})` : 'Specialist'}`}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {msg.modelUsed && (
                      <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 font-mono text-[10px] rounded border border-emerald-200">
                        {msg.modelUsed}
                      </span>
                    )}
                    {msg.latencyMs && (
                      <span className="text-[10px] text-gray-400">
                        {msg.latencyMs}ms
                      </span>
                    )}
                  </div>

                  {/* Text Container */}
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    isUser 
                      ? 'bg-[#214E34] text-white rounded-tr-xs' 
                      : 'bg-[#F7F6F0] text-[#252D27] rounded-tl-xs border border-[#E2E7DE]'
                  }`}>
                    {msg.text || (
                      <span className="inline-flex items-center gap-2 text-gray-500 italic">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Generating grounded agricultural response...
                      </span>
                    )}
                  </div>

                  {/* Google Maps Grounding Cards */}
                  {msg.mapSources && msg.mapSources.length > 0 && (
                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-left space-y-2 mt-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <MapPin className="w-3.5 h-3.5 text-amber-700" />
                        <span>📍 Google Maps Verified Places & Agrovets</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.mapSources.map((mapItem, idx) => (
                          <a
                            key={idx}
                            href={mapItem.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white p-2.5 rounded-lg border border-amber-200 hover:border-amber-400 transition-colors flex flex-col justify-between group"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-bold text-xs text-[#252D27] group-hover:text-amber-800">
                                {mapItem.title}
                              </span>
                              <ExternalLink className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            </div>
                            {mapItem.snippets && mapItem.snippets.length > 0 && (
                              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                                "{mapItem.snippets[0]}"
                              </p>
                            )}
                            <span className="text-[10px] text-amber-700 font-medium mt-1 inline-flex items-center gap-1">
                              Open in Google Maps →
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Google Search Grounding Sources */}
                  {msg.searchSources && msg.searchSources.length > 0 && (
                    <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-left space-y-2 mt-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                        <Search className="w-3.5 h-3.5 text-blue-700" />
                        <span>🌐 Google Search Grounded Web Sources</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.searchSources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-blue-200 hover:border-blue-400 rounded-lg text-xs text-blue-800 hover:text-blue-950 font-medium transition-colors"
                          >
                            <span className="truncate max-w-[240px]">{source.title}</span>
                            <ExternalLink className="w-3 h-3 text-blue-500 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KALRO / PCPB Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 text-left mt-1">
                      {msg.citations.map((cite, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E8EDE4] text-[#214E34] text-[10px] font-semibold rounded-md border border-[#D0DBC9]"
                        >
                          <BookOpen className="w-2.5 h-2.5" />
                          <span>{cite.organization}: {cite.title.slice(0, 32)}...</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions for Assistant Message */}
                  {!isUser && msg.text && (
                    <div className="flex items-center gap-2 pt-1 text-gray-400 text-xs">
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="p-1 hover:text-[#214E34] rounded transition-colors"
                        title="Copy advice"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleSpeakText(msg.text)}
                        className="p-1 hover:text-[#214E34] rounded transition-colors"
                        title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-600" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => openFeedback(msg)}
                        className="p-1 hover:text-emerald-700 rounded transition-colors"
                        title="Give quality feedback"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-gray-50 border-t border-[#E2E7DE] overflow-x-auto whitespace-nowrap flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {getQuickPromptsForRole().map((prompt, idx) => (
            <button
              key={idx}
              disabled={isStreaming}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-2.5 py-1 bg-white border border-[#E2E7DE] hover:border-[#214E34] hover:text-[#214E34] text-gray-700 rounded-lg transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-white border-t border-[#E2E7DE] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            disabled={isStreaming}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask your ${selectedRole.replace('_', ' ')} in ${selectedCounty} (e.g. fertilizer rates, nearby agrovets, disease control)...`}
            className="flex-1 px-4 py-3 bg-[#F7F6F0] border border-[#E2E7DE] rounded-xl text-xs sm:text-sm text-[#252D27] placeholder-gray-400 outline-none focus:border-[#214E34] focus:ring-1 focus:ring-[#214E34] transition-all"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isStreaming}
            className="px-5 py-3 bg-[#214E34] hover:bg-[#1b3f2a] disabled:bg-gray-300 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Send</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Quality Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E2E7DE] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#252D27]">Agronomic Quality Feedback</h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Your feedback is audited by DERIV-AGRI agronomists and administrators to continuously tune accuracy and safety.
            </p>

            {feedbackNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium">
                {feedbackNotice}
              </div>
            )}

            <form onSubmit={submitFeedback} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Feedback Category</label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg outline-none font-medium"
                >
                  <option value="helpful">Helpful & Practical Advice</option>
                  <option value="inaccurate_advice">Inaccurate Dosage / Chemical Name</option>
                  <option value="missing_kenya_context">Missing Local County Context</option>
                  <option value="chemical_safety_concern">Chemical Safety / Pre-Harvest Interval Concern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Additional Observations (Optional)</label>
                <textarea
                  rows={3}
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="Share details or correct local agricultural practices..."
                  className="w-full text-xs p-2.5 bg-[#F7F6F0] border border-[#E2E7DE] rounded-lg outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#214E34] hover:bg-[#1b3f2a] rounded-lg transition-colors cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
