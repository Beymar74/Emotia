"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900&family=DM+Sans:wght@300;400;500;600;700&display=swap');`;

const kpis = [
  { icon:"💰", label:"Ventas totales", valor:"Bs. 12,480", sub:"+18% este mes"   },
  { icon:"📦", label:"Pedidos",        valor:"143",         sub:"23 pendientes"   },
  { icon:"👥", label:"Usuarios",       valor:"381",         sub:"+12 esta semana" },
  { icon:"🏢", label:"Proveedores",    valor:"9",           sub:"2 en revisión"   },
];

const pedidos = [
  { id:"#001", cliente:"Ana Flores",    regalo:"Ramo de Rosas",      monto:"Bs. 85",  estado:"Entregado" },
  { id:"#002", cliente:"Carlos Mamani", regalo:"Kit Spa",            monto:"Bs. 150", estado:"En camino" },
  { id:"#003", cliente:"Lucía Quispe",  regalo:"Caja Gourmet",       monto:"Bs. 120", estado:"Pendiente" },
  { id:"#004", cliente:"Diego Torrez",  regalo:"Artesanía Tiwanaku", monto:"Bs. 95",  estado:"Entregado" },
  { id:"#005", cliente:"Sofía Chávez",  regalo:"Cena Romántica",     monto:"Bs. 200", estado:"Pendiente" },
];

const proveedores = [
  { nombre:"Flores Illimani",    rubro:"Flores",     estado:"Activo"     },
  { nombre:"Gourmet Andes",      rubro:"Gourmet",    estado:"Activo"     },
  { nombre:"Artesana Boliviana", rubro:"Artesanías", estado:"En revisión" },
];

const eC: Record<string,string> = { "Entregado":"#16a34a","En camino":"#BC9968","Pendiente":"#9B2335" };
const eB: Record<string,string> = { "Entregado":"rgba(22,163,74,.1)","En camino":"rgba(188,153,104,.1)","Pendiente":"rgba(155,35,53,.1)" };

