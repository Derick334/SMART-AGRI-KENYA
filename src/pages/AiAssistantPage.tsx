import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  MapPin, 
  Sprout, 
  Beef, 
  Loader2, 
  Languages, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { api } from '../services/api';
import { KENYA_COUNTIES } from '../data/kenyaCounties';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isFallback?: boolean;
}

interface AiAssistantPageProps {
  selectedCounty: string;
  onSelectCounty: (county: string) => void;
}

export const AiAssistantPage: React.FC<AiAssistantPageProps> = ({
  selectedCounty,
  onSelectCounty,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Habari! I am your SMART-AGRI KENYA Senior Agricultural Specialist.\n\nI can assist you with:\n• Crop husbandry, certified seeds, and fertilizer schedules (DAP, CAN, NPK)\n• Dairy cow management, pedigree genetics, and milk yield improvement\n• Tick-borne and Newcastle disease prevention\n• Soil acidity neutralization and lime application\n• Kenya wholesale market price trends\n\nHow can I help your farm in ${selectedCounty} today? (Unaweza kuuliza kwa Kiswahili au Kiingereza)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedLivestock, setSelectedLivestock] = useState('');
  const [language, setLanguage] = useState<'English' | 'Swahili'>('English');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    `Recommended fertilizer schedule for maize in ${selectedCounty}`,
    `How to boost dairy milk yield from 15L to 30L/day`,
    `Signs and PCPB control for Fall Armyworm`,
    `How much agricultural lime is needed for acidic soil?`,
    `Ni mbegu gani bora ya mahindi kupanda msimu huu?`,
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await api.askFarmingAssistant({
        message: textToSend,
        county: selectedCounty,
        crop: selectedCrop || undefined,
        livestock: selectedLivestock || undefined,
        language,
      });

      const assistantMsg: Message = {
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: response.isFallback,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Unable to reach the agricultural knowledge service. Please check your connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Header */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 border border-emerald-800 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 fill-emerald-400" />
              <span>AI Agricultural Extension Officer (Powered by Gemini)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              SMART-AGRI Farming & Agronomy Assistant
            </h1>
            <p className="text-xs text-emerald-200 mt-0.5">
              Science-grounded agronomic and veterinary advice tailored to your Kenyan county's agro-ecological zone.
            </p>
          </div>

          {/* Context Options */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCounty}
              onChange={(e) => onSelectCounty(e.target.value)}
              className="bg-emerald-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-700 cursor-pointer"
            >
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name} className="text-stone-900 bg-white">
                  {c.name} County
                </option>
              ))}
            </select>

            <button
              onClick={() => setLanguage(language === 'English' ? 'Swahili' : 'English')}
              className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-600 flex items-center gap-1 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{language === 'English' ? 'English (EN)' : 'Kiswahili (SW)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Display Box */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col h-[520px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-700 text-white font-medium rounded-tr-none'
                    : 'bg-stone-50 border border-stone-200 text-stone-900 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {m.text}
                <span className={`block text-[9px] mt-1.5 ${m.sender === 'user' ? 'text-emerald-200 text-right' : 'text-stone-400'}`}>
                  {m.timestamp}
                </span>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-stone-500">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-stone-100 p-3 rounded-2xl animate-pulse">
                Consulting Kenyan agricultural agronomy database...
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 text-[11px] font-medium px-2.5 py-1 rounded-full border border-stone-200 transition shrink-0 cursor-pointer shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask about crops, pests, soil, or livestock in ${selectedCounty}...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:border-emerald-600 focus:outline-hidden"
            />

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white p-3 rounded-2xl font-bold transition shadow-xs flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
