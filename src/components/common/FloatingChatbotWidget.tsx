import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Maximize2, 
  Loader2, 
  MapPin, 
  Search, 
  ExternalLink, 
  RotateCcw,
  Wheat,
  Stethoscope,
  FlaskConical,
  BarChart3,
  Languages
} from 'lucide-react';
import { apiService } from '../../services/api';
import { 
  ChatModelTier, 
  ChatbotRole, 
  GroundingMode, 
  MultiTurnChatMessage 
} from '../../types';

interface FloatingChatbotWidgetProps {
  currentCounty: string;
  onNavigateToFullChat: () => void;
}

export const FloatingChatbotWidget: React.FC<FloatingChatbotWidgetProps> = ({
  currentCounty,
  onNavigateToFullChat,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<ChatbotRole>('agronomist');
  const [model, setModel] = useState<ChatModelTier>('gemini-3.8-flash');
  const [language, setLanguage] = useState<'English' | 'Kiswahili'>('English');
  const [inputQuery, setInputQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const [messages, setMessages] = useState<MultiTurnChatMessage[]>([
    {
      id: 'float-init',
      role: 'assistant',
      text: `Habari ya mkulima! I'm your Gemini Agricultural Assistant for **${currentCounty}**.\nAsk me about fertilizer rates, PCPB-registered sprays, or nearby agrovets!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.8-flash',
      roleId: 'agronomist',
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isStreaming]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isStreaming) return;

    const userMsg: MultiTurnChatMessage = {
      id: `msg-fl-u-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantMsgId = `msg-fl-a-${Date.now()}`;
    const initialAssistantMsg: MultiTurnChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: model,
      roleId: role,
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, initialAssistantMsg]);
    setInputQuery('');
    setIsStreaming(true);

    const historyPayload = messages.slice(-6).map(m => ({
      role: m.role,
      text: m.text,
    }));

    await apiService.askFarmingAssistantStream(
      {
        message: textToSend,
        county: currentCounty,
        language,
        history: historyPayload,
        model,
        roleId: role,
        groundingMode: 'auto',
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
              modelUsed: data.modelUsed || model,
              groundingType: data.groundingType || 'none',
              searchSources: data.searchSources,
              mapSources: data.mapSources,
            };
          }
          return m;
        }));
      },
      (errorMsg) => {
        setIsStreaming(false);
        setMessages(prev => prev.map(m => {
          if (m.id === assistantMsgId) {
            return {
              ...m,
              isStreaming: false,
              text: m.text ? m.text : `[Error]: ${errorMsg}`,
              error: errorMsg,
            };
          }
          return m;
        }));
      }
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-[#214E34] hover:bg-[#1b3f2a] text-white rounded-full shadow-lg border border-emerald-400/40 transition-all hover:scale-105 cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
          </div>
          <span className="font-bold text-xs sm:text-sm">Ask Gemini Specialist</span>
          <span className="text-[10px] bg-emerald-700/60 text-emerald-200 px-1.5 py-0.5 rounded-full font-mono">
            3.8 Flash
          </span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-[#E2E7DE] w-[360px] sm:w-[420px] h-[540px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-[#214E34] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm leading-tight">Gemini Farm Assistant</h3>
                <p className="text-[10px] text-emerald-200">
                  {currentCounty} • {model}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-white/80">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigateToFullChat();
                }}
                title="Expand to Full Page"
                className="p-1 hover:text-white hover:bg-white/10 rounded cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1 hover:text-white hover:bg-white/10 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Role Persona Bar */}
          <div className="bg-gray-50 border-b border-[#E2E7DE] p-2 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                onClick={() => setRole('agronomist')}
                className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 cursor-pointer ${
                  role === 'agronomist' ? 'bg-[#214E34] text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Wheat className="w-3 h-3" />
                <span>Crops</span>
              </button>
              <button
                onClick={() => setRole('veterinarian')}
                className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 cursor-pointer ${
                  role === 'veterinarian' ? 'bg-[#214E34] text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Stethoscope className="w-3 h-3" />
                <span>Vet</span>
              </button>
              <button
                onClick={() => setRole('soil_scientist')}
                className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 cursor-pointer ${
                  role === 'soil_scientist' ? 'bg-[#214E34] text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FlaskConical className="w-3 h-3" />
                <span>Soil</span>
              </button>
              <button
                onClick={() => setRole('market_analyst')}
                className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 cursor-pointer ${
                  role === 'market_analyst' ? 'bg-[#214E34] text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                <span>Prices</span>
              </button>
            </div>

            <button
              onClick={() => setLanguage(l => l === 'English' ? 'Kiswahili' : 'English')}
              className="text-[10px] text-gray-500 hover:text-gray-900 font-bold px-1.5 py-0.5 rounded border border-gray-200"
            >
              {language === 'English' ? 'EN' : 'SW'}
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3 rounded-xl max-w-[88%] whitespace-pre-line leading-relaxed ${
                      isUser
                        ? 'bg-[#214E34] text-white rounded-br-xs'
                        : 'bg-[#F7F6F0] text-[#252D27] rounded-bl-xs border border-[#E2E7DE]'
                    }`}
                  >
                    {m.text || (
                      <span className="inline-flex items-center gap-1.5 text-gray-400 italic">
                        <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                      </span>
                    )}
                  </div>

                  {/* Google Maps Cards in Widget */}
                  {m.mapSources && m.mapSources.length > 0 && (
                    <div className="mt-1.5 space-y-1 w-[88%] text-left">
                      <div className="text-[10px] font-bold text-amber-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        <span>Google Maps Locations</span>
                      </div>
                      {m.mapSources.slice(0, 2).map((loc, i) => (
                        <a
                          key={i}
                          href={loc.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-amber-50/90 border border-amber-200 rounded p-1.5 text-[11px] text-amber-950 hover:bg-amber-100 transition-colors"
                        >
                          <div className="font-semibold flex items-center justify-between">
                            <span className="truncate">{loc.title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Google Search Sources in Widget */}
                  {m.searchSources && m.searchSources.length > 0 && (
                    <div className="mt-1.5 space-y-1 w-[88%] text-left">
                      <div className="text-[10px] font-bold text-blue-800 flex items-center gap-1">
                        <Search className="w-3 h-3 text-blue-600" />
                        <span>Search Grounded Sources</span>
                      </div>
                      {m.searchSources.slice(0, 2).map((src, i) => (
                        <a
                          key={i}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-blue-50/90 border border-blue-200 rounded p-1.5 text-[11px] text-blue-950 hover:bg-blue-100 transition-colors"
                        >
                          <div className="font-semibold flex items-center justify-between">
                            <span className="truncate">{src.title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-gray-400 mt-0.5 px-1">
                    {m.timestamp}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-gray-50 border-t border-[#E2E7DE] overflow-x-auto whitespace-nowrap flex items-center gap-1.5 text-[11px]">
            <button
              onClick={() => handleSend(`Nearby agrovets in ${currentCounty}`)}
              className="px-2 py-0.5 bg-white border border-[#E2E7DE] hover:border-[#214E34] text-gray-700 rounded text-[11px] shrink-0"
            >
              📍 Nearby Agrovets
            </button>
            <button
              onClick={() => handleSend(`Maize planting fertilizer schedule for ${currentCounty}`)}
              className="px-2 py-0.5 bg-white border border-[#E2E7DE] hover:border-[#214E34] text-gray-700 rounded text-[11px] shrink-0"
            >
              🌱 Fertilizer Rates
            </button>
            <button
              onClick={() => handleSend(`PCPB approved fall armyworm sprays`)}
              className="px-2 py-0.5 bg-white border border-[#E2E7DE] hover:border-[#214E34] text-gray-700 rounded text-[11px] shrink-0"
            >
              🐛 Armyworm Control
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-[#E2E7DE] flex items-center gap-1.5"
          >
            <input
              type="text"
              value={inputQuery}
              disabled={isStreaming}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask farming question..."
              className="flex-1 px-3 py-2 bg-[#F7F6F0] border border-[#E2E7DE] rounded-xl text-xs text-[#252D27] outline-none focus:border-[#214E34]"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isStreaming}
              className="p-2 bg-[#214E34] hover:bg-[#1b3f2a] disabled:bg-gray-300 text-white rounded-xl transition-colors cursor-pointer"
            >
              {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
