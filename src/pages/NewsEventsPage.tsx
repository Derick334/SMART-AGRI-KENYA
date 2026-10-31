import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  ArrowRight,
  Share2,
  Bookmark,
  Sparkles,
  Search,
  User,
  CheckCircle2
} from 'lucide-react';

interface NewsEventsPageProps {
  onSelectTab: (tabId: string) => void;
}

export const NewsEventsPage: React.FC<NewsEventsPageProps> = ({ onSelectTab }) => {
  const [filter, setFilter] = useState<'all' | 'news' | 'events'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rsvpdEvents, setRsvpdEvents] = useState<string[]>([]);

  const articles = [
    {
      id: 'news-1',
      type: 'news',
      tag: 'Policy & Subsidy',
      title: 'National Fertilizer Subsidy Distribution Commences for 2026 Long Rains',
      summary: 'The Ministry of Agriculture has officially flagged off 1.4 million 50kg bags of subsidized planting fertilizer (DAP & NPK) across 47 National Cereals and Produce Board (NCPB) depots nationwide.',
      date: 'March 28, 2026',
      readTime: '4 min read',
      source: 'Ministry of Agriculture & Livestock Development',
      imageUrl: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'news-2',
      type: 'news',
      tag: 'Pest Surveillance',
      title: 'KALRO Issues High Alert for Fall Armyworm Oviposition in South Rift Zones',
      summary: 'Due to recent intermittent showers coupled with elevated evening relative humidity (84%), agricultural field monitors have noted increased Fall Armyworm egg clusters on early maize plantings.',
      date: 'March 26, 2026',
      readTime: '3 min read',
      source: 'KALRO Plant Pathology Directorate',
      imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'news-3',
      type: 'news',
      tag: 'Seed Innovation',
      title: 'KEPHIS Certifies Four New High-Yield, Drought-Tolerant Bean Varieties',
      summary: 'Kenya Plant Health Inspectorate Service has gazetted four climber bean varieties resistant to root rot and angular leaf spot, yielding up to 18 bags per acre with 85-day maturation periods.',
      date: 'March 22, 2026',
      readTime: '5 min read',
      source: 'KEPHIS National Variety Release Office',
      imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const events = [
    {
      id: 'event-1',
      type: 'event',
      tag: 'Field School',
      title: 'Practical Drip Irrigation & Solar Water Pumping Demonstration',
      location: 'KALRO Njoro Station, Nakuru County',
      date: 'April 4, 2026',
      time: '09:00 AM – 02:00 PM EAT',
      instructor: 'Eng. David Chege & Dr. Beatrice Wanjiku (KALRO Water Resources)',
      capacity: '60 Farmers (34 spots remaining)',
      price: 'Free Admission (RSVP Required)'
    },
    {
      id: 'event-2',
      type: 'event',
      tag: 'Veterinary Clinic',
      title: 'Dairy Herd Fertility, Artificial Insemination & Mastitis Control Workshop',
      location: 'Kipchimchim Cooperative Union Grounds, Kericho County',
      date: 'April 9, 2026',
      time: '10:00 AM – 03:30 PM EAT',
      instructor: 'Dr. Evans Kiprono, BVM (Kenya Veterinary Board Certified)',
      capacity: '100 Pastoralists & Smallholders',
      price: 'Free'
    },
    {
      id: 'event-3',
      type: 'event',
      tag: 'Webinar',
      title: 'Online Masterclass: Export Grade Avocado & French Bean Standards',
      location: 'Live Virtual Session (SMART-AGRI Webinar Room)',
      date: 'April 14, 2026',
      time: '04:00 PM – 06:00 PM EAT',
      instructor: 'Horticultural Crops Directorate (HCD) Quality Inspectors',
      capacity: '500 Virtual Attendees',
      price: 'Free'
    }
  ];

  const toggleRsvp = (eventId: string) => {
    if (rsvpdEvents.includes(eventId)) {
      setRsvpdEvents(rsvpdEvents.filter(id => id !== eventId));
    } else {
      setRsvpdEvents([...rsvpdEvents, eventId]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1b432a] via-[#214E34] to-[#2b6443] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-emerald-200 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Agricultural Intelligence & Extension Calendar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            News, Field Schools & Farmer Training
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Stay informed with verified national policy announcements, pest surveillance warnings, new seed certifications, and hands-on regional farmer field training days across Kenya.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === 'all'
                ? 'bg-[#214E34] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All Updates
          </button>
          <button
            onClick={() => setFilter('news')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === 'news'
                ? 'bg-[#214E34] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Agricultural News & Bulletins
          </button>
          <button
            onClick={() => setFilter('events')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === 'events'
                ? 'bg-[#214E34] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Farmer Field Trainings ({events.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search news & workshops..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#214E34]"
          />
        </div>
      </div>

      {/* Content: News Articles */}
      {(filter === 'all' || filter === 'news') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Latest National Agricultural News</h2>
            <span className="text-xs text-gray-500">Curated from KALRO, KEPHIS & MoALD</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map(art => (
              <div
                key={art.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {art.tag}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <span>{art.date}</span>
                      <span>·</span>
                      <span>{art.readTime}</span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                      {art.title}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                  <span className="truncate max-w-[180px] text-gray-500 text-[10px]">{art.source}</span>
                  <button
                    onClick={() => onSelectTab('contact')}
                    className="flex items-center gap-1 hover:text-[#214E34] cursor-pointer"
                  >
                    <span>Read Advisory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content: Events & Field Schools */}
      {(filter === 'all' || filter === 'events') && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Farmer Training & Field School Calendar</h2>
              <p className="text-xs text-gray-500">Hands-on workshops, demonstration plots, and clinical seminars</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map(ev => {
              const isRsvpd = rsvpdEvents.includes(ev.id);
              return (
                <div
                  key={ev.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {ev.tag}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {ev.price}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm leading-snug">
                      {ev.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-semibold text-gray-800">{ev.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{ev.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{ev.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">{ev.instructor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-gray-100 mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-medium">{ev.capacity}</span>
                    <button
                      onClick={() => toggleRsvp(ev.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isRsvpd
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-[#214E34] hover:bg-[#1a3e29] text-white shadow-xs'
                      }`}
                    >
                      {isRsvpd ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Seat Reserved</span>
                        </>
                      ) : (
                        <>
                          <span>Reserve Seat</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
