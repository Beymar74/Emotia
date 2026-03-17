"use client";
import React, { useState } from "react";
import { useReveal } from "../hooks/useReveal";
const faqs = [
  { grupo:"Pedidos y compras", items:[
    { q:"¿Cómo realizo un pedido en Emotia?",         a:"Ingresa a la plataforma, inicia una conversación con nuestro asesor IA y cuéntale para quién es el regalo, la ocasión y tu presupuesto. El asistente te sugerirá opciones personalizadas. Elige la que más te guste, personalízala y confirma el pago." },
    { q:"¿Puedo cancelar o modificar un pedido?",     a:"Puedes cancelar o modificar tu pedido dentro de las primeras 2 horas después de confirmarlo, siempre que el proveedor no haya iniciado la preparación. Escríbenos por WhatsApp con tu número de pedido." },
    { q:"¿Cuánto tiempo tarda en llegar mi regalo?",  a:"Los regalos estándar tienen un tiempo de entrega de 1 a 3 días hábiles en La Paz. Productos personalizados pueden tomar entre 3 y 5 días hábiles. Siempre verás el tiempo estimado antes de confirmar." },
  ]},
  { grupo:"Pagos y facturación", items:[
    { q:"¿Qué métodos de pago aceptan?",              a:"Aceptamos tarjetas de débito y crédito (Visa, Mastercard), transferencia bancaria, QR de pago y para empresas afiliadas también órdenes de compra. Todos los pagos están protegidos con cifrado SSL." },
    { q:"¿Cómo solicito una factura?",                a:"Durante el proceso de pago encontrarás la opción de ingresar tus datos de facturación. Si olvidaste solicitarla, contáctanos dentro de las 48 horas posteriores a tu compra." },
    { q:"¿Cómo funciona el proceso de reembolso?",    a:"Si tu pedido llegó incompleto, dañado o no corresponde a lo que compraste, tienes hasta 48 horas desde la entrega para reportarlo. Procesamos el reembolso en 5 días hábiles." },
  ]},
  { grupo:"Envíos y seguimiento", items:[
    { q:"¿Cómo rastro el estado de mi pedido?",       a:"Desde tu cuenta en Emotia puedes ver el estado en tiempo real. También recibirás notificaciones automáticas por correo en cada etapa: confirmado, en preparación, en camino y entregado." },
    { q:"¿Hacen entregas fuera de La Paz?",           a:"Actualmente operamos en La Paz y El Alto. Estamos expandiendo nuestra red a otras ciudades de Bolivia. Si necesitas entrega en otra ciudad, contáctanos y evaluamos la posibilidad." },
    { q:"¿Qué pasa si el destinatario no está?",      a:"El repartidor intentará la entrega hasta 2 veces. Si no hay nadie, te notificamos para coordinar un nuevo horario sin costo adicional." },
  ]},
  { grupo:"Empresas afiliadas", items:[
    { q:"¿Cómo puedo afiliar mi empresa?",            a:"Ingresa a la sección Empresas y completa el formulario de afiliación. El proceso toma menos de 5 minutos y nuestro equipo te contactará en menos de 48 horas para activar tu cuenta corporativa." },
    { q:"¿Pueden gestionar pedidos para múltiples empleados?", a:"Sí. Las empresas afiliadas tienen acceso a un panel corporativo donde pueden crear listas de destinatarios, asignar presupuestos por área y generar múltiples pedidos simultáneos." },
    { q:"¿Tienen tarifas especiales para empresas?",  a:"Sí. Las empresas afiliadas acceden a tarifas preferenciales, descuentos por volumen y condiciones especiales de entrega coordinadas con tu ejecutivo de cuenta asignado." },
  ]},
];
function AccordionItem({ q, a, isOpen, onToggle }: { q:string; a:string; isOpen:boolean; onToggle:()=>void }) {
  return (
    <div style={{ borderBottom:"1px solid rgba(155,35,53,.1)" }}>
      <button onClick={onToggle} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem", padding:"1.3rem 0", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".95rem", color:isOpen?"#9B2335":"#5A0F24", lineHeight:1.4, transition:"color .2s" }}>{q}</span>
        <div style={{ width:"28px", height:"28px", borderRadius:"50%", border:`1.5px solid ${isOpen?"#9B2335":"rgba(155,35,53,.25)"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, background:isOpen?"#9B2335":"transparent", transition:"all .25s" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isOpen?"#FAF5EE":"#9B2335"} strokeWidth="2.5" strokeLinecap="round" style={{ transform:isOpen?"rotate(180deg)":"rotate(0deg)", transition:"transform .25s" }}><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </button>
      <div style={{ overflow:"hidden", maxHeight:isOpen?"400px":"0", transition:"max-height .4s cubic-bezier(.16,1,.3,1)", opacity:isOpen?1:0 }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:400, fontSize:".9rem", lineHeight:1.8, color:"#5C3A1E", paddingBottom:"1.3rem" }}>{a}</p>
      </div>
    </div>
  );
}
export default function FAQ() {
  const ref = useReveal();
  const [openKey, setOpenKey] = useState<string|null>(null);
  const [grupoActivo, setGrupoActivo] = useState(faqs[0].grupo);
  const toggle = (key:string) => setOpenKey(prev => prev===key ? null : key);
  const grupoData = faqs.find(f => f.grupo===grupoActivo)!;
  return (
    <section style={{ background:"#FFFFFF", padding:"clamp(4rem,8vw,8rem) clamp(1.5rem,6vw,6rem)" }}>
      <div className="ay-reveal" ref={ref} style={{ marginBottom:"clamp(2.5rem,5vw,4.5rem)" }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".68rem", letterSpacing:".4em", textTransform:"uppercase", color:"#BC9968", display:"block", marginBottom:".9rem" }}>FAQ</span>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(1.9rem,4vw,3.2rem)", lineHeight:1.1, color:"#5A0F24", marginBottom:"1rem" }}>
          Preguntas <em style={{ fontStyle:"italic" }}>frecuentes</em>
        </h2>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,280px),1fr))", gap:"3rem", alignItems:"start" }}>
        <div className="ay-reveal" style={{ display:"flex", flexDirection:"column", gap:".4rem" }}>
          {faqs.map(f => (
            <button key={f.grupo} onClick={() => { setGrupoActivo(f.grupo); setOpenKey(null); }}
              style={{ display:"flex", alignItems:"center", gap:".8rem", padding:"1rem 1.2rem", borderRadius:"12px", border:"none", background:grupoActivo===f.grupo?"rgba(155,35,53,.08)":"transparent", cursor:"pointer", textAlign:"left", transition:"background .2s" }}
              onMouseEnter={e => { if(grupoActivo!==f.grupo)(e.currentTarget as HTMLElement).style.background="rgba(155,35,53,.04)"; }}
              onMouseLeave={e => { if(grupoActivo!==f.grupo)(e.currentTarget as HTMLElement).style.background="transparent"; }}
            >
              <div style={{ width:"4px", height:"20px", borderRadius:"2px", background:grupoActivo===f.grupo?"#9B2335":"rgba(155,35,53,.15)", transition:"background .2s", flexShrink:0 }} />
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:grupoActivo===f.grupo?600:400, fontSize:".9rem", color:grupoActivo===f.grupo?"#9B2335":"#5C3A1E", transition:"color .2s" }}>{f.grupo}</span>
            </button>
          ))}
        </div>
        <div className="ay-reveal">
          {grupoData.items.map(item => {
            const key = `${grupoActivo}-${item.q}`;
            return <AccordionItem key={key} q={item.q} a={item.a} isOpen={openKey===key} onToggle={() => toggle(key)} />;
          })}
        </div>
      </div>
    </section>
  );
}
