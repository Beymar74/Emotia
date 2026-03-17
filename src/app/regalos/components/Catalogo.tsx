"use client";
import React, { useState } from "react";
import { useReveal } from "../hooks/useReveal";

const todos = [
  { emoji:"🌹", nombre:"Ramo de Rosas Premium",       precio:85,  tipo:"Flores",        ocasion:"Aniversario", dest:"Pareja", rango:"50-100"   },
  { emoji:"🌻", nombre:"Arreglo Floral Silvestre",     precio:65,  tipo:"Flores",        ocasion:"Cumpleaños",  dest:"Ella",   rango:"50-100"   },
  { emoji:"🌿", nombre:"Planta Suculenta Decorativa",  precio:45,  tipo:"Flores",        ocasion:"Cualquier",   dest:"Ambos",  rango:"0-50"     },
  { emoji:"🍫", nombre:"Caja Gourmet Personalizada",   precio:120, tipo:"Gourmet",       ocasion:"Cumpleaños",  dest:"Ella",   rango:"100-200"  },
  { emoji:"🍷", nombre:"Set Vino & Chocolates",        precio:135, tipo:"Gourmet",       ocasion:"Aniversario", dest:"Pareja", rango:"100-200"  },
  { emoji:"☕", nombre:"Kit Café Premium Boliviano",   precio:80,  tipo:"Gourmet",       ocasion:"Cualquier",   dest:"Él",     rango:"50-100"   },
  { emoji:"🧴", nombre:"Kit Spa & Bienestar",          precio:150, tipo:"Bienestar",     ocasion:"Cumpleaños",  dest:"Ella",   rango:"100-200"  },
  { emoji:"🕯️", nombre:"Set Aromaterapia",             precio:70,  tipo:"Bienestar",     ocasion:"Cualquier",   dest:"Ella",   rango:"50-100"   },
  { emoji:"🏺", nombre:"Artesanía Tiwanaku",           precio:95,  tipo:"Artesanías",    ocasion:"Graduación",  dest:"Ambos",  rango:"50-100"   },
  { emoji:"🎨", nombre:"Cuadro Personalizado",         precio:180, tipo:"Artesanías",    ocasion:"Aniversario", dest:"Pareja", rango:"100-200"  },
  { emoji:"🧶", nombre:"Tejido Andino Decorativo",     precio:55,  tipo:"Artesanías",    ocasion:"Cualquier",   dest:"Ambos",  rango:"50-100"   },
  { emoji:"✨", nombre:"Cena Romántica para 2",        precio:200, tipo:"Experiencias",  ocasion:"Aniversario", dest:"Pareja", rango:"+200"     },
  { emoji:"🎭", nombre:"Entrada Teatro + Cena",        precio:220, tipo:"Experiencias",  ocasion:"Cumpleaños",  dest:"Pareja", rango:"+200"     },
  { emoji:"🧘", nombre:"Clase Yoga Privada",           precio:90,  tipo:"Experiencias",  ocasion:"Cualquier",   dest:"Ella",   rango:"50-100"   },
  { emoji:"📖", nombre:"Libro Personalizado",          precio:75,  tipo:"Arte & Libros", ocasion:"Graduación",  dest:"Ambos",  rango:"50-100"   },
  { emoji:"🖼️", nombre:"Retrato Digital Ilustrado",    precio:110, tipo:"Arte & Libros", ocasion:"Cumpleaños",  dest:"Ambos",  rango:"100-200"  },
  { emoji:"🎸", nombre:"Clase Instrumento Musical",    precio:85,  tipo:"Experiencias",  ocasion:"Cumpleaños",  dest:"Él",     rango:"50-100"   },
  { emoji:"👗", nombre:"Voucher Moda Kallawaya",       precio:150, tipo:"Moda",          ocasion:"Cumpleaños",  dest:"Ella",   rango:"100-200"  },
  { emoji:"⌚", nombre:"Reloj Artesanal Boliviano",    precio:250, tipo:"Moda",          ocasion:"Graduación",  dest:"Él",     rango:"+200"     },
  { emoji:"🎒", nombre:"Mochila Wayuu Personalizada",  precio:130, tipo:"Moda",          ocasion:"Cualquier",   dest:"Ambos",  rango:"100-200"  },
];

