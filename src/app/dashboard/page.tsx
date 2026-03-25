"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from "@stackframe/stack";
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
  const user = useUser();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  useEffect(() => {
    if (user === undefined) return; // todavía cargando
    if (user === null) {
      router.push('/login');
      return;
    }

    // Redirección por rol
    const role = (user.clientMetadata as { role?: string })?.role;
    if (role === 'admin') router.push('/admin');
    if (role === 'proveedor') router.push('/proveedor');

  }, [user, router]);

  // Cargando sesión
  if (user === undefined) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#F5E6D0" }}>
        <p style={{ fontFamily: "serif", fontSize: "1.2rem", color: "#5A0F24" }}>Cargando...</p>
      </div>
    );
  }

  // Sin sesión o redirigiendo
  if (user === null) return null;
  const role = (user.clientMetadata as { role?: string })?.role;
  if (role === 'admin' || role === 'proveedor') return null;

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