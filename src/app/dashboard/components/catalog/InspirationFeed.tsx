"use client";
import { ChevronRight, Star } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/mockProducts';

export default function InspirationFeed({ onOpenProduct }: { onOpenProduct: (p: any) => void }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-[#5A0F24]">Inspiración del momento</h3>
        <button className="text-[#AB3A50] font-semibold hover:underline flex items-center text-sm">Ver todo <ChevronRight className="w-4 h-4 ml-1" /></button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_PRODUCTS.map((item) => (
          <div key={item.id} onClick={() => onOpenProduct(item)} className="bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-[#F5E6D0]">
            <div className="h-48 overflow-hidden relative">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-3 right-3 bg-[#FFFFFF]/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-lg text-[#5A0F24]">{item.price}</div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-[#5C3A2E] mb-1">{item.title}</h4>
              <p className="text-xs text-[#B0B0B0] flex items-center gap-1">
                <Star className="w-3 h-3 text-[#BC9968] fill-[#BC9968]" /> {item.rating} ({item.reviews})
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
