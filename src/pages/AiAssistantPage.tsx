import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Languages
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
      text: `Habari! I am your SMART-AGRI KENYA Agricultural Extension Specialist.\n\nI can assist you with:\n• Crop husbandry, certified seeds, and fertilizer schedules (DAP, CAN, NPK)\n• Dairy cow management, pedigree genetics, and milk yield improvement\n• Tick-borne and Newcastle disease prevention\n• Soil acidity neutralization and agricultural lime application\n• Kenya wholesale market price trends\n\nHow can I assist your farm in ${selectedCounty} today? (Unaweza kuuliza kwa Kiswahili au Kiingereza)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
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
          text: 'Unable to reach the agricultural extension knowledge base. Please verify your connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-[#E2E7DE] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#367C46] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#367C46]" />
              <span>Agricultural Extension Advisory</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#214E34]">
              SMART-AGRI Farming & Agronomy Specialist
            </h1>
            <p className="text-xs sm:text-sm text-[#68756A] mt-0.5">
              Agronomic and veterinary advisories calibrated to your Kenyan agro-ecological zone.
            </p>
          </div>

          {/* Context Options */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCounty}
              onChange={(e) => onSelectCounty(e.target.value)}
              className="bg-[#F7F6F0] border border-[#E2E7DE] text-[#252D27] text-xs font-semibold px-3 py-1.5 rounded-lg focus:outline-none cursor-pointer"
            >
              {KENYA_COUNTIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name} County
                </option>
              ))}
            </select>

            <button
              onClick={() => setLanguage(language === 'English' ? 'Swahili' : 'English')}
              className="bg-[#F7F6F0] hover:bg-[#EBF3ED] text-[#214E34] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#E2E7DE] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Languages className="w-3.5 h-3.5 text-[#367C46]" />
              <span>{language === 'English' ? 'English (EN)' : 'Kiswahili (SW)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Display Box */}
      <div className="bg-white rounded-xl border border-[#E2E7DE] shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-[#EBF3ED] border border-[#CFD7CA] text-[#214E34] flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-3.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#214E34] text-white font-medium'
                    : 'bg-[#F7F6F0] border border-[#E2E7DE] text-[#252D27] whitespace-pre-line'
                }`}
              >
                {m.text}
                <span className={`block text-[10px] mt-1.5 ${m.sender === 'user' ? 'text-[#E2E7DE] text-right' : 'text-[#68756A]'}`}>
                  {m.timestamp}
                </span>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[#367C46] text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-[#68756A]">
              <div className="w-7 h-7 rounded-lg bg-[#EBF3ED] text-[#214E34] flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#F7F6F0] border border-[#E2E7DE] p-2.5 rounded-lg">
                Consulting Kenyan agronomy recommendations...
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-[#F7F6F0] border-t border-[#E2E7DE] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-[#68756A] uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="bg-white hover:bg-[#EBF3ED] text-[#252D27] hover:text-[#214E34] text-[11px] font-medium px-2.5 py-1 rounded-md border border-[#E2E7DE] transition shrink-0 cursor-pointer shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-[#E2E7DE] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask about crops, pests, soil fertility, or cattle in ${selectedCounty}...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 p-2.5 rounded-lg bg-[#F7F6F0] border border-[#E2E7DE] text-xs text-[#252D27] placeholder:text-[#68756A] focus:border-[#367C46] focus:outline-none"
            />

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="bg-[#367C46] hover:bg-[#2B6437] disabled:opacity-50 text-white p-2.5 rounded-lg font-semibold transition shadow-xs flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
