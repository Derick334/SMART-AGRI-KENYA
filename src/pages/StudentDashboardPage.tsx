import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Award, 
  Upload, 
  Calendar, 
  Search, 
  CheckCircle2, 
  Download, 
  ExternalLink,
  Plus,
  Sparkles,
  Layers
} from 'lucide-react';
import { agriStore } from '../services/store';
import { DigitalMembershipCard } from '../components/membership/DigitalMembershipCard';

import { UserProfile } from '../types';

interface StudentDashboardPageProps {
  user?: UserProfile;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ user }) => {
  const [currentUser] = useState(user || agriStore.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'projects' | 'training' | 'card'>('overview');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDomain, setProjectDomain] = useState('Soil Microbiology & Nitrogen Fixation');
  const [projectSummary, setProjectSummary] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  const [researchProjects, setResearchProjects] = useState([
    {
      id: 'proj-01',
      title: 'Drought Resilience in Indigenous Sorghum Genotypes in Kitui County',
      domain: 'Crop Genetics & Climate Adaptation',
      supervisor: 'Prof. J. K. Karimi (Egerton University / KALRO)',
      status: 'Active Field Trials',
      progressPercent: 70,
      submissionDate: '2026-02-14'
    },
    {
      id: 'proj-02',
      title: 'Efficacy of Trichoderma asperellum Bio-Fungicide against Maize Ear Rot',
      domain: 'Biological Pest & Disease Control',
      supervisor: 'Dr. Evans Mwangi (KEPHIS Muguga)',
      status: 'Peer Review',
      progressPercent: 90,
      submissionDate: '2026-01-20'
    }
  ]);

  const learningModules = [
    {
      id: 'mod-01',
      title: 'Advanced Soil pH Rectification in Kenyan Acidic Nitisols',
      category: 'Soil Science',
      duration: '4 Modules · 6 Hours',
      accreditation: 'CropNuts & KALRO Certified',
      link: '#soil-testing'
    },
    {
      id: 'mod-02',
      title: 'PCPB Guidelines on Pre-Harvest Intervals (PHI) in Horticulture',
      category: 'Pesticide Regulation',
      duration: '3 Modules · 4 Hours',
      accreditation: 'KEPHIS & PCPB Verified',
      link: '#pest-diagnosis'
    },
    {
      id: 'mod-03',
      title: 'FAO CROPWAT 8.0 & Solar Drip Irrigation Design',
      category: 'Agro-Hydrology',
      duration: '5 Modules · 8 Hours',
      accreditation: 'Water Resources Authority Compliant',
      link: '#irrigation'
    }
  ];

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProj = {
      id: `proj-${Date.now()}`,
      title: projectTitle,
      domain: projectDomain,
      supervisor: 'Faculty Academic Board',
      status: 'Under Evaluation',
      progressPercent: 15,
      submissionDate: new Date().toISOString().split('T')[0]
    };
    setResearchProjects([newProj, ...researchProjects]);
    setSubmittedNotice(`Project "${projectTitle}" submitted to National Agricultural Research Committee.`);
    setShowSubmitModal(false);
    setProjectTitle('');
    setProjectSummary('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#367C46] tracking-wider uppercase mb-1.5">
            <GraduationCap className="w-4 h-4 text-[#367C46]" />
            <span>Academic & Agricultural Research Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#214E34]">
            Student & Scholar Research Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#68756A] mt-1 max-w-xl">
            Access accredited KALRO publications, submit agricultural research proposals, and track learning modules across Kenya.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center gap-1.5 bg-[#214E34] hover:bg-[#183C27] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D6A545]" />
            <span>Submit Research Project</span>
          </button>
        </div>
      </div>

      {submittedNotice && (
        <div className="p-3.5 bg-[#EBF3ED] border border-[#CFD7CA] rounded-xl flex items-center justify-between text-xs text-[#214E34] font-semibold">
          <span>{submittedNotice}</span>
          <button onClick={() => setSubmittedNotice(null)} className="text-[#68756A] hover:text-[#252D27]">Dismiss</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E7DE] pb-2 text-xs font-bold overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Projects', icon: Layers },
          { id: 'resources', label: 'Research Library & Papers', icon: BookOpen },
          { id: 'training', label: 'Accredited Modules', icon: Award },
          { id: 'card', label: 'Digital Student ID', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                isActive 
                  ? 'bg-[#214E34] text-white shadow-xs' 
                  : 'bg-white text-[#68756A] border border-[#E2E7DE] hover:bg-[#F7F6F0]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D6A545]' : 'text-[#68756A]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-[#E2E7DE]">
              <span className="text-[11px] text-[#68756A] font-bold block uppercase">Active Projects</span>
              <span className="text-2xl font-black text-[#214E34] mt-1 block">{researchProjects.length}</span>
              <span className="text-[10px] text-[#367C46]">KALRO / Egerton Tracked</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E2E7DE]">
              <span className="text-[11px] text-[#68756A] font-bold block uppercase">Completed Modules</span>
              <span className="text-2xl font-black text-[#214E34] mt-1 block">3 / 5</span>
              <span className="text-[10px] text-[#367C46]">60% Completion</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E2E7DE]">
              <span className="text-[11px] text-[#68756A] font-bold block uppercase">Institutional Link</span>
              <span className="text-base font-extrabold text-[#214E34] mt-1 block truncate">
                {currentUser.institution || 'Egerton University'}
              </span>
              <span className="text-[10px] text-[#68756A]">Verified Scholar</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E2E7DE]">
              <span className="text-[11px] text-[#68756A] font-bold block uppercase">Membership Tier</span>
              <span className="text-base font-extrabold text-[#D6A545] mt-1 block">
                Research Scholar
              </span>
              <span className="text-[10px] font-mono text-[#214E34]">{currentUser.membershipCode || 'SA-2026-S8412'}</span>
            </div>
          </div>

          {/* Research Projects Table */}
          <div className="bg-white rounded-2xl p-6 border border-[#E2E7DE] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#214E34]">Submitted Agricultural Research Projects</h3>
              <span className="text-xs text-[#68756A]">2026 Academic Season</span>
            </div>

            <div className="space-y-3">
              {researchProjects.map((proj) => (
                <div key={proj.id} className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#367C46] uppercase tracking-wider">{proj.domain}</span>
                    <h4 className="font-extrabold text-sm text-[#252D27]">{proj.title}</h4>
                    <p className="text-[11px] text-[#68756A]">Supervisor: {proj.supervisor} · Submitted {proj.submissionDate}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-[#214E34] block">{proj.status}</span>
                      <span className="text-[10px] text-[#68756A]">{proj.progressPercent}% milestones reached</span>
                    </div>
                    <div className="w-16 h-2 bg-white rounded-full overflow-hidden border border-[#CFD7CA]">
                      <div className="h-full bg-[#367C46]" style={{ width: `${proj.progressPercent}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E7DE] space-y-4">
          <h3 className="font-extrabold text-base text-[#214E34]">Authoritative Agronomic Library (KALRO, KEPHIS, PCPB)</h3>
          <p className="text-xs text-[#68756A]">Free open access to certified seed varieties, crop pest thresholds, and soil nutrient indices.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              { title: 'National Maize Variety Release Catalog 2026', org: 'KEPHIS & Kenya Seed Co.', pages: '48 pages', format: 'PDF (2.4 MB)' },
              { title: 'Soil Acidity and Liming Guidelines for Kenyan Highlands', org: 'KALRO NARL Kabete', pages: '32 pages', format: 'PDF (1.8 MB)' },
              { title: 'Registered Pest Control Products for Horticultural Export', org: 'Pest Control Products Board', pages: '64 pages', format: 'PDF (3.1 MB)' },
              { title: 'Dairy Cattle Fodder Preservation: Silage & Hay Quality', org: 'ILRI / Ministry of Livestock', pages: '40 pages', format: 'PDF (2.2 MB)' }
            ].map((res, i) => (
              <div key={i} className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-extrabold text-[#252D27]">{res.title}</h4>
                  <p className="text-[11px] text-[#68756A]">{res.org} · {res.pages}</p>
                </div>
                <button className="p-2 bg-white rounded-lg border border-[#CFD7CA] text-[#214E34] hover:bg-[#EBF3ED] cursor-pointer">
                  <Download className="w-4 h-4 text-[#367C46]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Training Tab */}
      {activeTab === 'training' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E7DE] space-y-4">
          <h3 className="font-extrabold text-base text-[#214E34]">Accredited Online Agricultural Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learningModules.map((mod) => (
              <div key={mod.id} className="p-5 bg-[#F7F6F0] rounded-xl border border-[#E2E7DE] flex flex-col justify-between text-xs space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-[#367C46] uppercase">{mod.category}</span>
                  <h4 className="font-extrabold text-sm text-[#252D27] mt-1">{mod.title}</h4>
                  <p className="text-[11px] text-[#68756A] mt-1">{mod.duration}</p>
                  <p className="text-[10px] text-[#214E34] font-semibold mt-0.5">{mod.accreditation}</p>
                </div>
                <button className="w-full py-2 bg-[#214E34] text-white rounded-lg font-bold text-xs hover:bg-[#183C27] transition cursor-pointer">
                  Enroll in Module
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Digital Card Tab */}
      {activeTab === 'card' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E7DE] shadow-xs">
          <div className="text-center max-w-md mx-auto mb-6">
            <h3 className="text-lg font-extrabold text-[#214E34]">Student / Researcher Digital ID</h3>
            <p className="text-xs text-[#68756A] mt-1">Official identity card verifying your academic credentials and research access privileges.</p>
          </div>
          <DigitalMembershipCard user={currentUser} />
        </div>
      )}

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E2E7DE] shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E7DE]">
              <h3 className="font-black text-base text-[#214E34]">Submit New Research Proposal</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-[#68756A] hover:text-[#252D27]">✕</button>
            </div>
            <form onSubmit={handleProjectSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-[#252D27] mb-1">Research Project Title</label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Comparative Analysis of Bio-Fertilizer on Sorghum in Makueni"
                  className="w-full p-2.5 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-[#252D27] mb-1">Domain / Field</label>
                <select
                  value={projectDomain}
                  onChange={(e) => setProjectDomain(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl font-medium"
                >
                  <option value="Soil Microbiology & Nitrogen Fixation">Soil Microbiology & Nitrogen Fixation</option>
                  <option value="Drought-Tolerant Crop Genetics">Drought-Tolerant Crop Genetics</option>
                  <option value="Biological Pest & Disease Control">Biological Pest & Disease Control</option>
                  <option value="Dairy Nutrition & Milk Yield Optimization">Dairy Nutrition & Milk Yield Optimization</option>
                  <option value="Agro-Meteorology & Rainfall Modeling">Agro-Meteorology & Rainfall Modeling</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#252D27] mb-1">Abstract / Summary</label>
                <textarea
                  rows={3}
                  required
                  value={projectSummary}
                  onChange={(e) => setProjectSummary(e.target.value)}
                  placeholder="Summarize research methodology, target county, and expected farmer outcomes..."
                  className="w-full p-2.5 bg-[#F7F6F0] border border-[#CFD7CA] rounded-xl font-medium"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 border rounded-xl text-[#252D27] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#214E34] text-white rounded-xl font-bold hover:bg-[#183C27]"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
