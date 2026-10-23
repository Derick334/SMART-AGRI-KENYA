
import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Lock,
  Activity,
  RefreshCw,
  LogOut,
  Users,
  Truck,
  CreditCard,
  ClipboardCheck,
  AlertTriangle,
} from 'lucide-react';

import { agriStore } from '../services/store';
import { KENYA_VEHICLES } from '../services/distanceCalculator';
import { SmartAgriLogo } from '../components/common/SmartAgriLogo';

type AdminTab =
  | 'overview'
  | 'verifications'
  | 'shipping_rates'
  | 'transactions';

type PendingFarmer = {
  id: string;
  name: string;
  farmName: string;
  county: string;
  crops: string;
  appliedAt: string;
};

export const AdminPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Re-read the current user when the page mounts.
  const [currentUser, setCurrentUser] = useState(
    () => agriStore.getCurrentUser()
  );

  const [pendingFarmers, setPendingFarmers] = useState<PendingFarmer[]>([]);
  const [vehicleRates, setVehicleRates] = useState(() =>
    KENYA_VEHICLES.map((vehicle) => ({ ...vehicle }))
  );

  const stats = agriStore.getAdminStats();

  useEffect(() => {
    setCurrentUser(agriStore.getCurrentUser());
  }, []);

  const showNotice = (message: string) => {
    setNotice(message);
    setError('');
  };

  const showError = (message: string) => {
    setError(message);
    setNotice('');
  };

  const refreshPage = () => {
    setCurrentUser(agriStore.getCurrentUser());
    window.location.reload();
  };

  // Frontend check improves navigation only.
  // Real administrator access MUST also be enforced by the backend.
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-[#F7F6F0]">
        <section className="w-full max-w-md bg-white rounded-2xl border border-[#E2E7DE] shadow-sm p-7 text-center space-y-5">
          <div className="flex justify-center">
            <SmartAgriLogo variant="full" size="md" />
          </div>

          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-[#214E34]">
              Administrator Access Required
            </h1>
            <p className="text-sm text-[#68756A] mt-2 leading-6">
              This area is restricted to authorized SMART-AGRI KENYA administrators.
              Sign in with an authorized account to continue.
            </p>
          </div>

          <div className="bg-[#F7F6F0] border border-[#E2E7DE] rounded-xl p-4 text-left">
            <div className="flex gap-3 items-start">
              <Lock className="w-5 h-5 text-[#214E34] shrink-0" />
              <div>
                <p className="font-bold text-sm text-[#214E34]">
                  Protected administration
                </p>
                <p className="text-xs text-[#68756A] mt-1 leading-5">
                  Role changes made in the browser are not accepted as proof of
                  administrator authorization. Access must be verified by the
                  authentication provider and backend.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              window.location.assign('/login');
            }}
            className="w-full bg-[#214E34] hover:bg-[#183C27] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Go to Secure Login
          </button>

          <button
            onClick={refreshPage}
            className="text-sm text-[#367C46] font-semibold flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh authorization status
          </button>
        </section>
      </main>
    );
  }

  // Do not display fabricated personal or payment information.
  // Connect these actions to authenticated backend endpoints before use.
  const performAdminAction = async (
    action: 'approve' | 'reject' | 'save-rate',
    id: string
  ) => {
    setLoading(true);
    setNotice('');
    setError('');

    try {
      // No fake success: this component has no verified admin API.
      // Add your authenticated backend request here.
      void action;
      void id;

      throw new Error(
        'Administrative backend is not configured. No changes were saved.'
      );
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : 'The operation could not be completed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    {
      id: 'verifications',
      label: 'Farmer Verifications',
      icon: <ClipboardCheck className="w-4 h-4" />,
    },
    {
      id: 'shipping_rates',
      label: 'Shipping Rates',
      icon: <Truck className="w-4 h-4" />,
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: <CreditCard className="w-4 h-4" />,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7F6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {notice && (
          <div
            role="status"
            className="p-4 bg-green-50 border border-green-200 text-green-900 rounded-xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{notice}</span>
            <button
              onClick={() => setNotice('')}
              className="ml-auto"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div className="text-sm">{error}</div>
            <button
              onClick={() => setError('')}
              className="ml-auto"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <header className="bg-white rounded-2xl border border-[#E2E7DE] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#367C46] mb-3">
                <ShieldAlert className="w-4 h-4" />
                Central Operations
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#214E34]">
                SMART-AGRI KENYA
              </h1>

              <h2 className="text-lg font-semibold text-[#252D27] mt-1">
                Administration Dashboard
              </h2>

              <p className="text-sm text-[#68756A] mt-2">
                Signed-in account: {currentUser.email || currentUser.name}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50">
                <Activity className="w-4 h-4 text-amber-700" />
                <div>
                  <p className="text-xs font-bold text-amber-900">
                    Backend verification required
                  </p>
                  <p className="text-[11px] text-amber-800">
                    Live health status unavailable
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  window.location.assign('/login');
                }}
                className="p-3 rounded-xl border border-[#E2E7DE] bg-white hover:bg-gray-50"
                aria-label="Return to login"
                title="Return to login"
              >
                <LogOut className="w-5 h-5 text-[#214E34]" />
              </button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: 'Registered Users',
              value: stats.totalUsers,
              detail: `${stats.verifiedFarmers} verified farmers`,
              icon: <Users className="w-5 h-5" />,
            },
            {
              label: 'Marketplace Volume',
              value: `KSh ${stats.totalVolumeKsh.toLocaleString()}`,
              detail: 'Store-reported volume',
              icon: <CreditCard className="w-5 h-5" />,
            },
            {
              label: 'Pending Verifications',
              value: pendingFarmers.length,
              detail: 'Live data requires backend',
              icon: <ClipboardCheck className="w-5 h-5" />,
            },
            {
              label: 'Soil Tests Processed',
              value: stats.soilTestsCompleted,
              detail: 'Store-reported total',
              icon: <Activity className="w-5 h-5" />,
            },
          ].map((item) => (
            <article
              key={item.label}
              className="bg-white border border-[#E2E7DE] rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold uppercase tracking-wide text-[#68756A]">
                  {item.label}
                </p>
                <span className="text-[#367C46]">{item.icon}</span>
              </div>

              <p className="text-2xl font-extrabold text-[#214E34] mt-4 break-words">
                {item.value.toLocaleString()}
              </p>

              <p className="text-xs text-[#68756A] mt-2">{item.detail}</p>
            </article>
          ))}
        </section>

        <nav className="flex gap-2 overflow-x-auto pb-2" aria-label="Admin navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setError('');
                setNotice('');
              }}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 rounded-xl border text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-[#214E34] text-white border-[#214E34]'
                  : 'bg-white text-[#252D27] border-[#E2E7DE] hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'overview' && (
          <section className="bg-white rounded-2xl border border-[#E2E7DE] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-[#214E34]">
              Operations Overview
            </h3>

            <p className="text-sm text-[#68756A] mt-2 leading-6">
              Review platform statistics and use the navigation above to access
              administrative sections. Approval actions, payment records, and
              configuration changes must be connected to a protected backend
              before they can modify production data.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#F7F6F0] border border-[#E2E7DE] p-5">
                <ClipboardCheck className="w-6 h-6 text-[#367C46]" />
                <h4 className="font-bold mt-3">Farmer verification</h4>
                <p className="text-sm text-[#68756A] mt-1">
                  Review real applications after connecting the verification API.
                </p>
                <button
                  onClick={() => setActiveTab('verifications')}
                  className="mt-4 text-sm font-bold text-[#367C46]"
                >
                  Open verifications →
                </button>
              </div>

              <div className="rounded-xl bg-[#F7F6F0] border border-[#E2E7DE] p-5">
                <Truck className="w-6 h-6 text-[#367C46]" />
                <h4 className="font-bold mt-3">Shipping configuration</h4>
                <p className="text-sm text-[#68756A] mt-1">
                  Review current vehicle tariffs. Changes are not saved by this
                  demonstration component.
                </p>
                <button
                  onClick={() => setActiveTab('shipping_rates')}
                  className="mt-4 text-sm font-bold text-[#367C46]"
                >
                  Open shipping rates →
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'verifications' && (
          <section className="bg-white rounded-2xl border border-[#E2E7DE] p-6">
            <h3 className="text-lg font-bold text-[#214E34]">
              Farmer Verification Queue
            </h3>

            <p className="text-sm text-[#68756A] mt-2">
              Connect this panel to your protected database endpoint to retrieve
              real applications. No invented identity records are displayed.
            </p>

            {pendingFarmers.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardCheck className="w-10 h-10 text-[#367C46] mx-auto" />
                <p className="font-semibold mt-3">No application records loaded</p>
                <p className="text-sm text-[#68756A] mt-1">
                  This does not mean there are no pending applications.
                </p>
              </div>
            ) : (
              <div className="mt-5 divide-y divide-[#E2E7DE]">
                {pendingFarmers.map((farmer) => (
                  <article key={farmer.id} className="py-4">
                    <h4 className="font-bold">{farmer.name}</h4>
                    <p className="text-sm text-[#68756A]">
                      {farmer.farmName} · {farmer.county}
                    </p>
                    <p className="text-xs text-[#68756A] mt-1">
                      {farmer.crops} · Applied {farmer.appliedAt}
                    </p>

                    <div className="flex gap-2 mt-4">
                      <button
                        disabled={loading}
                        onClick={() => performAdminAction('approve', farmer.id)}
                        className="bg-[#214E34] text-white rounded-lg px-4 py-2 text-sm disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={loading}
                        onClick={() => performAdminAction('reject', farmer.id)}
                        className="border border-[#E2E7DE] rounded-lg px-4 py-2 text-sm disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'shipping_rates' && (
          <section className="bg-white rounded-2xl border border-[#E2E7DE] p-6">
            <h3 className="text-lg font-bold text-[#214E34]">
              Shipping Rates
            </h3>
            <p className="text-sm text-[#68756A] mt-2 mb-5">
              Current values from KENYA_VEHICLES. Persistent editing requires a
              protected backend endpoint.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-[#F7F6F0] text-[#68756A]">
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Base fare</th>
                    <th className="p-3">Per km</th>
                    <th className="p-3">Capacity</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleRates.map((vehicle) => (
                    <tr key={vehicle.type} className="border-t border-[#E2E7DE]">
                      <td className="p-3 font-semibold">
                        {vehicle.label}
                        <p className="text-xs text-[#68756A] font-normal mt-1">
                          {vehicle.description}
                        </p>
                      </td>
                      <td className="p-3">
                        KSh {vehicle.baseFareKsh.toLocaleString()}
                      </td>
                      <td className="p-3">
                        KSh {vehicle.ratePerKmKsh}/km
                      </td>
                      <td className="p-3">
                        {vehicle.maxWeightKg.toLocaleString()} kg
                      </td>
                      <td className="p-3">
                        <button
                          disabled={loading}
                          onClick={() =>
                            performAdminAction('save-rate', String(vehicle.type))
                          }
                          className="border border-[#E2E7DE] rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50"
                        >
                          Configure
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'transactions' && (
          <section className="bg-white rounded-2xl border border-[#E2E7DE] p-6">
            <h3 className="text-lg font-bold text-[#214E34]">
              Payment Transactions
            </h3>

            <p className="text-sm text-[#68756A] mt-2 leading-6">
              No live M-Pesa transactions are shown because this component has
              no verified payment API connection. Connect the Daraja callback
              and transaction database before displaying payment status,
              settlement references, or escrow balances.
            </p>

            <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
              <p className="text-sm text-amber-900">
                Never mark a payment as settled based only on frontend state.
                Verify payment results through your trusted backend.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};
