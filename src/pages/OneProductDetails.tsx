import GalleryHero from '../components/GalleryHero';
import InvestmentCard from '../components/InvestmentCard';
import { TabsInfo } from '../components/TabsInfo';

export function OneProductDetails() {
  return (
    <main className="mx-auto space-y-8">
      {/* Hero + Card*/}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr] items-stretch md:h-[460px]">
        <GalleryHero productId="p-001" />
        <InvestmentCard />
      </div>

      {/* Information = Tabs */}
      <section>
        <TabsInfo />
      </section>

      {/* Map */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500 shadow-sm">
        Placeholder: Map (Step 3)
      </section>
    </main>
  );
}

export default OneProductDetails;