export default function AdminPage() {
  const router = useRouter();
  const [sec, setSec] = useState<"pedidos"|"proveedores">("pedidos");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={{ minHeight:"100vh", background:"#f8f4ef", fontFamily:"'DM Sans',sans-serif" }}>

        {/* SIDEBAR */}
        <div style={{ position:"fixed", top:0, left:0, bottom:0, width:"220px", background:"#5A0F24", display:"flex", flexDirection:"column", zIndex:100, boxShadow:"4px 0 20px rgba(90,15,36,.2)" }}>
          <div style={{ padding:"1.8rem 1.5rem 1.2rem", borderBottom:"1px solid rgba(245,230,208,.1)" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"1.4rem", color:"#FAF5EE" }}>Emo<span style={{ color:"#BC9968" }}>tia</span></div>
            <div style={{ fontSize:".65rem", fontWeight:600, letterSpacing:".15em", textTransform:"uppercase", color:"rgba(245,230,208,.4)", marginTop:".2rem" }}>Panel Admin</div>
          </div>
          <nav style={{ flex:1, padding:"1rem 0" }}>
            {[["📊","Dashboard","pedidos"],["📦","Pedidos","pedidos"],["🏢","Proveedores","proveedores"]].map(([icon,label,key])=>(
              <button key={label} onClick={()=>setSec(key as any)}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:".8rem", padding:".9rem 1.5rem", background: sec===key?"rgba(245,230,208,.1)":"transparent", border:"none", cursor:"pointer", fontWeight: sec===key?600:400, fontSize:".88rem", color: sec===key?"#FAF5EE":"rgba(245,230,208,.7)", textAlign:"left", transition:"all .2s", fontFamily:"'DM Sans',sans-serif" }}
              ><span>{icon}</span>{label}</button>
            ))}
          </nav>
          <div style={{ padding:"1.2rem 1.5rem", borderTop:"1px solid rgba(245,230,208,.1)" }}>
            <button onClick={()=>router.push("/")} style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:".82rem", color:"rgba(245,230,208,.5)", background:"none", border:"none", cursor:"pointer", padding:0, transition:"color .2s" }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.color="#FAF5EE"; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.color="rgba(245,230,208,.5)"; }}
            >← Salir al sitio</button>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ marginLeft:"220px", padding:"2.5rem" }}>
          <div style={{ marginBottom:"2rem" }}>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.8rem", color:"#5A0F24", marginBottom:".3rem" }}>Buenos días, <em style={{ fontStyle:"italic" }}>Admin</em> 👋</h1>
            <p style={{ fontSize:".88rem", color:"rgba(92,58,30,.6)" }}>{new Date().toLocaleDateString("es-BO",{ weekday:"long", year:"numeric", month:"long", day:"numeric" })}</p>
          </div>

          {/* KPIs */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
            {kpis.map(k=>(
              <div key={k.label} style={{ background:"#FFFFFF", borderRadius:"16px", padding:"1.4rem", border:"1px solid rgba(155,35,53,.1)", boxShadow:"0 2px 8px rgba(90,15,36,.04)" }}>
                <div style={{ fontSize:"1.6rem", marginBottom:".6rem" }}>{k.icon}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.5rem", color:"#9B2335", lineHeight:1 }}>{k.valor}</div>
                <div style={{ fontWeight:500, fontSize:".75rem", color:"#5C3A1E", marginTop:".3rem" }}>{k.label}</div>
                <div style={{ fontSize:".7rem", color:"#BC9968", marginTop:".2rem" }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* tabs */}
          <div style={{ display:"flex", gap:".5rem", marginBottom:"1.2rem" }}>
            {(["pedidos","proveedores"] as const).map(t=>(
              <button key={t} onClick={()=>setSec(t)} style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:sec===t?600:400, fontSize:".82rem", padding:".4rem 1rem", borderRadius:"100px", border:`1.5px solid ${sec===t?"#9B2335":"rgba(155,35,53,.2)"}`, background:sec===t?"#9B2335":"transparent", color:sec===t?"#FAF5EE":"#5C3A1E", cursor:"pointer", textTransform:"capitalize" }}>{t}</button>
            ))}
          </div>

          {/* pedidos */}
          {sec==="pedidos" && (
            <div style={{ background:"#FFFFFF", borderRadius:"16px", border:"1px solid rgba(155,35,53,.1)", overflow:"hidden", boxShadow:"0 2px 8px rgba(90,15,36,.04)" }}>
              <div style={{ padding:"1.2rem 1.5rem", borderBottom:"1px solid rgba(155,35,53,.08)", fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.1rem", color:"#5A0F24" }}>Pedidos recientes</div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead><tr style={{ background:"rgba(155,35,53,.03)" }}>
                    {["ID","Cliente","Regalo","Monto","Estado"].map(h=>(
                      <th key={h} style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".72rem", letterSpacing:".08em", textTransform:"uppercase", color:"rgba(92,58,30,.5)", padding:".8rem 1.2rem", textAlign:"left" }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {pedidos.map((p,i)=>(
                      <tr key={p.id} style={{ borderTop:"1px solid rgba(155,35,53,.06)", background:i%2===0?"transparent":"rgba(155,35,53,.01)" }}>
                        <td style={{ padding:".9rem 1.2rem", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".82rem", color:"#9B2335" }}>{p.id}</td>
                        <td style={{ padding:".9rem 1.2rem", fontSize:".85rem", color:"#5A0F24" }}>{p.cliente}</td>
                        <td style={{ padding:".9rem 1.2rem", fontSize:".85rem", color:"#5C3A1E" }}>{p.regalo}</td>
                        <td style={{ padding:".9rem 1.2rem", fontWeight:600, fontSize:".85rem", color:"#5A0F24" }}>{p.monto}</td>
                        <td style={{ padding:".9rem 1.2rem" }}>
                          <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".72rem", color:eC[p.estado], background:eB[p.estado], borderRadius:"100px", padding:".2rem .7rem" }}>{p.estado}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* proveedores */}
          {sec==="proveedores" && (
            <div style={{ background:"#FFFFFF", borderRadius:"16px", border:"1px solid rgba(155,35,53,.1)", overflow:"hidden", boxShadow:"0 2px 8px rgba(90,15,36,.04)" }}>
              <div style={{ padding:"1.2rem 1.5rem", borderBottom:"1px solid rgba(155,35,53,.08)", fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.1rem", color:"#5A0F24" }}>Proveedores</div>
              {proveedores.map((p,i)=>(
                <div key={p.nombre} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1rem 1.5rem", borderTop:i>0?"1px solid rgba(155,35,53,.06)":"none" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                    <div style={{ width:"40px", height:"40px", borderRadius:"10px", background:"linear-gradient(135deg,rgba(155,35,53,.1),rgba(188,153,104,.15))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem" }}>🏪</div>
                    <div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".9rem", color:"#5A0F24" }}>{p.nombre}</div>
                      <div style={{ fontSize:".75rem", color:"#BC9968" }}>{p.rubro}</div>
                    </div>
                  </div>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".72rem", color:p.estado==="Activo"?"#16a34a":"#9B2335", background:p.estado==="Activo"?"rgba(22,163,74,.1)":"rgba(155,35,53,.1)", borderRadius:"100px", padding:".2rem .7rem" }}>{p.estado}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
