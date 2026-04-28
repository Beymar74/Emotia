"use client";

import React, { useState } from "react";
import { useReveal } from "../hooks/useReveal";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  .af-reveal { opacity:0; transform:translateY(24px); transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1); }
  .af-reveal.af-visible { opacity:1; transform:translateY(0); }
  .af-input { width:100%; font-family:'DM Sans',sans-serif; font-size:.92rem; font-weight:400; color:#3D1A0E; background:#FFFFFF; border:1.5px solid rgba(155,35,53,.18); border-radius:12px; padding:13px 16px; outline:none; transition:border-color .2s,box-shadow .2s; appearance:none; -webkit-appearance:none; }
  .af-input::placeholder { color:rgba(92,58,30,.38); }
  .af-input:focus { border-color:#9B2335; box-shadow:0 0 0 3px rgba(155,35,53,.1); }
  .af-input:hover:not(:focus) { border-color:rgba(155,35,53,.35); }
  .af-label { font-family:'DM Sans',sans-serif; font-size:.75rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:#5A0F24; display:block; margin-bottom:.5rem; }
  .af-error { font-family:'DM Sans',sans-serif; font-size:.75rem; color:#9B2335; margin-top:.35rem; display:flex; align-items:center; gap:.3rem; }
  .af-btn { width:100%; font-family:'DM Sans',sans-serif; font-weight:700; font-size:.95rem; background:#9B2335; color:#FAF5EE; border:none; border-radius:14px; padding:15px; cursor:pointer; transition:background .2s,transform .15s,box-shadow .2s; box-shadow:0 4px 20px rgba(155,35,53,.28); }
  .af-btn:hover:not(:disabled) { background:#7d1a29; transform:translateY(-1px); box-shadow:0 6px 24px rgba(155,35,53,.38); }
  .af-btn:disabled { opacity:.65; cursor:not-allowed; }
  @keyframes afCheckIn { 0%{transform:scale(0) rotate(-15deg);opacity:0} 60%{transform:scale(1.15) rotate(4deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
  .af-check-anim { animation:afCheckIn .6s cubic-bezier(.16,1,.3,1) forwards; }
  @keyframes afSuccessIn { from{opacity:0;transform:translateY(30px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  .af-success-in { animation:afSuccessIn .7s cubic-bezier(.16,1,.3,1) forwards; }
  @keyframes spin { to{transform:rotate(360deg)} }
`;

const tamanos = ["1 – 10 empleados","11 – 50 empleados","51 – 200 empleados","201 – 500 empleados","Más de 500 empleados"];
const frecuencias = ["Ocasional (fechas puntuales)","Mensual","Trimestral","Todo el año"];

interface FormData {
  empresa: string;
  tamano: string;
  contactoNombre: string;
  contactoEmail: string;
  contactoTelefono: string;
  frecuencia: string;
  mensaje: string;
  terminos: boolean;
}
const initial: FormData = { empresa:"", tamano:"", contactoNombre:"", contactoEmail:"", contactoTelefono:"", frecuencia:"", mensaje:"", terminos:false };

function ErrMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="af-error"><span>✕</span>{msg}</p>;
}

function BlockHeader({ icon, title, sub }: { icon:string; title:string; sub:string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:".8rem", marginBottom:"1.5rem", paddingBottom:"1rem", borderBottom:"1px solid rgba(155,35,53,.08)" }}>
      <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:"linear-gradient(135deg,#9B2335,#AB3A50)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"1.1rem", color:"#5A0F24" }}>{title}</div>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".78rem", color:"rgba(92,58,30,.5)" }}>{sub}</div>
      </div>
    </div>
  );
}

export default function FormAfiliacion() {
  const [form, setForm]       = useState<FormData>(initial);
  const [errors, setErrors]   = useState<Partial<Record<keyof FormData,string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const ref = useReveal();

  const set = (k: keyof FormData, v: string | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }));

  function validate() {
    const e: Partial<Record<keyof FormData,string>> = {};
    if (!form.empresa.trim())         e.empresa         = "El nombre de la empresa es requerido";
    if (!form.tamano)                  e.tamano          = "Selecciona el tamaño de tu empresa";
    if (!form.contactoNombre.trim())   e.contactoNombre  = "El nombre del contacto es requerido";
    if (!form.contactoEmail.trim())    e.contactoEmail   = "El correo es requerido";
    else if (!/\S+@\S+\.\S+/.test(form.contactoEmail)) e.contactoEmail = "Correo inválido";
    if (!form.contactoTelefono.trim()) e.contactoTelefono = "El teléfono es requerido";
    if (!form.frecuencia)              e.frecuencia      = "Selecciona la frecuencia estimada";
    if (!form.terminos)                e.terminos        = "Debes aceptar los términos";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setSuccess(true);
  }

  const grid2: React.CSSProperties = { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,260px),1fr))", gap:"1.2rem" };

  // ── PANTALLA DE ÉXITO ──
  if (success) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={{ minHeight:"100vh", background:"linear-gradient(150deg,#FAF5EE 0%,#f0e6d2 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", paddingTop:"88px" }}>
        <div className="af-success-in" style={{ background:"#FFFFFF", borderRadius:"24px", padding:"clamp(3rem,6vw,5rem) clamp(2rem,5vw,4rem)", maxWidth:"520px", width:"100%", textAlign:"center", boxShadow:"0 24px 80px rgba(90,15,36,.1)", border:"1px solid rgba(155,35,53,.1)" }}>
          <div className="af-check-anim" style={{ width:"80px", height:"80px", borderRadius:"50%", background:"linear-gradient(135deg,#9B2335,#AB3A50)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 2rem", fontSize:"2rem", color:"#FAF5EE" }}>✓</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(1.8rem,4vw,2.6rem)", lineHeight:1.1, color:"#5A0F24", marginBottom:"1rem" }}>
            ¡Solicitud <em style={{ fontStyle:"italic" }}>recibida</em>!
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".95rem", lineHeight:1.8, color:"#5C3A1E", marginBottom:".75rem" }}>
            Gracias, <strong style={{ color:"#9B2335" }}>{form.contactoNombre}</strong>. Hemos recibido la solicitud de <strong style={{ color:"#9B2335" }}>{form.empresa}</strong>.
          </p>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".9rem", lineHeight:1.75, color:"rgba(92,58,30,.65)", marginBottom:"2.5rem" }}>
            Nuestro equipo te contactará en los próximos <strong>2 días hábiles</strong> al correo <strong>{form.contactoEmail}</strong>.
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"1rem", justifyContent:"center" }}>
            <a href="/empresas" style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".88rem", background:"#9B2335", color:"#FAF5EE", textDecoration:"none", borderRadius:"100px", padding:"13px 28px" }}>Ver empresas afiliadas</a>
            <a href="/" style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:".88rem", color:"#9B2335", textDecoration:"none", border:"1.5px solid rgba(155,35,53,.3)", borderRadius:"100px", padding:"13px 28px" }}>Ir al inicio</a>
          </div>
        </div>
      </div>
    </>
  );

  // ── FORMULARIO ──
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* HERO */}
      <section style={{ background:"linear-gradient(150deg,#5A0F24 0%,#8E1B3A 55%,#9B2335 100%)", padding:"clamp(6rem,12vw,10rem) clamp(1.5rem,6vw,6rem) clamp(3rem,6vw,5rem)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='rgba(245,230,208,0.04)' stroke-width='1'/%3E%3C/svg%3E")` }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:"760px", margin:"0 auto", textAlign:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:".6rem", background:"rgba(188,153,104,.15)", border:"1px solid rgba(188,153,104,.3)", borderRadius:"100px", padding:".4rem 1.1rem", marginBottom:"1.8rem" }}>
            <span style={{ fontSize:".6rem", color:"#BC9968" }}>●</span>
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".7rem", letterSpacing:".25em", textTransform:"uppercase", color:"#BC9968" }}>Afiliación Empresarial</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"clamp(2.4rem,5.5vw,4.5rem)", lineHeight:1.08, color:"#FAF5EE", marginBottom:"1.2rem" }}>
            Une tu empresa a la red <em style={{ fontStyle:"italic", color:"#BC9968" }}>Emotia</em>
          </h1>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:"clamp(.95rem,1.8vw,1.1rem)", lineHeight:1.75, color:"rgba(245,230,208,.7)", maxWidth:"560px", margin:"0 auto" }}>
            Completa el formulario y nuestro equipo te contactará en menos de 48 horas para comenzar.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section style={{ background:"linear-gradient(160deg,#FAF5EE 0%,#f0e6d2 100%)", padding:"clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,6rem)" }}>
        <div ref={ref} style={{ maxWidth:"820px", margin:"0 auto" }}>
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ background:"#FFFFFF", borderRadius:"24px", padding:"clamp(2rem,5vw,4rem)", boxShadow:"0 8px 40px rgba(90,15,36,.07)", border:"1px solid rgba(155,35,53,.08)", display:"flex", flexDirection:"column", gap:"2.5rem" }}>

              {/* BLOQUE 1 — Empresa */}
              <div className="af-reveal">
                <BlockHeader icon="🏢" title="Datos de la empresa" sub="Información básica del negocio" />
                <div style={grid2}>
                  <div>
                    <label className="af-label">Nombre de la empresa *</label>
                    <input className="af-input" placeholder="Ej. Constructora Illimani S.A." value={form.empresa} onChange={e => set("empresa", e.target.value)} />
                    <ErrMsg msg={errors.empresa} />
                  </div>
                  <div>
                    <label className="af-label">Tamaño de la empresa *</label>
                    <select className="af-input" value={form.tamano} onChange={e => set("tamano", e.target.value)} style={{ cursor:"pointer" }}>
                      <option value="">Nº de empleados</option>
                      {tamanos.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ErrMsg msg={errors.tamano} />
                  </div>
                </div>
              </div>

              {/* BLOQUE 2 — Contacto */}
              <div className="af-reveal">
                <BlockHeader icon="👤" title="Persona de contacto" sub="Quien gestionará la afiliación" />
                <div style={grid2}>
                  <div style={{ gridColumn:"1 / -1" }}>
                    <label className="af-label">Nombre completo *</label>
                    <input className="af-input" placeholder="Ej. María López" value={form.contactoNombre} onChange={e => set("contactoNombre", e.target.value)} />
                    <ErrMsg msg={errors.contactoNombre} />
                  </div>
                  <div>
                    <label className="af-label">Correo electrónico *</label>
                    <input className="af-input" type="email" placeholder="maria@empresa.com" value={form.contactoEmail} onChange={e => set("contactoEmail", e.target.value)} />
                    <ErrMsg msg={errors.contactoEmail} />
                  </div>
                  <div>
                    <label className="af-label">Teléfono / WhatsApp *</label>
                    <input className="af-input" placeholder="+591 7XXXXXXX" value={form.contactoTelefono} onChange={e => set("contactoTelefono", e.target.value)} />
                    <ErrMsg msg={errors.contactoTelefono} />
                  </div>
                </div>
              </div>

              {/* BLOQUE 3 — Uso de regalos */}
              <div className="af-reveal">
                <BlockHeader icon="🎁" title="Uso de regalos" sub="Cuéntanos cómo planeas usar Emotia" />
                <div style={{ display:"flex", flexDirection:"column", gap:"1.2rem" }}>
                  <div>
                    <label className="af-label">Frecuencia estimada de pedidos *</label>
                    <select className="af-input" value={form.frecuencia} onChange={e => set("frecuencia", e.target.value)} style={{ cursor:"pointer" }}>
                      <option value="">¿Cada cuánto necesitas regalos?</option>
                      {frecuencias.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <ErrMsg msg={errors.frecuencia} />
                  </div>
                  <div>
                    <label className="af-label">¿Para qué ocasiones? (opcional)</label>
                    <textarea className="af-input" rows={3} placeholder="Ej. Cumpleaños de empleados, fin de año, reconocimientos, eventos corporativos..." value={form.mensaje} onChange={e => set("mensaje", e.target.value)} style={{ resize:"vertical", minHeight:"90px" }} />
                  </div>
                </div>
              </div>

              {/* TÉRMINOS + SUBMIT */}
              <div className="af-reveal" style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
                <label style={{ display:"flex", alignItems:"flex-start", gap:".85rem", cursor:"pointer" }}>
                  <div onClick={() => set("terminos", !form.terminos)} style={{ width:"20px", height:"20px", borderRadius:"6px", flexShrink:0, marginTop:"1px", border: form.terminos ? "2px solid #9B2335" : "1.5px solid rgba(155,35,53,.3)", background: form.terminos ? "#9B2335" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", cursor:"pointer" }}>
                    {form.terminos && <span style={{ color:"#FAF5EE", fontSize:".75rem", fontWeight:700, lineHeight:1 }}>✓</span>}
                  </div>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".88rem", lineHeight:1.65, color:"#5C3A1E" }}>
                    Acepto los <a href="#" style={{ color:"#9B2335", textDecoration:"underline" }}>términos y condiciones</a> de afiliación y autorizo a Emotia a contactarme. *
                  </span>
                </label>
                <ErrMsg msg={errors.terminos} />

                <button type="submit" className="af-btn" disabled={loading}>
                  {loading
                    ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:".7rem" }}>
                        <span style={{ width:"16px", height:"16px", border:"2px solid rgba(250,245,238,.4)", borderTopColor:"#FAF5EE", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }} />
                        Enviando solicitud…
                      </span>
                    : "Enviar solicitud de afiliación →"
                  }
                </button>

                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:".75rem", color:"rgba(92,58,30,.45)", textAlign:"center" }}>
                  🔒 Tus datos están protegidos · Respuesta en menos de 48 horas
                </p>
              </div>

            </div>
          </form>
        </div>
      </section>
    </>
  );
}
