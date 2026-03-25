"use client";
import React from "react";
import { Store, Phone, Mail, MapPin, Globe, UploadCloud, Save } from "lucide-react";

export default function PerfilView() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", fontFamily: "'Inter', sans-serif", alignItems: "start" }}>

      {/* COLUMNA IZQUIERDA: Formulario */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Tarjeta 1: Información del Negocio */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #f3f4f6", paddingBottom: "1rem" }}>
            <Store size={20} color="#9B2335" />
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#111827" }}>Información del Negocio</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>Nombre del Negocio</label>
              <input type="text" defaultValue="Flores Illimani" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", color: "#111827" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>Descripción</label>
              <textarea rows={3} defaultValue="Especialistas en arreglos florales premium y detalles personalizados para toda ocasión." style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", resize: "none", color: "#111827" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151", display: "flex", alignItems: "center", gap: "4px" }}><Phone size={14}/> Teléfono</label>
                <input type="text" defaultValue="+591 71234567" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", color: "#111827" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151", display: "flex", alignItems: "center", gap: "4px" }}><Mail size={14}/> Email</label>
                <input type="email" defaultValue="ventas@floresillimani.com" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", color: "#111827" }} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151", display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={14}/> Dirección</label>
              <input type="text" defaultValue="Av. Arce #2520, Zona San Jorge, La Paz" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", color: "#111827" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151", display: "flex", alignItems: "center", gap: "4px" }}><Globe size={14}/> Sitio Web</label>
              <input type="text" defaultValue="https://www.floresillimani.com" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", color: "#111827" }} />
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Logo */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #f3f4f6", paddingBottom: "1rem" }}>
            <UploadCloud size={20} color="#9B2335" />
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#111827" }}>Logo del Negocio</h3>
          </div>

          <div style={{ 
            border: "2px dashed #d1d5db", borderRadius: "8px", padding: "2.5rem 1rem", 
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "#f9fafb", cursor: "pointer", transition: "border 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#9B2335"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#d1d5db"}
          >
            <UploadCloud size={32} color="#9ca3af" style={{ marginBottom: "0.5rem" }} />
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#4b5563", fontWeight: 500 }}>Haz clic para subir o arrastra tu logo aquí</p>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#9ca3af" }}>PNG, JPG o GIF (Max. 2MB)</p>
          </div>
        </div>

      </div>

      {/* COLUMNA DERECHA: Vista Previa y Guardar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Botón Guardar (Destacado) */}
        <button style={{ 
          background: "#9B2335", color: "white", border: "none", borderRadius: "8px",
          padding: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
          fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.95rem",
          boxShadow: "0 4px 6px -1px rgba(155, 35, 53, 0.2)", transition: "background 0.2s"
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#7a1a29"}
        onMouseLeave={e => e.currentTarget.style.background = "#9B2335"}
        >
          <Save size={18} /> Guardar Cambios
        </button>

        {/* Tarjeta de Vista Previa (Para rellenar el vacío y que se vea Pro) */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", overflow: "hidden" }}>
          {/* Header de la tarjeta */}
          <div style={{ height: "90px", background: "linear-gradient(90deg, #701030 0%, #E5BDC2 100%)" }}></div>
          <div style={{ padding: "0 1.5rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "-40px" }}>
            <div style={{ 
              width: "80px", height: "80px", borderRadius: "50%", background: "white", 
              padding: "4px", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
            }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#f8f4ef", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Proveedor" alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
            
            <h3 style={{ margin: "0.75rem 0 0.25rem 0", fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>Flores Illimani</h3>
            <span style={{ background: "rgba(34, 197, 94, 0.1)", color: "#16a34a", padding: "0.2rem 0.6rem", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 600 }}>Proveedor Verificado</span>
            
            <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#6b7280", margin: "1rem 0" }}>
              Especialistas en arreglos florales premium y detalles personalizados para toda ocasión.
            </p>

            <div style={{ width: "100%", borderTop: "1px solid #f3f4f6", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#4b5563" }}>
                <MapPin size={14} color="#9ca3af" /> La Paz, Bolivia
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#4b5563" }}>
                <Store size={14} color="#9ca3af" /> Miembro desde 2026
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}