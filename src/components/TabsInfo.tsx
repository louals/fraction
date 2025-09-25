// Imports: bring in React state hook and feature tabs/components
import { useState } from 'react';
import PropertyDetails from './PropertyDetails';
import MapSection from './MapSection';
import FinancesTab from './Finances/FinancesTab';
import PerformanceTab from './PerformanceTab';
import DocumentsTab from './DocumentsTab';

// TabId: union type representing all valid tab identifiers
type TabId = 'details' | 'finances' | 'performance' | 'documents';

// TABS: static list of tabs rendered in the top bar (id used for state, label for UI)
const TABS: { id: TabId; label: string }[] = [
  { id: 'details', label: 'Details' },
  { id: 'finances', label: 'Finances' },
  { id: 'performance', label: 'Performance' },
  { id: 'documents', label: 'Documents' },
];

// TabsInfo: parent component controlling the active tab and rendering tab content
export function TabsInfo() {
  // active: holds the currently selected tab id
  const [active, setActive] = useState<TabId>('details');

  // performanceHistory: sample time-series data passed to PerformanceTab
  const performanceHistory = [
    { year: 2018, value: 820000 },
    { year: 2019, value: 860000 },
    { year: 2020, value: 905000 },
    { year: 2021, value: 980000 },
    { year: 2022, value: 1030000 },
    { year: 2023, value: 1065000 },
    { year: 2024, value: 1080000 },
    { year: 2025, value: 1100000 },
  ];

  return (
    <div>
      {/* Tabs bar: clickable pills to switch active tab */}
      <div className="inline-flex w-full items-center gap-3 rounded-2xl bg-fraction-light-50 p-6 border border-fraction-gray-500 shadow-sm">
        {TABS.map((t) => {
          const isActive = active === t.id; // compute active state per tab
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)} // update active tab on click
              className={[
                'rounded-full px-8 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-fraction-violet-500 text-white shadow' // active styling
                  : 'bg-white text-fraction-gray-650 border border-fraction-gray-280 hover:bg-gray-50', // inactive styling
              ].join(' ')}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tabs content: conditionally render the panel matching the active tab */}
      <section className="mt-4 bg-white">
        {active === 'details' && (
          <div id="panel-details">
            {/* Property details followed by the map centered on given coordinates */}
            <PropertyDetails />
            <MapSection lat={45.4501} lng={-73.4659} zoom={12} />
          </div>
        )}

        {active === 'finances' && (
          <div id="panel-finances" className="space-y-6">
            {/* Finance-related summary/cards/charts */}
            <FinancesTab />
          </div>
        )}

        {active === 'performance' && (
          <div id="panel-performance" className="space-y-6">
            {/* Performance: pass time-series history to chart/visuals */}
            <PerformanceTab history={performanceHistory} />
          </div>
        )}

        {active === 'documents' && (
          <div id="panel-documents">
            {/*  documents area */}
            <DocumentsTab />
          </div>
        )}
      </section>
    </div>
  );
}
