"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .pg-input { width:100%; font-family:'DM Sans',sans-serif; font-size:.92rem; color:#3D1A0E; background:#FAF5EE; border:1.5px solid rgba(155,35,53,.18); border-radius:12px; padding:13px 16px; outline:none; transition:border-color .2s,box-shadow .2s; appearance:none; }
  .pg-input::placeholder { color:rgba(92,58,30,.38); }
  .pg-input:focus { border-color:#9B2335; box-shadow:0 0 0 3px rgba(155,35,53,.1); background:#fff; }
  .pg-input:hover:not(:focus) { border-color:rgba(155,35,53,.35); }
  .pg-label { font-family:'DM Sans',sans-serif; font-size:.73rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:#5A0F24; display:block; margin-bottom:.5rem; }
  .pg-error { font-family:'DM Sans',sans-serif; font-size:.73rem; color:#9B2335; margin-top:.3rem; }
  .pg-btn { width:100%; font-family:'DM Sans',sans-serif; font-weight:700; font-size:.95rem; background:#9B2335; color:#FAF5EE; border:none; border-radius:14px; padding:15px; cursor:pointer; transition:background .2s,transform .15s,box-shadow .2s; box-shadow:0 4px 20px rgba(155,35,53,.28); }
  .pg-btn:hover:not(:disabled) { background:#7d1a29; transform:translateY(-1px); box-shadow:0 6px 24px rgba(155,35,53,.38); }
  .pg-btn:disabled { opacity:.6; cursor:not-allowed; }
  .pg-method { border:1.5px solid rgba(155,35,53,.15); border-radius:14px; padding:1.1rem 1.3rem; cursor:pointer; transition:border-color .2s,background .2s; display:flex; align-items:center; gap:.9rem; }
  .pg-method.active { border-color:#9B2335; background:rgba(155,35,53,.04); }
  .pg-method:hover { border-color:rgba(155,35,53,.4); }
  @keyframes checkIn { 0%{transform:scale(0) rotate(-15deg);opacity:0} 60%{transform:scale(1.15) rotate(4deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
  .pg-check { animation:checkIn .6s cubic-bezier(.16,1,.3,1) forwards; }
  @keyframes successIn { from{opacity:0;transform:translateY(30px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  .pg-success { animation:successIn .7s cubic-bezier(.16,1,.3,1) forwards; }
  @keyframes spin { to{transform:rotate(360deg)} }
`;

const pedido = [
  { emoji:"🌹", nombre:"Ramo de Rosas Premium",      precio:85,  qty:1 },
  { emoji:"🍫", nombre:"Caja Gourmet Personalizada", precio:120, qty:1 },
  { emoji:"🧴", nombre:"Kit Spa & Bienestar",        precio:150, qty:1 },
];
const ENVIO    = 25;
const CUPONES: Record<string,number> = { EMOTIA10:10, REGALO20:20, BIENVENIDO15:15 };

type Metodo = "tarjeta"|"qr"|"transferencia";

export default function Pago() {
  const router = useRouter();

  // estados
  const [metodo,   setMetodo]   = useState<Metodo>("tarjeta");
  const [cupon,    setCupon]    = useState("");
  const [descuento,setDescuento]= useState(0);
  const [cuponMsg, setCuponMsg] = useState<{ok:boolean;text:string}|null>(null);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  // tarjeta
  const [card, setCard] = useState({ numero:"", nombre:"", expiry:"", cvv:"" });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const setC = (k:string, v:string) => setCard(p=>({...p,[k]:v}));

  const subtotal  = pedido.reduce((a,i)=>a+i.precio*i.qty,0);
  const descMonto = Math.round(subtotal*(descuento/100));
  const total     = subtotal + ENVIO - descMonto;

  function aplicarCupon() {
    const c = cupon.trim().toUpperCase();
    if (CUPONES[c]) {
      setDescuento(CUPONES[c]);
      setCuponMsg({ ok:true, text:`¡Cupón aplicado! ${CUPONES[c]}% de descuento` });
    } else {
      setDescuento(0);
      setCuponMsg({ ok:false, text:"Cupón inválido o expirado" });
    }
  }

  function formatCard(v:string) { return v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim(); }
  function formatExpiry(v:string) { return v.replace(/\D/g,"").slice(0,4).replace(/(\d{2})(\d)/,"$1/$2"); }

  function validate() {
    if (metodo !== "tarjeta") return {};
    const e: Record<string,string> = {};
    if (card.numero.replace(/\s/g,"").length < 16) e.numero  = "Número de tarjeta inválido";
    if (!card.nombre.trim())                        e.nombre  = "Ingresa el nombre";
    if (card.expiry.length < 5)                     e.expiry  = "Fecha inválida";
    if (card.cvv.length < 3)                        e.cvv     = "CVV inválido";
    return e;
  }

  async function handlePagar() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r=>setTimeout(r,2000));
    setLoading(false);
    setSuccess(true);
  }

  // ── ÉXITO ──
  if (success) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={{ minHeight:"100vh", background:"linear-gradient(150deg,#FAF5EE 0%,#f0e6d2 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", paddingTop:"88px" }}>
        <div className="pg-success" style={{ background:"#FFFFFF", borderRadius:"24px", padding:"clamp(3rem,6vw,5rem) clamp(2rem,5vw,4rem)", maxWidth:"520px", width:"100%", textAlign:"center", boxShadow:"0 24px 80px rgba(90,15,36,.1)", border:"1px solid rgba(155,35,53,.1)" }}>
          <div className="pg-check" style={{ width:"80px", height:"80px", borderRadius:"50%", background:"linear-gradient(135deg,#9B2335,#AB3A50)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 2rem", fontSize:"2rem", color:"#FAF5EE" }}>✓</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(1.8rem,4vw,2.6rem)", lineHeight:1.1, color:"#5A0F24", marginBottom:"1rem" }}>
            ¡Pedido <em style={{ fontStyle:"italic" }}>confirmado</em>!
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".95rem", lineHeight:1.8, color:"#5C3A1E", marginBottom:".75rem" }}>
            Tu pedido <strong style={{ color:"#9B2335" }}>#EMO-{Math.floor(Math.random()*90000+10000)}</strong> fue procesado exitosamente.
          </p>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".9rem", lineHeight:1.75, color:"rgba(92,58,30,.65)", marginBottom:"2.5rem" }}>
            Recibirás una confirmación por correo y podrás seguir el estado de tu entrega desde tu cuenta.
          </p>
          <div style={{ background:"rgba(155,35,53,.04)", border:"1px solid rgba(155,35,53,.1)", borderRadius:"14px", padding:"1.2rem", marginBottom:"2rem", display:"flex", flexDirection:"column", gap:".5rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".82rem", color:"rgba(92,58,30,.6)" }}>Total pagado</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.1rem", color:"#9B2335" }}>Bs. {total}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".82rem", color:"rgba(92,58,30,.6)" }}>Método</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".82rem", color:"#5A0F24", textTransform:"capitalize" }}>{metodo === "qr" ? "QR de pago" : metodo === "transferencia" ? "Transferencia" : "Tarjeta"}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".82rem", color:"rgba(92,58,30,.6)" }}>Entrega estimada</span>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".82rem", color:"#5A0F24" }}>1 – 3 días hábiles</span>
            </div>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"1rem", justifyContent:"center" }}>
            <button onClick={() => router.push("/")} style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".88rem", background:"#9B2335", color:"#FAF5EE", border:"none", borderRadius:"100px", padding:"13px 28px", cursor:"pointer", transition:"background .2s" }}
              onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background="#7d1a29"; }}
              onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background="#9B2335"; }}
            >Ir al inicio</button>
            <button onClick={() => router.push("/regalos")} style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:".88rem", color:"#9B2335", background:"transparent", border:"1.5px solid rgba(155,35,53,.3)", borderRadius:"100px", padding:"13px 28px", cursor:"pointer" }}>
              Seguir comprando
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // ── FORMULARIO ──
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* HEADER */}
      <section style={{ background:"linear-gradient(150deg,#5A0F24 0%,#8E1B3A 55%,#9B2335 100%)", padding:"clamp(6rem,10vw,8rem) clamp(1.5rem,6vw,6rem) clamp(2.5rem,5vw,4rem)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='rgba(245,230,208,0.04)' stroke-width='1'/%3E%3C/svg%3E")` }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:"1280px", margin:"0 auto" }}>
          <button onClick={() => router.back()} style={{ display:"inline-flex", alignItems:"center", gap:".5rem", background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:".82rem", color:"rgba(245,230,208,.6)", marginBottom:"1.5rem", padding:0, transition:"color .2s" }}
            onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.color="#FAF5EE"; }}
            onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.color="rgba(245,230,208,.6)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Volver al carrito
          </button>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"clamp(2.4rem,5vw,4rem)", lineHeight:1.06, color:"#FAF5EE", marginBottom:".5rem" }}>
            Completa tu <em style={{ fontStyle:"italic", color:"#BC9968" }}>pago</em>
          </h1>
          {/* pasos */}
          <div style={{ display:"flex", alignItems:"center", gap:".5rem", marginTop:"1.2rem" }}>
            {[["1","Carrito"],["2","Pago"],["3","Confirmación"]].map(([n,label],i)=>(
              <React.Fragment key={n}>
                <div style={{ display:"flex", alignItems:"center", gap:".4rem" }}>
                  <div style={{ width:"24px", height:"24px", borderRadius:"50%", background: i===1?"#BC9968":"rgba(245,230,208,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:".72rem", color: i===1?"#5A0F24":"rgba(245,230,208,.5)" }}>{n}</div>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight: i===1?600:400, fontSize:".78rem", color: i===1?"#FAF5EE":"rgba(245,230,208,.45)" }}>{label}</span>
                </div>
                {i<2 && <div style={{ width:"24px", height:"1px", background:"rgba(245,230,208,.2)" }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section style={{ background:"linear-gradient(160deg,#FAF5EE 0%,#f0e6d2 100%)", padding:"clamp(3rem,6vw,6rem) clamp(1.5rem,6vw,6rem)" }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,420px),1fr))", gap:"2rem", alignItems:"start" }}>

          {/* ── IZQUIERDA: Métodos + Cupón ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>

            {/* Método de pago */}
            <div style={{ background:"#FFFFFF", border:"1px solid rgba(155,35,53,.1)", borderRadius:"20px", padding:"clamp(1.8rem,4vw,2.5rem)", boxShadow:"0 2px 12px rgba(90,15,36,.04)" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.2rem", color:"#5A0F24", marginBottom:"1.2rem" }}>Método de pago</div>

              <div style={{ display:"flex", flexDirection:"column", gap:".7rem", marginBottom:"1.5rem" }}>
                {([["tarjeta","💳","Tarjeta de débito / crédito"],["qr","📱","QR de pago"],["transferencia","🏦","Transferencia bancaria"]] as [Metodo,string,string][]).map(([m,icon,label])=>(
                  <div key={m} className={`pg-method${metodo===m?" active":""}`} onClick={()=>setMetodo(m)}>
                    <div style={{ width:"36px", height:"36px", borderRadius:"10px", background: metodo===m?"linear-gradient(135deg,#9B2335,#AB3A50)":"rgba(155,35,53,.07)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", flexShrink:0, transition:"background .2s" }}>{icon}</div>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight: metodo===m?600:400, fontSize:".9rem", color: metodo===m?"#9B2335":"#5C3A1E", transition:"color .2s" }}>{label}</span>
                    <div style={{ marginLeft:"auto", width:"18px", height:"18px", borderRadius:"50%", border:`2px solid ${metodo===m?"#9B2335":"rgba(155,35,53,.25)"}`, display:"flex", alignItems:"center", justifyContent:"center", transition:"border-color .2s" }}>
                      {metodo===m && <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#9B2335" }} />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel tarjeta */}
              {metodo==="tarjeta" && (
                <div style={{ display:"flex", flexDirection:"column", gap:"1rem", paddingTop:"1rem", borderTop:"1px solid rgba(155,35,53,.08)" }}>
                  <div>
                    <label className="pg-label">Número de tarjeta</label>
                    <input className="pg-input" placeholder="1234 5678 9012 3456" value={card.numero} onChange={e=>setC("numero",formatCard(e.target.value))} maxLength={19} />
                    {errors.numero && <p className="pg-error">✕ {errors.numero}</p>}
                  </div>
                  <div>
                    <label className="pg-label">Nombre en la tarjeta</label>
                    <input className="pg-input" placeholder="Como aparece en la tarjeta" value={card.nombre} onChange={e=>setC("nombre",e.target.value)} />
                    {errors.nombre && <p className="pg-error">✕ {errors.nombre}</p>}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                    <div>
                      <label className="pg-label">Vencimiento</label>
                      <input className="pg-input" placeholder="MM/AA" value={card.expiry} onChange={e=>setC("expiry",formatExpiry(e.target.value))} maxLength={5} />
                      {errors.expiry && <p className="pg-error">✕ {errors.expiry}</p>}
                    </div>
                    <div>
                      <label className="pg-label">CVV</label>
                      <input className="pg-input" placeholder="···" type="password" value={card.cvv} onChange={e=>setC("cvv",e.target.value.replace(/\D/g,"").slice(0,4))} maxLength={4} />
                      {errors.cvv && <p className="pg-error">✕ {errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Panel QR */}
              {metodo==="qr" && (
                <div style={{ paddingTop:"1rem", borderTop:"1px solid rgba(155,35,53,.08)", textAlign:"center" }}>
                  <div style={{ width:"160px", height:"160px", margin:"0 auto 1rem", background:"linear-gradient(135deg,rgba(155,35,53,.08),rgba(188,153,104,.12))", borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"4rem" }}>📱</div>
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".88rem", lineHeight:1.75, color:"#5C3A1E" }}>Escanea el QR con tu app bancaria para completar el pago de <strong style={{ color:"#9B2335" }}>Bs. {total}</strong>.</p>
                </div>
              )}

              {/* Panel Transferencia */}
              {metodo==="transferencia" && (
                <div style={{ paddingTop:"1rem", borderTop:"1px solid rgba(155,35,53,.08)", display:"flex", flexDirection:"column", gap:".7rem" }}>
                  {[["Banco","Banco Bisa"],["Cuenta","1234567890"],["Titular","Emotia S.R.L."],["Referencia","Tu número de pedido"]].map(([k,v])=>(
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:".6rem .9rem", background:"rgba(155,35,53,.03)", borderRadius:"10px" }}>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:".82rem", color:"rgba(92,58,30,.6)" }}>{k}</span>
                      <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".82rem", color:"#5A0F24" }}>{v}</span>
                    </div>
                  ))}
                  <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".78rem", color:"rgba(92,58,30,.5)", marginTop:".3rem" }}>Envía el comprobante por WhatsApp para confirmar tu pedido.</p>
                </div>
              )}
            </div>

            {/* Cupón */}
            <div style={{ background:"#FFFFFF", border:"1px solid rgba(155,35,53,.1)", borderRadius:"20px", padding:"1.6rem 2rem", boxShadow:"0 2px 12px rgba(90,15,36,.04)" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1rem", color:"#5A0F24", marginBottom:"1rem" }}>¿Tienes un cupón?</div>
              <div style={{ display:"flex", gap:".7rem" }}>
                <input className="pg-input" style={{ flex:1 }} placeholder="Ej. EMOTIA10" value={cupon} onChange={e=>setCupon(e.target.value.toUpperCase())}
                  onKeyDown={e=>{ if(e.key==="Enter") aplicarCupon(); }}
                />
                <button onClick={aplicarCupon} style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".82rem", background:"#5A0F24", color:"#FAF5EE", border:"none", borderRadius:"12px", padding:"0 1.2rem", cursor:"pointer", whiteSpace:"nowrap", transition:"background .2s" }}
                  onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background="#9B2335"; }}
                  onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background="#5A0F24"; }}
                >Aplicar</button>
              </div>
              {cuponMsg && (
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".78rem", marginTop:".5rem", color: cuponMsg.ok?"#16a34a":"#9B2335", display:"flex", alignItems:"center", gap:".3rem" }}>
                  {cuponMsg.ok?"✓":"✕"} {cuponMsg.text}
                </p>
              )}
            </div>
          </div>

          {/* ── DERECHA: Resumen ── */}
          <div style={{ background:"#FFFFFF", border:"1px solid rgba(155,35,53,.1)", borderRadius:"20px", padding:"clamp(1.8rem,4vw,2.8rem)", boxShadow:"0 4px 24px rgba(90,15,36,.06)", position:"sticky", top:"88px" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.2rem", color:"#5A0F24", marginBottom:"1.2rem", paddingBottom:"1rem", borderBottom:"1px solid rgba(155,35,53,.08)" }}>
              Resumen del pedido
            </div>

            {/* items */}
            <div style={{ display:"flex", flexDirection:"column", gap:".8rem", marginBottom:"1rem" }}>
              {pedido.map(item=>(
                <div key={item.nombre} style={{ display:"flex", alignItems:"center", gap:".9rem" }}>
                  <div style={{ width:"44px", height:"44px", borderRadius:"10px", background:"linear-gradient(135deg,rgba(155,35,53,.07),rgba(188,153,104,.12))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", flexShrink:0 }}>{item.emoji}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:".85rem", color:"#5A0F24", lineHeight:1.2 }}>{item.nombre}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".75rem", color:"rgba(92,58,30,.5)" }}>× {item.qty}</div>
                  </div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".9rem", color:"#5A0F24", flexShrink:0 }}>Bs. {item.precio*item.qty}</div>
                </div>
              ))}
            </div>

            <div style={{ height:"1px", background:"rgba(155,35,53,.08)", margin:"1rem 0" }} />

            {/* totales */}
            {[["Subtotal",`Bs. ${subtotal}`],["Envío",`Bs. ${ENVIO}`]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:".55rem" }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".88rem", color:"#5C3A1E" }}>{k}</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".9rem", color:"#5A0F24" }}>{v}</span>
              </div>
            ))}

            {descuento>0 && (
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".55rem" }}>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:".88rem", color:"#16a34a" }}>Descuento ({descuento}%)</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".9rem", color:"#16a34a" }}>− Bs. {descMonto}</span>
              </div>
            )}

            <div style={{ height:"1px", background:"rgba(155,35,53,.08)", margin:"1rem 0" }} />

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.8rem" }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.1rem", color:"#5A0F24" }}>Total</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.6rem", color:"#9B2335" }}>Bs. {total}</span>
            </div>

            <button className="pg-btn" onClick={handlePagar} disabled={loading}>
              {loading
                ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:".7rem" }}>
                    <span style={{ width:"16px", height:"16px", border:"2px solid rgba(250,245,238,.4)", borderTopColor:"#FAF5EE", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} />
                    Procesando pago…
                  </span>
                : `Pagar Bs. ${total} →`
              }
            </button>

            <div style={{ marginTop:"1.2rem", display:"flex", flexDirection:"column", gap:".4rem" }}>
              {["🔒 Pago cifrado y seguro","🎁 Empaque personalizado incluido","🚚 Entrega 1–3 días hábiles"].map(g=>(
                <div key={g} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".73rem", color:"rgba(92,58,30,.5)" }}>{g}</div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
