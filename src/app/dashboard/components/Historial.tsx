import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, PackageCheck, Receipt, ChevronRight, Star } from 'lucide-react';
import { COLORS } from '../constants';

// ─── Datos Mock del Historial ───
const PAST_ORDERS = [
  { id: "#EM-1990", date: "28 Feb 2026", item: "Arreglo Floral y Chocolates", recipient: "Andrea (Amiga)", total: "150 Bs", status: "Entregado", points: "+15" },
  { id: "#EM-1842", date: "14 Feb 2026", item: "Desayuno Sorpresa San Valentín", recipient: "Carlos (Novio)", total: "220 Bs", status: "Entregado", points: "+22" },
  { id: "#EM-1520", date: "22 Dic 2025", item: "Caja Navideña Gourmet", recipient: "Familia Perez", total: "350 Bs", status: "Entregado", points: "+35" },
  { id: "#EM-1405", date: "10 Nov 2025", item: "Taza Personalizada + Café", recipient: "Julio (Colega)", total: "85 Bs", status: "Entregado", points: "+8" },
];

export default function Historial() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = PAST_ORDERS.filter(order => 
    order.item.toLowerCase().includes(searchQuery.toLowerCase()) || 
    order.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '32px 40px', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* ─── Encabezado ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 900, color: COLORS.bordeaux, lineHeight: 1.1, marginBottom: '8px' }}>
            Historial de <em style={{ color: COLORS.garnet }}>compras</em>
          </h1>
          <p style={{ color: COLORS.gray, fontSize: '1rem', maxWidth: '500px' }}>
            Un registro de todos los momentos inolvidables que has creado y entregado con Emotia.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: `1px solid rgba(188, 153, 104, 0.3)`, borderRadius: '100px', padding: '10px 20px', width: '280px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Search size={18} color={COLORS.gray} />
            <input 
              type="text" 
              placeholder="Buscar por ID, artículo o persona..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', marginLeft: '8px', width: '100%', fontSize: '0.9rem', color: COLORS.choco, fontFamily: 'inherit' }}
            />
          </div>
          <button style={{ background: 'white', border: `1px solid rgba(188, 153, 104, 0.3)`, borderRadius: '100px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: COLORS.choco, fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <Filter size={16} /> Filtrar
          </button>
        </div>
      </div>

      {/* ─── Tarjetas de Resumen ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: `1px solid rgba(188, 153, 104, 0.2)`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${COLORS.beige}60`, color: COLORS.garnet, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PackageCheck size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: COLORS.gray, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Regalos</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: COLORS.bordeaux }}>{PAST_ORDERS.length}</h3>
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: `1px solid rgba(188, 153, 104, 0.2)`, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${COLORS.beige}60`, color: COLORS.garnet, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: COLORS.gray, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inversión Total</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: COLORS.bordeaux }}>805 <span style={{ fontSize: '1rem', color: COLORS.gray, fontWeight: 500 }}>Bs</span></h3>
          </div>
        </div>

        <div style={{ background: `linear-gradient(135deg, ${COLORS.garnet}, ${COLORS.bordeaux})`, padding: '24px', borderRadius: '24px', boxShadow: `0 12px 24px ${COLORS.garnet}30`, display: 'flex', alignItems: 'center', gap: '16px', color: 'white' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.15)', color: COLORS.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={24} fill={COLORS.gold} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Puntos Generados</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>+80 <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>pts</span></h3>
          </div>
        </div>

      </div>

      {/* ─── Lista de Pedidos ─── */}
      <div style={{ background: 'white', borderRadius: '24px', border: `1px solid rgba(188, 153, 104, 0.2)`, boxShadow: '0 12px 32px rgba(90, 15, 36, 0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px', borderBottom: `1px solid rgba(188, 153, 104, 0.15)`, display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr auto', gap: '16px', color: COLORS.gray, fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <div>Detalle del Pedido</div>
          <div>Destinatario</div>
          <div>Fecha & Estado</div>
          <div style={{ textAlign: 'right' }}>Acciones</div>
        </div>

        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, idx) => (
            <div key={order.id} style={{ padding: '24px 32px', borderBottom: idx === filteredOrders.length - 1 ? 'none' : `1px solid rgba(188, 153, 104, 0.08)`, display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr auto', gap: '16px', alignItems: 'center', transition: 'background 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(188, 153, 104, 0.03)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${COLORS.beige}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.garnet, flexShrink: 0 }}>
                  <PackageCheck size={20} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, color: COLORS.choco, fontSize: '1rem', marginBottom: '2px' }}>{order.item}</h4>
                  <p style={{ fontSize: '0.8rem', color: COLORS.gray }}>ID: {order.id}</p>
                </div>
              </div>

              <div>
                <p style={{ fontWeight: 600, color: COLORS.bordeaux, fontSize: '0.95rem' }}>{order.recipient}</p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: COLORS.choco, fontSize: '0.9rem', fontWeight: 500, marginBottom: '6px' }}>
                  <Calendar size={14} color={COLORS.gray} /> {order.date}
                </div>
                <div style={{ display: 'inline-flex', background: '#F3F4F6', color: '#374151', padding: '4px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {order.status}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
                <div style={{ textAlign: 'right', marginRight: '16px' }}>
                  <div style={{ fontWeight: 800, color: COLORS.garnet, fontSize: '1.1rem' }}>{order.total}</div>
                  <div style={{ fontSize: '0.75rem', color: COLORS.gold, fontWeight: 700 }}>{order.points}</div>
                </div>
                <button style={{ background: 'white', border: `1px solid ${COLORS.gold}40`, color: COLORS.choco, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }} title="Descargar Recibo" onMouseOver={e => e.currentTarget.style.borderColor = COLORS.garnet} onMouseOut={e => e.currentTarget.style.borderColor = `${COLORS.gold}40`}>
                  <Download size={16} />
                </button>
                <button style={{ background: 'transparent', border: 'none', color: COLORS.gray, cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = COLORS.garnet} onMouseOut={e => e.currentTarget.style.color = COLORS.gray}>
                  <ChevronRight size={20} />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: COLORS.bordeaux, marginBottom: '4px' }}>No hay pedidos</h3>
            <p style={{ color: COLORS.gray }}>No encontramos compras que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>

    </div>
  );
}