const ocasiones  = ["Todas","Cumpleaños","Aniversario","Graduación","San Valentín","Cualquier"];
const destinos   = ["Todos","Ella","Él","Pareja","Ambos"];
const tipos      = ["Todos","Flores","Gourmet","Bienestar","Artesanías","Experiencias","Arte & Libros","Moda"];
const rangos     = ["Todos","0-50","50-100","100-200","+200"];
const rangoLabel: Record<string,string> = { "Todos":"Cualquier precio","0-50":"Hasta Bs. 50","50-100":"Bs. 50 – 100","100-200":"Bs. 100 – 200","+200":"Más de Bs. 200" };

function FilterBtn({ label, active, onClick }: { label:string; active:boolean; onClick:()=>void }) {
  return (
    <button onClick={onClick} style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:active?600:400, fontSize:".78rem", padding:".42rem 1rem", borderRadius:"100px", border:`1.5px solid ${active?"#9B2335":"rgba(155,35,53,.2)"}`, background:active?"#9B2335":"transparent", color:active?"#FAF5EE":"#5C3A1E", cursor:"pointer", transition:"all .2s", whiteSpace:"nowrap" }}
      onMouseEnter={e => { if(!active){ (e.currentTarget as HTMLElement).style.borderColor="#9B2335"; (e.currentTarget as HTMLElement).style.color="#9B2335"; } }}
      onMouseLeave={e => { if(!active){ (e.currentTarget as HTMLElement).style.borderColor="rgba(155,35,53,.2)"; (e.currentTarget as HTMLElement).style.color="#5C3A1E"; } }}
    >{label}</button>
  );
}

function RegaloCard({ emoji, nombre, precio, tipo, ocasion, dest, index }: (typeof todos)[0] & { index:number }) {
  const ref = useReveal(index * 50);
  return (
    <div ref={ref} className="rg-reveal" style={{ background:"#FFFFFF", border:"1px solid rgba(155,35,53,.1)", borderRadius:"16px", overflow:"hidden", boxShadow:"0 2px 8px rgba(90,15,36,.04)", transition:"transform .3s,box-shadow .3s", cursor:"pointer" }}
      onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.transform="translateY(-4px)"; el.style.boxShadow="0 16px 40px rgba(90,15,36,.1)"; }}
      onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.transform="translateY(0)"; el.style.boxShadow="0 2px 8px rgba(90,15,36,.04)"; }}
    >
      <div style={{ background:"linear-gradient(135deg,rgba(155,35,53,.06),rgba(188,153,104,.1))", height:"130px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"3.2rem" }}>{emoji}</div>
      <div style={{ padding:"1.2rem" }}>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".7rem", letterSpacing:".1em", textTransform:"uppercase", color:"#BC9968", marginBottom:".4rem" }}>{tipo}</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:".98rem", color:"#5A0F24", marginBottom:".6rem", lineHeight:1.25 }}>{nombre}</div>
        <div style={{ display:"flex", gap:".4rem", marginBottom:"1rem", flexWrap:"wrap" }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".65rem", fontWeight:500, color:"#9B2335", background:"rgba(155,35,53,.07)", borderRadius:"100px", padding:".15rem .55rem" }}>{ocasion}</span>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".65rem", fontWeight:500, color:"#5C3A1E", background:"rgba(92,58,30,.07)", borderRadius:"100px", padding:".15rem .55rem" }}>Para {dest}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.1rem", color:"#9B2335" }}>Bs. {precio}</div>
          <button style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".75rem", background:"#9B2335", color:"#FAF5EE", border:"none", borderRadius:"100px", padding:".45rem 1rem", cursor:"pointer", transition:"background .2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="#7d1a29"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="#9B2335"; }}
          >Ver más</button>
        </div>
      </div>
    </div>
  );
}

