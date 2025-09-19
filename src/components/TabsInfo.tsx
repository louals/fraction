import { useState } from 'react';
import PropertyDetails from './PropertyDetails';
import MapSection from './MapSection';
import FinancesTab from './Finances/FinancesTab';

type TabId = 'details' | 'finances' | 'performance' | 'documents';

// Tab configuration: each tab has an id and label
const TABS: { id: TabId; label: string }[] = [
  { id: 'details', label: 'Details' },
  { id: 'finances', label: 'Finances' },
  { id: 'performance', label: 'Performance' },
  { id: 'documents', label: 'Documents' },
];

export function TabsInfo() {
  // State to track which tab is currently active
  const [active, setActive] = useState<TabId>('details');

  return (
    <div>
      {/* Tabs bar */}
      <div className="inline-flex w-full items-center gap-3 rounded-2xl bg-fraction-light-50 p-6 border border-fraction-gray-400 shadow-sm">
        {TABS.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={[
                'rounded-full px-8 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-fraction-violet-500 text-white shadow'
                  : 'bg-white text-fraction-light-700 border border-gray-200 hover:bg-gray-50',
              ].join(' ')}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tabs content */}
      <section className="mt-4 bg-white p-8 ">
        {active === 'details' && (
          <div id="panel-details">
            {/* Property details section */}
            <PropertyDetails />

            {/* About + Map section */}
            <MapSection lat={40.7128} lng={-74.006} zoom={12} />
          </div>
        )}

        {active === 'finances' && (
          <div id="panel-finances" className="space-y-6">
            {/* Finances section */}
            <FinancesTab />
          </div>
        )}

        {active === 'performance' && (
          <div id="panel-performance">
            {/* Performance section */}
            <h2 className="text-lg font-semibold text-gray-900">Performance</h2>
            <p className="mt-1 text-sm text-gray-600">
              Key performance indicators (KPI).
            </p>
          </div>
        )}

        {active === 'documents' && (
          <div id="panel-documents">
            {/* Documents section */}
            <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
            <p className="mt-1 text-sm text-gray-600">
              Files and documents related to the product.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
