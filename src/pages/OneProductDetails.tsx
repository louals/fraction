import GalleryHero from '../components/GalleryHero';
import InvestmentCard from '../components/InvestmentCard';
import { TabsInfo } from '../components/TabsInfo';
import MapSection from '../components/MapSection';

export function OneProductDetails() {
  return (
    <main className="mx-auto space-y-8">
      {/* Top section: Hero image/gallery on the left and investment card on the right */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr] items-stretch md:h-[460px]">
        <GalleryHero productId="p-001" />
        <InvestmentCard />
      </div>

      {/* Middle section: Information displayed as tabs */}
      <section>
        <TabsInfo />
      </section>

      {/* Bottom section: About text (left) + Map (right) */}
      <MapSection lat={40.7128} lng={-74.006} zoom={12} />
    </main>
  );
}

export default OneProductDetails;
