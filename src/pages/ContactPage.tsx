import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldAlert,
  Building2 
} from 'lucide-react';
import { KENYA_COUNTIES } from '../data/kenyaCounties';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [county, setCounty] = useState('Nairobi');
  const [subject, setSubject] = useState('Marketplace inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      alert('Thank you! Your ticket has been logged with the SMART-AGRI Kenya Support Desk (Ticket #SA-TK-' + Math.floor(1000 + Math.random() * 9000) + '). An agent will contact you shortly.');
      setSubmitted(false);
    }, 1000);
  };

  const regionalOffices = [
    { city: 'Nairobi HQ Hub', address: 'Agricultural Information Resource Centre, Waiyaki Way, Kabete', phone: '+254 700 000 001' },
    { city: 'Eldoret North Rift Hub', address: 'KFA Building, Uganda Road, Eldoret CBD', phone: '+254 700 000 002' },
    { city: 'Nakuru Central Rift Hub', address: 'Geoffrey Kamau Way, Top Market Complex, Nakuru', phone: '+254 700 000 003' },
    { city: 'Kisumu Lake Basin Hub', address: 'Mega Plaza 3rd Floor, Oginga Odinga Street, Kisumu', phone: '+254 700 000 004' },
    { city: 'Mombasa Coastal Hub', address: 'Kongowea Agribusiness Centre, Nyali Links Rd, Mombasa', phone: '+254 700 000 005' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Contact SMART-AGRI KENYA Support Desk
        </h1>
        <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
          Need assistance with seller registration, M-Pesa transaction reconciliation, soil sample collection, or livestock transport? Our agricultural support team operates across all 47 counties.
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2 bg-emerald-950 text-emerald-300 border border-emerald-800 px-3.5 py-1.5 rounded-full font-bold">
            <Phone className="w-4 h-4" />
            <span>Toll-Free Farmer Hotline: 0800 721 000</span>
          </div>
          <div className="flex items-center gap-2 bg-stone-800 text-stone-300 px-3.5 py-1.5 rounded-full">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Mon - Sat: 6:00 AM – 8:00 PM EAT</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Support Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-stone-900">Send an Inquiry or Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Safaricom Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XXXXXXXX"
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">County of Operation</label>
                <select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden cursor-pointer"
                >
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c.code} value={c.name}>{c.name} County</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Subject of Inquiry</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden cursor-pointer"
              >
                <option value="Marketplace inquiry">Marketplace Buying / Selling Inquiry</option>
                <option value="M-Pesa payment issue">M-Pesa Payment or Payout Reconciliation</option>
                <option value="Soil lab sample tracking">Soil Testing Sample Tracking (KALRO)</option>
                <option value="Livestock transport issue">Livestock Carrier & Transit Movement Permit</option>
                <option value="Fraud / Counterfeit complaint">Report Suspicious Trader / Counterfeit Seed</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Detailed Message</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question, order reference, or farm issue..."
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-emerald-300" />
              <span>{submitted ? 'Submitting Ticket...' : 'Send Message'}</span>
            </button>
          </form>
        </div>

        {/* Regional Hubs & Emergency Call Centers */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-stone-900">Regional Agricultural Hubs</h2>

          <div className="space-y-2.5 text-xs">
            {regionalOffices.map((off, idx) => (
              <div key={idx} className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
                <span className="font-bold text-stone-900 block">{off.city}</span>
                <p className="text-stone-500 flex items-start gap-1.5 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{off.address}</span>
                </p>
                <p className="text-emerald-800 font-semibold font-mono text-[11px] pt-1">
                  📞 {off.phone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
