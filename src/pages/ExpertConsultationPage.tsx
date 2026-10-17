import React, { useState } from 'react';
import { 
  Stethoscope, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Building2,
  Video,
  X
} from 'lucide-react';
import { ExpertProfile } from '../types';
import { SAMPLE_EXPERTS } from '../data/sampleExperts';

export const ExpertConsultationPage: React.FC = () => {
  const [experts] = useState<ExpertProfile[]>(SAMPLE_EXPERTS);
  const [selectedExpert, setSelectedExpert] = useState<ExpertProfile | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-10-18');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [farmSubject, setFarmSubject] = useState('Dairy nutrition & breeding synchronization');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setSelectedExpert(null);
      setBookingSuccess(false);
      alert('Consultation confirmed! An SMS confirmation with the Google Meet / phone link has been sent to your registered number.');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-stone-900 via-emerald-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/40 shadow-lg">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Stethoscope className="w-4 h-4" />
          <span>Registered Agronomists & Veterinary Surgeons Network</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Book One-on-One Consultations with Agricultural Specialists
        </h1>
        <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
          Get direct video, telephone, or on-farm advisory from certified KALRO scientists, Kenya Veterinary Board (KVB) licensed surgeons, and irrigation engineers.
        </p>
      </div>

      {/* Experts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {experts.map((exp) => (
          <div
            key={exp.id}
            className="p-5 bg-white rounded-3xl border border-stone-200 shadow-xs hover:border-emerald-600 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={exp.photoUrl}
                  alt={exp.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
                />
                <div>
                  <h3 className="font-bold text-sm text-stone-900">{exp.name}</h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {exp.specialization}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-stone-600 mb-4">
                <p className="flex items-center gap-1.5 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>{exp.institution}</span>
                </p>
                <p className="flex items-center gap-1.5 text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{exp.county} County</span>
                </p>
                <p className="text-[11px] text-stone-400">
                  Licence: <span className="font-mono text-stone-700 font-semibold">{exp.licenseNumber}</span>
                </p>
                <p className="text-[11px] text-stone-500">
                  Languages: {exp.languages.join(', ')}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-t border-stone-100">
                <div className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{exp.rating}</span>
                  <span className="text-stone-400 font-normal">({exp.consultationsCompleted})</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block font-medium">Session Fee</span>
                  <span className="font-extrabold text-sm text-emerald-950">
                    KSh {exp.consultationFeeKsh.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedExpert(exp)}
              className="mt-4 w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-300" />
              <span>Book Consultation</span>
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  Schedule Consultation with {selectedExpert.name}
                </h3>
                <p className="text-[11px] text-stone-500">{selectedExpert.title}</p>
              </div>
              <button onClick={() => setSelectedExpert(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Consultation Topic / Farm Challenge</label>
                <input
                  type="text"
                  required
                  value={farmSubject}
                  onChange={(e) => setFarmSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden cursor-pointer"
                  >
                    <option>09:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:30 AM</option>
                    <option>02:00 PM</option>
                    <option>04:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950 block">Consultation Fee</span>
                  <span className="text-[11px] text-emerald-800">45-minute structured video / voice call</span>
                </div>
                <span className="text-base font-black text-emerald-950">
                  KSh {selectedExpert.consultationFeeKsh.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedExpert(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingSuccess}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Video className="w-4 h-4" />
                  <span>{bookingSuccess ? 'Booking...' : 'Confirm Appointment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
