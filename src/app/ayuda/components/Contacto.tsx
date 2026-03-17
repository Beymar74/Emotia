"use client";
import React, { useState } from "react";
import { useReveal } from "../hooks/useReveal";
const CSS = `
  .ay-input { width:100%; font-family:'DM Sans',sans-serif; font-size:.92rem; color:#3D1A0E; background:#FFFFFF; border:1.5px solid rgba(155,35,53,.18); border-radius:12px; padding:13px 16px; outline:none; transition:border-color .2s,box-shadow .2s; appearance:none; }
  .ay-input::placeholder { color:rgba(92,58,30,.38); }
  .ay-input:focus { border-color:#9B2335; box-shadow:0 0 0 3px rgba(155,35,53,.1); }
  .ay-label { font-family:'DM Sans',sans-serif; font-size:.75rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:#5A0F24; display:block; margin-bottom:.5rem; }
  .ay-btn-p { font-family:'DM Sans',sans-serif; font-weight:700; font-size:.92rem; background:#9B2335; color:#FAF5EE; border:none; border-radius:12px; padding:14px 28px; cursor:pointer; transition:background .2s,transform .15s; box-shadow:0 4px 18px rgba(155,35,53,.28); width:100%; }
  .ay-btn-p:hover:not(:disabled) { background:#7d1a29; transform:translateY(-1px); }
  .ay-btn-p:disabled { opacity:.65; cursor:not-allowed; }
  @keyframes spin { to{transform:rotate(360deg)} }
`;
const temas = ["Problema con mi pedido","Consulta sobre un pago","Retraso en entrega","Afiliación empresarial","Sugerencia","Otro"];
export default function Contacto() {
  const ref = useReveal();
  const formRef = useReveal();
  const [form, setForm] = useState({ nombre:"", email:"", tema:"", mensaje:"" });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k:string, v:string) => setForm(p => ({ ...p, [k]:v }));
  function validate() {
    const e: Record<string,string> = {};
    if (!form.nombre.trim())  e.nombre  = "Requerido";
    if (!form.email.trim())   e.email   = "Requerido";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Correo inválido";
    if (!form.tema)           e.tema    = "Selecciona un tema";
    if (!form.mensaje.trim()) e.mensaje = "Escribe tu mensaje";
    return e;
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
  }
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ background:"linear-gradient(160deg,#5A0F24 0%,#6B1228 100%)", padding:"clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)" }}>
        <div className="ay-reveal" ref={ref} style={{ marginBottom:"clamp(3rem,6vw,5rem)" }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".68rem", letterSpacing:".4em", textTransform:"uppercase", color:"#BC9968", display:"block", marginBottom:".9rem" }}>Contacto</span>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(1.9rem,4vw,3.2rem)", lineHeight:1.1, color:"#FAF5EE", marginBottom:"1rem" }}>
            ¿No encontraste tu <em style={{ fontStyle:"italic" }}>respuesta?</em>
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".92rem", lineHeight:1.85, color:"rgba(245,230,208,.65)", maxWidth:"520px" }}>
            Contáctanos por WhatsApp o por el formulario. Te respondemos en menos de 2 horas.
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,340px),1fr))", gap:"2rem", alignItems:"start" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <a href="https://wa.me/59170000000?text=Hola%20Emotia%2C%20necesito%20ayuda%20con..." target="_blank" rel="noopener noreferrer"
              style={{ display:"flex", alignItems:"center", gap:"1.2rem", background:"rgba(245,230,208,.06)", border:"1px solid rgba(245,230,208,.12)", borderRadius:"16px", padding:"1.6rem", textDecoration:"none", transition:"background .3s,border-color .3s,transform .3s" }}
              onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.background="rgba(37,211,102,.1)"; el.style.borderColor="rgba(37,211,102,.3)"; el.style.transform="translateY(-3px)"; }}
              onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.background="rgba(245,230,208,.06)"; el.style.borderColor="rgba(245,230,208,.12)"; el.style.transform="translateY(0)"; }}
            >
              <div style={{ width:"52px", height:"52px", borderRadius:"14px", background:"#25D366", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1rem", color:"#FAF5EE", marginBottom:".2rem" }}>WhatsApp</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".82rem", color:"rgba(245,230,208,.6)" }}>Respuesta en minutos · 24/7</div>
              </div>
              <div style={{ marginLeft:"auto", color:"rgba(245,230,208,.35)" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg></div>
            </a>
            <a href="mailto:ayuda@emotia.bo"
              style={{ display:"flex", alignItems:"center", gap:"1.2rem", background:"rgba(245,230,208,.06)", border:"1px solid rgba(245,230,208,.12)", borderRadius:"16px", padding:"1.6rem", textDecoration:"none", transition:"background .3s,border-color .3s,transform .3s" }}
              onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.background="rgba(188,153,104,.1)"; el.style.borderColor="rgba(188,153,104,.3)"; el.style.transform="translateY(-3px)"; }}
              onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.background="rgba(245,230,208,.06)"; el.style.borderColor="rgba(245,230,208,.12)"; el.style.transform="translateY(0)"; }}
            >
              <div style={{ width:"52px", height:"52px", borderRadius:"14px", background:"linear-gradient(135deg,#9B2335,#AB3A50)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
              </div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1rem", color:"#FAF5EE", marginBottom:".2rem" }}>Correo electrónico</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".82rem", color:"rgba(245,230,208,.6)" }}>ayuda@emotia.bo · Resp. en &lt; 2h</div>
              </div>
              <div style={{ marginLeft:"auto", color:"rgba(245,230,208,.35)" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg></div>
            </a>
            <div style={{ background:"rgba(245,230,208,.04)", border:"1px solid rgba(245,230,208,.08)", borderRadius:"16px", padding:"1.4rem 1.6rem" }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".72rem", letterSpacing:".12em", textTransform:"uppercase", color:"#BC9968", marginBottom:".8rem" }}>Horario de atención</div>
              {[["Lunes a Viernes","8:00 AM – 8:00 PM"],["Sábados","9:00 AM – 5:00 PM"],["WhatsApp","24h todos los días"]].map(([dia,hora]) => (
                <div key={dia} style={{ display:"flex", justifyContent:"space-between", padding:".4rem 0", borderBottom:"1px solid rgba(245,230,208,.07)" }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".85rem", color:"rgba(245,230,208,.6)" }}>{dia}</span>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".85rem", color:"#FAF5EE" }}>{hora}</span>
                </div>
              ))}
            </div>
          </div>
          <div ref={formRef}>
            {sent ? (
              <div className="ay-reveal" style={{ background:"rgba(245,230,208,.07)", border:"1px solid rgba(188,153,104,.3)", borderRadius:"20px", padding:"3rem 2rem", textAlign:"center" }}>
                <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>✅</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.4rem", color:"#FAF5EE", marginBottom:".75rem" }}>¡Mensaje enviado!</div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".9rem", lineHeight:1.75, color:"rgba(245,230,208,.65)" }}>
                  Recibimos tu mensaje, <strong style={{ color:"#BC9968" }}>{form.nombre}</strong>. Te responderemos a <strong style={{ color:"#BC9968" }}>{form.email}</strong> en menos de 2 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="ay-reveal" style={{ background:"rgba(245,230,208,.05)", border:"1px solid rgba(245,230,208,.1)", borderRadius:"20px", padding:"clamp(1.8rem,4vw,2.8rem)", display:"flex", flexDirection:"column", gap:"1.2rem" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,200px),1fr))", gap:"1.2rem" }}>
                    <div>
                      <label className="ay-label" style={{ color:"rgba(245,230,208,.7)" }}>Nombre *</label>
                      <input className="ay-input" placeholder="Tu nombre" value={form.nombre} onChange={e => set("nombre",e.target.value)} style={{ background:"rgba(255,255,255,.08)", color:"#FAF5EE", borderColor:"rgba(245,230,208,.15)" }} />
                      {errors.nombre && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".72rem", color:"#f87171", marginTop:".3rem" }}>✕ {errors.nombre}</p>}
                    </div>
                    <div>
                      <label className="ay-label" style={{ color:"rgba(245,230,208,.7)" }}>Correo *</label>
                      <input className="ay-input" type="email" placeholder="tu@correo.com" value={form.email} onChange={e => set("email",e.target.value)} style={{ background:"rgba(255,255,255,.08)", color:"#FAF5EE", borderColor:"rgba(245,230,208,.15)" }} />
                      {errors.email && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".72rem", color:"#f87171", marginTop:".3rem" }}>✕ {errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="ay-label" style={{ color:"rgba(245,230,208,.7)" }}>Tema *</label>
                    <select className="ay-input" value={form.tema} onChange={e => set("tema",e.target.value)} style={{ background:"rgba(255,255,255,.08)", color:form.tema?"#FAF5EE":"rgba(245,230,208,.35)", borderColor:"rgba(245,230,208,.15)", cursor:"pointer" }}>
                      <option value="">Selecciona el motivo de contacto</option>
                      {temas.map(t => <option key={t} value={t} style={{ background:"#5A0F24", color:"#FAF5EE" }}>{t}</option>)}
                    </select>
                    {errors.tema && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".72rem", color:"#f87171", marginTop:".3rem" }}>✕ {errors.tema}</p>}
                  </div>
                  <div>
                    <label className="ay-label" style={{ color:"rgba(245,230,208,.7)" }}>Mensaje *</label>
                    <textarea className="ay-input" rows={4} placeholder="Describe tu consulta con el mayor detalle posible..." value={form.mensaje} onChange={e => set("mensaje",e.target.value)} style={{ background:"rgba(255,255,255,.08)", color:"#FAF5EE", borderColor:"rgba(245,230,208,.15)", resize:"vertical", minHeight:"100px" }} />
                    {errors.mensaje && <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".72rem", color:"#f87171", marginTop:".3rem" }}>✕ {errors.mensaje}</p>}
                  </div>
                  <button type="submit" className="ay-btn-p" disabled={loading}>
                    {loading
                      ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:".7rem" }}>
                          <span style={{ width:"16px", height:"16px", border:"2px solid rgba(250,245,238,.4)", borderTopColor:"#FAF5EE", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} />
                          Enviando…
                        </span>
                      : "Enviar mensaje →"
                    }
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
