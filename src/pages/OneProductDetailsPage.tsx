// src/pages/OneProductDetails.tsx
import GalleryHero from '../components/GalleryHero';
import InvestmentCard from '../components/InvestmentCard';
import { TabsInfo } from '../components/TabsInfo';

export default function OneProductDetailsPage() {
  return (
    <main className='mx-auto space-y-8'>
      {/* Top: Gallery + Investment card */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr] items-stretch md:h-[460px]'>
        <GalleryHero productId='p-001' />
        <InvestmentCard />
      </div>

      {/* Middle: Tabs control everything */}
      <section>
        <TabsInfo />
      </section>
    </main>
  );
}
