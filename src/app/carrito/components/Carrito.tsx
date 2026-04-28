"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .ca-reveal { opacity:0; transform:translateY(24px); transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1); }
  .ca-reveal.ca-visible { opacity:1; transform:translateY(0); }
  .ca-fade { opacity:0; transform:translateY(16px); transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1); }
  .ca-fade.ca-active { opacity:1; transform:translateY(0); }
  .ca-item { transition:box-shadow .3s,border-color .3s; }
  .ca-item:hover { box-shadow:0 8px 32px rgba(90,15,36,.08) !important; border-color:rgba(155,35,53,.2) !important; }
  .ca-qty-btn { width:32px; height:32px; border-radius:8px; border:1.5px solid rgba(155,35,53,.2); background:transparent; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.1rem; color:#9B2335; font-weight:700; transition:background .2s,border-color .2s; }
  .ca-qty-btn:hover { background:rgba(155,35,53,.08); border-color:#9B2335; }
  .ca-btn-primary { font-family:'DM Sans',sans-serif; font-weight:700; font-size:.95rem; background:#9B2335; color:#FAF5EE; border:none; border-radius:14px; padding:15px; cursor:pointer; width:100%; transition:background .2s,transform .15s,box-shadow .2s; box-shadow:0 4px 20px rgba(155,35,53,.28); }
  .ca-btn-primary:hover { background:#7d1a29; transform:translateY(-1px); box-shadow:0 6px 24px rgba(155,35,53,.38); }
  .ca-btn-sec { font-family:'DM Sans',sans-serif; font-weight:500; font-size:.88rem; background:transparent; color:#9B2335; border:1.5px solid rgba(155,35,53,.3); border-radius:14px; padding:13px; cursor:pointer; width:100%; transition:background .2s,border-color .2s; }
  .ca-btn-sec:hover { background:rgba(155,35,53,.05); border-color:#9B2335; }
  @keyframes caShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
  .ca-empty-icon { animation:caShake 2.5s ease-in-out infinite; }
`;

const itemsIniciales = [
  { id:1, emoji:"🌹", nombre:"Ramo de Rosas Premium",      precio:85,  cantidad:1, ocasion:"Aniversario", dest:"Pareja" },
  { id:2, emoji:"🍫", nombre:"Caja Gourmet Personalizada", precio:120, cantidad:1, ocasion:"Cumpleaños",  dest:"Ella"   },
  { id:3, emoji:"🧴", nombre:"Kit Spa & Bienestar",        precio:150, cantidad:1, ocasion:"Cumpleaños",  dest:"Ella"   },
];

const ENVIO = 25;

export default function Carrito() {
  const router = useRouter();
  const [items, setItems] = useState(itemsIniciales);
  const [eliminando, setEliminando] = useState<number|null>(null);

  const cambiarCantidad = (id: number, delta: number) => {
    setItems(prev => prev.map(i => i.id === id
      ? { ...i, cantidad: Math.max(1, i.cantidad + delta) }
      : i
    ));
  };

  const eliminar = (id: number) => {
    setEliminando(id);
    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== id));
      setEliminando(null);
    }, 350);
  };

  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const total    = subtotal + (items.length > 0 ? ENVIO : 0);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── HEADER ── */}
      <section style={{ background:"linear-gradient(150deg,#5A0F24 0%,#8E1B3A 55%,#9B2335 100%)", padding:"clamp(6rem,10vw,8rem) clamp(1.5rem,6vw,6rem) clamp(2.5rem,5vw,4rem)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='rgba(245,230,208,0.04)' stroke-width='1'/%3E%3C/svg%3E")` }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:"1280px", margin:"0 auto" }}>
          <button onClick={() => router.back()} style={{ display:"inline-flex", alignItems:"center", gap:".5rem", background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:".82rem", color:"rgba(245,230,208,.6)", marginBottom:"1.5rem", padding:0, transition:"color .2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color="#FAF5EE"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color="rgba(245,230,208,.6)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Volver
          </button>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"clamp(2.4rem,5vw,4rem)", lineHeight:1.06, color:"#FAF5EE", marginBottom:".5rem" }}>
            Tu <em style={{ fontStyle:"italic", color:"#BC9968" }}>carrito</em>
          </h1>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".95rem", color:"rgba(245,230,208,.65)" }}>
            {items.length > 0 ? `${items.length} regalo${items.length > 1 ? "s" : ""} seleccionado${items.length > 1 ? "s" : ""}` : "Tu carrito está vacío"}
          </p>
        </div>
      </section>

      {/* ── CONTENIDO ── */}
      <section style={{ background:"linear-gradient(160deg,#FAF5EE 0%,#f0e6d2 100%)", padding:"clamp(3rem,6vw,6rem) clamp(1.5rem,6vw,6rem)", minHeight:"60vh" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto" }}>

          {items.length === 0 ? (
            /* CARRITO VACÍO */
            <div style={{ textAlign:"center", padding:"5rem 2rem" }}>
              <div className="ca-empty-icon" style={{ fontSize:"5rem", marginBottom:"1.5rem" }}>🛒</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(1.6rem,3vw,2.2rem)", color:"#5A0F24", marginBottom:".75rem" }}>
                Tu carrito está <em style={{ fontStyle:"italic" }}>vacío</em>
              </h2>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".95rem", lineHeight:1.75, color:"#5C3A1E", marginBottom:"2rem" }}>
                Explora nuestro catálogo y encuentra el regalo perfecto para cada ocasión.
              </p>
              <button onClick={() => router.push("/regalos")} style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:".95rem", background:"#9B2335", color:"#FAF5EE", border:"none", borderRadius:"100px", padding:"14px 32px", cursor:"pointer", boxShadow:"0 4px 20px rgba(155,35,53,.28)", transition:"background .2s,transform .15s" }}
                onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.background="#7d1a29"; el.style.transform="translateY(-2px)"; }}
                onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.background="#9B2335"; el.style.transform="translateY(0)"; }}
              >Explorar regalos →</button>
            </div>
          ) : (
            /* LAYOUT CARRITO */
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,420px),1fr))", gap:"2rem", alignItems:"start" }}>

              {/* ── LISTA DE ITEMS ── */}
              <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                {items.map(item => (
                  <div key={item.id} className="ca-item"
                    style={{ background:"#FFFFFF", border:"1px solid rgba(155,35,53,.1)", borderRadius:"16px", padding:"1.4rem", display:"flex", gap:"1.2rem", alignItems:"flex-start", opacity: eliminando===item.id ? 0 : 1, transform: eliminando===item.id ? "translateX(20px)" : "translateX(0)", transition:"opacity .35s,transform .35s,box-shadow .3s,border-color .3s" }}
                  >
                    {/* emoji */}
                    <div style={{ width:"72px", height:"72px", borderRadius:"14px", background:"linear-gradient(135deg,rgba(155,35,53,.07),rgba(188,153,104,.12))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2.2rem", flexShrink:0 }}>
                      {item.emoji}
                    </div>

                    {/* info */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1rem", color:"#5A0F24", lineHeight:1.2, marginBottom:".35rem" }}>{item.nombre}</div>
                      <div style={{ display:"flex", gap:".4rem", marginBottom:".8rem", flexWrap:"wrap" }}>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".65rem", fontWeight:500, color:"#BC9968", background:"rgba(188,153,104,.1)", borderRadius:"100px", padding:".15rem .55rem" }}>{item.ocasion}</span>
                        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".65rem", fontWeight:500, color:"#9B2335", background:"rgba(155,35,53,.07)", borderRadius:"100px", padding:".15rem .55rem" }}>Para {item.dest}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:".8rem" }}>
                        {/* cantidad */}
                        <div style={{ display:"flex", alignItems:"center", gap:".6rem" }}>
                          <button className="ca-qty-btn" onClick={() => cambiarCantidad(item.id, -1)}>−</button>
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".95rem", color:"#5A0F24", minWidth:"24px", textAlign:"center" }}>{item.cantidad}</span>
                          <button className="ca-qty-btn" onClick={() => cambiarCantidad(item.id, +1)}>+</button>
                        </div>
                        {/* precio + eliminar */}
                        <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                          <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.1rem", color:"#9B2335" }}>Bs. {item.precio * item.cantidad}</span>
                          <button onClick={() => eliminar(item.id)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(92,58,30,.35)", padding:"4px", borderRadius:"6px", transition:"color .2s,background .2s", display:"flex" }}
                            onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.color="#9B2335"; el.style.background="rgba(155,35,53,.07)"; }}
                            onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.color="rgba(92,58,30,.35)"; el.style.background="transparent"; }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* link seguir comprando */}
                <button onClick={() => router.push("/regalos")} style={{ display:"inline-flex", alignItems:"center", gap:".5rem", background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:".85rem", color:"#9B2335", padding:".5rem 0", alignSelf:"flex-start", transition:"gap .2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.gap=".8rem"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.gap=".5rem"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                  Seguir explorando regalos
                </button>
              </div>

              {/* ── RESUMEN ── */}
              <div style={{ background:"#FFFFFF", border:"1px solid rgba(155,35,53,.1)", borderRadius:"20px", padding:"clamp(1.8rem,4vw,2.8rem)", boxShadow:"0 4px 24px rgba(90,15,36,.06)", position:"sticky", top:"88px" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.3rem", color:"#5A0F24", marginBottom:"1.5rem", paddingBottom:"1rem", borderBottom:"1px solid rgba(155,35,53,.08)" }}>
                  Resumen del pedido
                </div>

                {/* líneas */}
                <div style={{ display:"flex", flexDirection:"column", gap:".8rem", marginBottom:"1.2rem" }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".85rem", color:"#5C3A1E" }}>{item.nombre} × {item.cantidad}</span>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".9rem", color:"#5A0F24" }}>Bs. {item.precio * item.cantidad}</span>
                    </div>
                  ))}
                </div>

                <div style={{ height:"1px", background:"rgba(155,35,53,.08)", margin:"1rem 0" }} />

                {/* subtotal */}
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".6rem" }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".9rem", color:"#5C3A1E" }}>Subtotal</span>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".95rem", color:"#5A0F24" }}>Bs. {subtotal}</span>
                </div>

                {/* envío */}
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".6rem" }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".9rem", color:"#5C3A1E" }}>Envío estimado</span>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".95rem", color:"#5A0F24" }}>Bs. {ENVIO}</span>
                </div>

                <div style={{ height:"1px", background:"rgba(155,35,53,.08)", margin:"1rem 0" }} />

                {/* total */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"2rem" }}>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.1rem", color:"#5A0F24" }}>Total</span>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.5rem", color:"#9B2335" }}>Bs. {total}</span>
                </div>

                {/* botones */}
                <div style={{ display:"flex", flexDirection:"column", gap:".8rem" }}>
                  <button className="ca-btn-primary" onClick={() => router.push("/pago")}>
                    Continuar al pago →
                  </button>
                  <button className="ca-btn-sec" onClick={() => router.push("/regalos")}>
                    Seguir comprando
                  </button>
                </div>

                {/* garantías */}
                <div style={{ marginTop:"1.5rem", display:"flex", flexDirection:"column", gap:".5rem" }}>
                  {["🔒 Pago 100% seguro","🚚 Entrega en 1–3 días hábiles","🎁 Empaque personalizado incluido"].map(g => (
                    <div key={g} style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".75rem", color:"rgba(92,58,30,.55)", display:"flex", alignItems:"center", gap:".4rem" }}>{g}</div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </section>
    </>
  );
}
