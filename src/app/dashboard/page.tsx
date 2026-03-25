"use client";
import { useState } from 'react';
import AIAssistantHero from './components/ai/AIAssistantHero';
import SpecialDateCard from './components/dashboard/SpecialDateCard';
import OrderTrackingWidget from './components/tracking/OrderTrackingWidget';
import InspirationFeed from './components/catalog/InspirationFeed';
import ProductModal from './components/modals/ProductModal';
import TrackingModal from './components/modals/TrackingModal';

const DEFAULT_TRACKING_ORDER = {
  id: '#EM-2041',
  title: 'Caja Sorpresa Spa Botánico',
  recipient: 'María (Mamá)',
  progress: 2,
};

export default function DashboardPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  return (
    <main className="max-w-5xl mx-auto px-6 pb-24">
      <AIAssistantHero />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <SpecialDateCard />
        <OrderTrackingWidget onOpenTracking={() => setIsTrackingOpen(true)} />
      </div>
      <InspirationFeed onOpenProduct={setSelectedProduct} />
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      {isTrackingOpen && (
        <TrackingModal order={DEFAULT_TRACKING_ORDER} onClose={() => setIsTrackingOpen(false)} />
      )}
    </main>
  );
}
