"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowLeft } from 'lucide-react';
import ProductModal from '../components/modals/ProductModal';

const MOCK_PRODUCTS = [
  { id: 1, title: 'Kit Café de Altura Local', price: 150, rating: 4.9, reviews: 120, category: 'Experiencias', img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Selección de los mejores granos de café tostado artesanal, incluye taza de cerámica y prensa francesa.' },
  { id: 2, title: 'Cena Romántica 2 pax', price: 320, rating: 5.0, reviews: 85, category: 'Cenas', img: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', description: 'Experiencia gastronómica inolvidable en un restaurante exclusivo con vista a la ciudad.' },
];

function AdvisorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || 'Sugerencias de regalos';
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnalyzing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 pt-8 animate-in slide-in-from-bottom-8 duration-500">
      <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-[#8E1B3A] font-semibold hover:bg-[#F5E6D0] px-4 py-2 rounded-lg transition-colors mb-8">
        <ArrowLeft className="w-5 h-5" /> Volver al Dashboard
      </button>
      <div className="bg-[#FFFFFF] rounded-3xl shadow-lg border border-[#F5E6D0] overflow-hidden mb-10">
        <div className="bg-gradient-to-r from-[#8E1B3A] to-[#5A0F24] px-6 py-4 flex items-center gap-3">
          <div className="bg-[#FFFFFF]/20 p-2 rounded-full"><Sparkles className="w-6 h-6 text-[#F5E6D0]" /></div>
          <div>
            <h2 className="text-[#FFFFFF] font-bold text-lg">Emotia AI Assistant</h2>
            <p className="text-[#F5E6D0]/80 text-xs">Asesoría Inteligente</p>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <div className="flex justify-end mb-6">
            <div className="bg-[#F5E6D0] text-[#5C3A2E] px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm border border-[#BC9968]/20">
              <p className="font-medium">"{query}"</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-[#FFFFFF] border border-[#F5E6D0] text-[#000000] px-5 py-4 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm flex gap-4">
              <div className="bg-[#8E1B3A] p-2 rounded-full h-fit mt-1"><Sparkles className="w-4 h-4 text-[#FFFFFF]" /></div>
              <div>
                {isAnalyzing ? (
                  <div className="flex gap-1 py-2">
                    <span className="w-2 h-2 bg-[#BC9968] rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-[#BC9968] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-[#BC9968] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-500">
                    <p className="mb-4 text-[#5C3A2E]">¡Qué gran idea! He analizado tu solicitud y seleccioné estas opciones perfectas para la ocasión:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      {MOCK_PRODUCTS.map((item) => (
                        <div key={item.id} onClick={() => setSelectedProduct(item)}
                          className="bg-[#F5E6D0]/30 rounded-xl p-3 flex gap-4 cursor-pointer hover:bg-[#F5E6D0] transition-colors border border-[#F5E6D0]">
                          <img src={item.img} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                          <div className="flex flex-col justify-center">
                            <h4 className="font-bold text-[#8E1B3A] text-sm">{item.title}</h4>
                            <span className="text-xs font-bold text-[#5C3A2E]">{item.price} Bs</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}

export default function AIAdvisorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#8E1B3A]">Cargando asesor IA...</div>}>
      <AdvisorContent />
    </Suspense>
  );
}
