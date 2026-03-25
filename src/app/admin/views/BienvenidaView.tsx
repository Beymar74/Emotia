"use client";
import React from "react";
import { Sparkles, Users, ShoppingBag, Bot, Target, ArrowRight, Lightbulb } from "lucide-react"; // <-- IMPORTADO Lightbulb

// Importamos una fuente cursiva elegante de Google Fonts y los estilos de hover
const FONT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
  
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .tarjeta-hover {
    transition: all 0.3s ease;
  }
  .tarjeta-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px -5px rgba(112, 16, 48, 0.15);
    border-color: #E5BDC2 !important; /* Borde rosa al hover */
  }
`;

// Interfaz para recibir la función de navegación desde el padre
interface BienvenidaProps {
  setSeccionActiva: (seccion: string) => void;
}

export default function BienvenidaView({ setSeccionActiva }: BienvenidaProps) {
  
  // COLOR DEL SISTEMA (Carmesí)
  const COLOR_SISTEMA = "#701030";
  // FONDO SUAVE DEL SISTEMA (Rosa suave con opacidad)
  const BG_SISTEMA_SUAVE = "rgba(229, 189, 194, 0.4)"; 

  const recomendaciones = [
    {
      id: "pedidos",
      icon: <ShoppingBag size={28} color={COLOR_SISTEMA} />, // <-- COLOR AJUSTADO
      bgIcon: BG_SISTEMA_SUAVE, // <-- FONDO AJUSTADO
      titulo: "Revisa los Pedidos",
      desc: "Mantén un ojo en los pedidos pendientes y en proceso. La rapidez en el despacho mejora la satisfacción."
    },
    {
      id: "asistente-ia",
      icon: <Bot size={28} color={COLOR_SISTEMA} />, // <-- COLOR AJUSTADO
      bgIcon: BG_SISTEMA_SUAVE, // <-- FONDO AJUSTADO
      titulo: "Afina tu Asistente IA",
      desc: "Revisa las consultas recientes de vez en cuando. Ajustar las reglas de la IA ayuda a cerrar más ventas."
    },
    {
      id: "proveedores",
      icon: <Users size={28} color={COLOR_SISTEMA} />, // <-- COLOR AJUSTADO
      bgIcon: BG_SISTEMA_SUAVE, // <-- FONDO AJUSTADO
      titulo: "Gestión de Proveedores",
      desc: "Asegúrate de aprobar a los nuevos proveedores rápidamente para que puedan empezar a subir sus catálogos."
    },
    {
      id: "gamificacion",
      icon: <Target size={28} color={COLOR_SISTEMA} />, // <-- COLOR AJUSTADO
      bgIcon: BG_SISTEMA_SUAVE, // <-- FONDO AJUSTADO
      titulo: "Impulsa la Gamificación",
      desc: "Crea nuevas misiones o logros temáticos (ej. San Valentín) para mantener a los usuarios comprando."
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", padding: "1rem" }}>
      <style dangerouslySetInnerHTML={{ __html: FONT_CSS }} />

      {/* SECCIÓN HERO (BIENVENIDA) */}
      <div style={{ 
        background: "linear-gradient(135deg, #ffffff 0%, #fdf2f4 100%)", 
        borderRadius: "20px", padding: "4rem 3rem", 
        border: "1px solid rgba(112, 16, 48, 0.1)",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
        textAlign: "center",
        animation: "fadeUp 0.6s ease-out"
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#701030", color: "white", padding: "8px", borderRadius: "50%", marginBottom: "1.5rem", boxShadow: "0 4px 15px rgba(112, 16, 48, 0.3)" }}>
          <Sparkles size={32} />
        </div>
        
        {/* TEXTO CURSIVO CARMESÍ */}
        <h1 style={{ 
          fontFamily: "'Dancing Script', cursive", 
          fontSize: "4.5rem", 
          color: "#701030", 
          margin: "0 0 1rem 0",
          textShadow: "2px 2px 4px rgba(0,0,0,0.05)"
        }}>
          ¡Bienvenido de vuelta!
        </h1>
        
        <p style={{ color: "#4b5563", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
          Es un gran día para seguir creciendo. Tienes todas las herramientas listas para gestionar inventarios, monitorear la IA y hacer sonreír a tus clientes. ¿Por dónde empezamos hoy?
        </p>
      </div>

      {/* SECCIÓN DE RECOMENDACIONES */}
      <div>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#111827", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          {/* ICONO REEMPLAZADO POR Lightbulb CARMESÍ */}
          <Lightbulb size={24} color={COLOR_SISTEMA} style={{ background: BG_SISTEMA_SUAVE, padding: "4px", borderRadius: "6px" }} /> 
          Recomendaciones para hoy
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          {recomendaciones.map((rec, index) => (
            <div 
              key={index} 
              className="tarjeta-hover"
              onClick={() => setSeccionActiva(rec.id)}
              style={{ 
                background: "white", borderRadius: "16px", padding: "1.8rem", 
                border: "1px solid #e5e7eb", cursor: "pointer",
                display: "flex", flexDirection: "column", gap: "1rem",
                animation: `fadeUp 0.6s ease-out ${index * 0.1}s both` // Animación escalonada
              }}
            >
              <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: rec.bgIcon, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {rec.icon}
              </div>
              <div>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>{rec.titulo}</h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280", lineHeight: "1.5" }}>{rec.desc}</p>
              </div>
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "0.4rem", color: "#701030", fontSize: "0.9rem", fontWeight: 600 }}>
                Ir a la sección <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}