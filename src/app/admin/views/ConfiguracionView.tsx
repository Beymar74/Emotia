"use client";
import React from "react";
import { Shield, Save, Globe } from "lucide-react";

// Switch visual mejorado (ahora es guindo cuando está activo)
const CustomToggle = ({ isOn }: { isOn: boolean }) => (
  <div style={{
    width: "44px", height: "24px", borderRadius: "12px",
    background: isOn ? "#9B2335" : "#e5e7eb", // <-- ¡Color guindo!
    display: "flex", alignItems: "center", padding: "2px",
    transition: "background 0.3s", cursor: "pointer",
    boxSizing: "border-box"
  }}>
    <div style={{
      width: "20px", height: "20px", borderRadius: "50%", background: "white",
      transform: isOn ? "translateX(20px)" : "translateX(0)",
      transition: "transform 0.3s",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
    }} />
  </div>
);

const configuraciones = [
  { id: 1, titulo: "Autenticación de dos factores", descripcion: "Requiere verificación adicional al iniciar sesión", activo: true },
  { id: 2, titulo: "Bloqueo por intentos fallidos", descripcion: "Bloquear cuenta después de 5 intentos fallidos", activo: true },
  { id: 3, titulo: "Registro de actividad", descripcion: "Registrar todas las acciones de los usuarios", activo: true },
  { id: 4, titulo: "Notificaciones de seguridad", descripcion: "Enviar alertas por actividad sospechosa", activo: false },
];

export default function ConfiguracionView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", fontFamily: "'Inter', sans-serif" }}>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        
        {/* COLUMNA IZQUIERDA: Seguridad */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #f3f4f6", paddingBottom: "1rem" }}>
            <Shield size={20} color="#9B2335" />
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#111827" }}>Seguridad</h3>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column" }}>
            {configuraciones.map((conf, index) => (
              <div key={conf.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "1.2rem 0", borderBottom: index !== configuraciones.length - 1 ? "1px solid #f3f4f6" : "none"
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: "#111827", fontSize: "0.95rem", marginBottom: "0.2rem" }}>{conf.titulo}</div>
                  <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>{conf.descripcion}</div>
                </div>
                <CustomToggle isOn={conf.activo} />
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: Parámetros Generales (Sin nombre del sistema) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #f3f4f6", paddingBottom: "1rem" }}>
              <Globe size={20} color="#9B2335" />
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#111827" }}>Parámetros Generales</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>Email de Contacto (Soporte)</label>
                <input type="email" defaultValue="soporte@emotia.com" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", color: "#111827" }} />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>Moneda Principal</label>
                  <select style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", color: "#111827", background: "white" }}>
                    <option>Bolivianos (Bs.)</option>
                    <option>Dólares (USD)</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>Zona Horaria</label>
                  <select style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", color: "#111827", background: "white" }}>
                    <option>America/La_Paz (GMT-4)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Botón Guardar */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={{
              background: "#9B2335", color: "white", border: "none", borderRadius: "8px",
              padding: "0.85rem 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem",
              fontWeight: 600, cursor: "pointer", fontSize: "0.95rem", transition: "background 0.2s",
              boxShadow: "0 4px 6px -1px rgba(155, 35, 53, 0.2)"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#7a1a29"}
            onMouseLeave={e => e.currentTarget.style.background = "#9B2335"}
            >
              <Save size={18} /> Guardar Configuración
            </button>
          </div>
          
        </div>

      </div>
    </div>
  );
}