import { useState } from 'react';
import PropertyDetails from './PropertyDetails';

type TabId = 'details' | 'finances' | 'performance' | 'documents';

const TABS: { id: TabId; label: string }[] = [
  { id: 'details', label: 'Details' },
  { id: 'finances', label: 'Finances' },
  { id: 'performance', label: 'Performance' },
  { id: 'documents', label: 'Documents' },
];

export function TabsInfo() {
  const [active, setActive] = useState<TabId>('details');

  return (
    <div>
      {/* Barre des onglets */}
      <div
        role="tablist"
        aria-label="Sections"
        className="inline-flex w-full items-center gap-3 rounded-2xl bg-fraction-light-50 p-4 border border-fraction-gray-400 shadow-sm"
      >
        {TABS.map((t) => {
          const isActive = active === t.id;

          const baseBtn =
            'rounded-full px-8 py-2 text-sm font-medium transition focus:outline-none ' +
            'focus-visible:ring-2 focus-visible:ring-fraction-lilac-400 focus-visible:ring-offset-2';

          const activeBtn =
            'bg-fraction-violet-500 text-white shadow-[0_4px_10px_rgba(0,0,0,0.25)] ' +
            'ring-1 ring-fraction-dark-500/30';

          const inactiveBtn =
            'bg-white text-fraction-light-700 ring-1 ring-gray-200 hover:bg-gray-50';

          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={`${baseBtn} ${isActive ? activeBtn : inactiveBtn}`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Contenu des onglets */}
      <section className="mt-4   bg-white p-4 shadow-sm">
        {active === 'details' && (
          <div id="panel-details">
            <PropertyDetails />
          </div>
        )}

        {active === 'finances' && (
          <div id="panel-finances">
            <h2 className="text-lg font-semibold text-gray-900">Finances</h2>
            <p className="mt-1 text-sm text-gray-600">
              Section financière relative au produit.
            </p>
          </div>
        )}

        {active === 'performance' && (
          <div id="panel-performance">
            <h2 className="text-lg font-semibold text-gray-900">Performance</h2>
            <p className="mt-1 text-sm text-gray-600">
              Indicateurs clés de performance (KPI).
            </p>
          </div>
        )}

        {active === 'documents' && (
          <div id="panel-documents">
            <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
            <p className="mt-1 text-sm text-gray-600">
              Fichiers et documents liés au produit.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