export default function Catalogo() {
  const ref = useReveal();
  const [ocasion, setOcasion]   = useState("Todas");
  const [dest, setDest]         = useState("Todos");
  const [tipo, setTipo]         = useState("Todos");
  const [rango, setRango]       = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const filtrados = todos.filter(r => {
    if (ocasion !== "Todas" && r.ocasion !== ocasion && r.ocasion !== "Cualquier") return false;
    if (dest    !== "Todos" && r.dest    !== dest    && r.dest    !== "Ambos")     return false;
    if (tipo    !== "Todos" && r.tipo    !== tipo)                                  return false;
    if (rango   !== "Todos" && r.rango   !== rango)                                 return false;
    if (busqueda && !r.nombre.toLowerCase().includes(busqueda.toLowerCase()))       return false;
    return true;
  });

  return (
    <section id="catalogo" style={{ background:"#FFFFFF", padding:"clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)" }}>
      <div className="rg-reveal" ref={ref} style={{ marginBottom:"clamp(2.5rem,5vw,4rem)" }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".68rem", letterSpacing:".4em", textTransform:"uppercase", color:"#BC9968", display:"block", marginBottom:".9rem" }}>Catálogo completo</span>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(1.9rem,4vw,3.2rem)", lineHeight:1.1, color:"#5A0F24", marginBottom:"1rem" }}>
          Encuentra tu <em style={{ fontStyle:"italic" }}>regalo ideal</em>
        </h2>
      </div>

      {/* buscador */}
      <div style={{ position:"relative", maxWidth:"480px", marginBottom:"2rem" }}>
        <input placeholder="Buscar regalo…" value={busqueda} onChange={e => setBusqueda(e.target.value)}
          style={{ width:"100%", fontFamily:"'DM Sans',sans-serif", fontSize:".92rem", color:"#3D1A0E", background:"#FAF5EE", border:"1.5px solid rgba(155,35,53,.18)", borderRadius:"100px", padding:"12px 48px 12px 20px", outline:"none", transition:"border-color .2s,box-shadow .2s" }}
          onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor="#9B2335"; (e.currentTarget as HTMLElement).style.boxShadow="0 0 0 3px rgba(155,35,53,.1)"; }}
          onBlur={e  => { (e.currentTarget as HTMLElement).style.borderColor="rgba(155,35,53,.18)"; (e.currentTarget as HTMLElement).style.boxShadow="none"; }}
        />
        <div style={{ position:"absolute", right:"16px", top:"50%", transform:"translateY(-50%)", color:"#BC9968", pointerEvents:"none" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      {/* filtros */}
      <div style={{ display:"flex", flexDirection:"column", gap:".8rem", marginBottom:"2.5rem" }}>
        {[
          { label:"Ocasión", values:ocasiones,  active:ocasion, set:setOcasion },
          { label:"Para",    values:destinos,   active:dest,    set:setDest    },
          { label:"Tipo",    values:tipos,      active:tipo,    set:setTipo    },
          { label:"Precio",  values:rangos,     active:rango,   set:setRango, labels:rangoLabel },
        ].map(({ label, values, active, set: setFn, labels }) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:".6rem", flexWrap:"wrap" }}>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".72rem", letterSpacing:".08em", textTransform:"uppercase", color:"#5A0F24", minWidth:"56px" }}>{label}</span>
            <div style={{ display:"flex", flexWrap:"wrap", gap:".4rem" }}>
              {values.map(v => (
                <FilterBtn key={v} label={labels ? labels[v] : v} active={active===v} onClick={() => setFn(v)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* resultado count */}
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".82rem", color:"rgba(92,58,30,.55)", marginBottom:"1.5rem" }}>
        Mostrando <strong style={{ color:"#9B2335" }}>{filtrados.length}</strong> de {todos.length} regalos
      </p>

      {/* grid */}
      {filtrados.length > 0 ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,240px),1fr))", gap:"1.2rem" }}>
          {filtrados.map((r, i) => <RegaloCard key={r.nombre} {...r} index={i} />)}
        </div>
      ) : (
        <div style={{ textAlign:"center", padding:"4rem 2rem" }}>
          <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🔍</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.3rem", color:"#5A0F24", marginBottom:".75rem" }}>Sin resultados</div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".9rem", color:"rgba(92,58,30,.6)" }}>Prueba con otros filtros o usa el asesor IA para encontrar el regalo perfecto.</p>
        </div>
      )}
    </section>
  );
}
