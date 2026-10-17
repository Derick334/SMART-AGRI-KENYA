import React from 'react';
import { 
  Sprout, 
  ShieldCheck, 
  Users, 
  Truck, 
  CheckCircle2, 
  Award, 
  Globe2, 
  Cpu 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Sprout className="w-4 h-4 text-emerald-700" />
          <span>About SMART-AGRI KENYA</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight">
          Transforming Kenya's Agricultural Wealth Through Technology
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
          SMART-AGRI KENYA is an integrated digital ecosystem built to remove middlemen margins, democratize scientific soil testing, provide instant pest diagnosis, and connect growers directly with consumers and institutional buyers.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Users className="w-6 h-6 text-emerald-700" />
          </div>
          <h3 className="font-bold text-base text-stone-900">Direct Farmer-to-Consumer Trade</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Eliminating unnecessary middlemen exploitation so Kenyan farmers retain up to 85% of market value for their maize, potatoes, avocados, and dairy produce.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
            <Cpu className="w-6 h-6 text-sky-700" />
          </div>
          <h3 className="font-bold text-base text-stone-900">KALRO & AI Science Grounding</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Integrating accredited soil testing laboratories (NARL, CropNuts) and Gemini multimodal artificial intelligence for symptom verification and PCPB registered active ingredients.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Truck className="w-6 h-6 text-amber-700" />
          </div>
          <h3 className="font-bold text-base text-stone-900">Transparent Highway Logistics</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Grounded in KeNHA road distance matrices, connecting verified local boda boda riders, canters, and specialized animal transporters with live tracking.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
          </div>
          <h3 className="font-bold text-base text-stone-900">M-Pesa Daraja Escrow Protection</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Funds are held in trusted escrow until the buyer inspects and approves the delivered produce or livestock at the designated pickup point.
          </p>
        </div>
      </div>

      {/* Institutional Partnerships */}
      <div className="p-8 bg-stone-900 text-white rounded-3xl space-y-4">
        <h3 className="text-base font-bold text-emerald-400 uppercase tracking-wider text-center">
          Aligned with Kenyan Agricultural Authorities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs text-stone-300">
          <div className="p-3 bg-stone-800/60 rounded-2xl border border-stone-700">
            <p className="font-bold text-white text-sm">KALRO</p>
            <span className="text-[10px] text-stone-400">Agricultural Research</span>
          </div>
          <div className="p-3 bg-stone-800/60 rounded-2xl border border-stone-700">
            <p className="font-bold text-white text-sm">KEPHIS</p>
            <span className="text-[10px] text-stone-400">Plant Health & Seed</span>
          </div>
          <div className="p-3 bg-stone-800/60 rounded-2xl border border-stone-700">
            <p className="font-bold text-white text-sm">PCPB</p>
            <span className="text-[10px] text-stone-400">Pest Control Products</span>
          </div>
          <div className="p-3 bg-stone-800/60 rounded-2xl border border-stone-700">
            <p className="font-bold text-white text-sm">KVB</p>
            <span className="text-[10px] text-stone-400">Veterinary Board</span>
          </div>
        </div>
      </div>
    </div>
  );
};
