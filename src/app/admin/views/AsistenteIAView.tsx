"use client";
import React, { useState } from "react";
import { 
  Bot, CheckCircle, Clock, Star, Settings, ShieldAlert, MessageSquare, 
  Plus, Edit, Trash2, ToggleRight, ToggleLeft, ArrowRight, User, Sparkles
} from "lucide-react";

// --- DATOS DE PRUEBA ---
const kpisIA = [
  { icon: <MessageSquare size={20} color="#701030" />, label: "Consultas Hoy", valor: "1,245", sub: "+15% vs ayer" },
  { icon: <CheckCircle size={20} color="#16a34a" />, label: "Tasa de Resolución", valor: "85%", sub: "Autónoma" },
  { icon: <Clock size={20} color="#ca8a04" />, label: "Tiempo Medio", valor: "1.2s", sub: "De respuesta" },
  { icon: <Star size={20} color="#0284c7" />, label: "Satisfacción", valor: "4.8/5", sub: "Basado en encuestas" },
];

const reglasIniciales = [
  { id: 1, texto: "Priorizar productos locales", estado: "Activa" },
  { id: 2, texto: "Evitar recomendar alcohol a menores de 18", estado: "Activa" },
  { id: 3, texto: "Ofrecer envío express en joyas", estado: "Inactiva" },
];

const consultasIniciales = [
  { id: 1, usuario: "Busco regalo para mi novia", ia: "Recomendado: Collar de plata 925 con diseño...", estado: "Resuelto", tiempo: "Hace 5 min" },
  { id: 2, usuario: "¿Tienen envíos a Santa Cruz?", ia: "Derivado a soporte humano para gestionar envío especial.", estado: "Derivado", tiempo: "Hace 12 min" },
  { id: 3, usuario: "Quiero una torta de chocolate", ia: "¡Claro! Aquí tienes 3 opciones de reposterías locales:", estado: "Resuelto", tiempo: "Hace 28 min" },
  { id: 4, usuario: "Mi pedido llegó roto", ia: "Lamento mucho escuchar eso. Te derivaré inmediatamente a...", estado: "Derivado", tiempo: "Hace 1 hora" },
];

// --- COMPONENTES AUXILIARES (Badges) ---
const BadgeRegla = ({ estado }: { estado: string }) => {
  const isActive = estado === "Activa";
  return (
    <span style={{ 
      background: isActive ? "#dcfce7" : "#f3f4f6", 
      color: isActive ? "#16a34a" : "#6b7280", 
      padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600 
    }}>
      {estado}
    </span>
  );
};

const BadgeConsulta = ({ estado }: { estado: string }) => {
  const isResuelto = estado === "Resuelto";
  return (
    <span style={{ 
      background: isResuelto ? "#dcfce7" : "#ffedd5", 
      color: isResuelto ? "#16a34a" : "#ea580c", 
      padding: "4px 10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600 
    }}>
      {estado}
    </span>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function AsistenteIAView() {
  // Estados de Configuración Base
  const [personalidad, setPersonalidad] = useState("Profesional y Empático");
  const [limitePresupuesto, setLimitePresupuesto] = useState<number>(500);
  const [soloStock, setSoloStock] = useState(true);

  // Estados de Listas
  const [reglas, setReglas] = useState(reglasIniciales);
  const [consultas] = useState(consultasIniciales);

  // Acciones Simples
  const manejarGuardarConfig = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Configuración de comportamiento guardada con éxito.");
  };

  const alternarRegla = (id: number) => {
    setReglas(reglas.map(r => {
      if (r.id === id) {
        return { ...r, estado: r.estado === "Activa" ? "Inactiva" : "Activa" };
      }
      return r;
    }));
  };

  const eliminarRegla = (id: number) => {
    if(confirm("¿Seguro que deseas eliminar esta regla?")) {
      setReglas(reglas.filter(r => r.id !== id));
    }
  };

  const agregarRegla = () => {
    const nueva = prompt("Escribe la nueva regla para la IA:");
    if (nueva && nueva.trim() !== "") {
      setReglas([...reglas, { id: Date.now(), texto: nueva, estado: "Activa" }]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* 1. Cabecera */}
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", margin: "0 0 0.5rem 0" }}>Panel de Control IA</h2>
        <p style={{ color: "#6b7280", margin: 0, fontSize: "0.95rem" }}>Supervisa y configura el comportamiento del asistente virtual.</p>
      </div>

      {/* 2. KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
        {kpisIA.map((kpi, index) => (
          <div key={index} style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {kpi.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280", fontWeight: 500 }}>{kpi.label}</p>
              <h3 style={{ margin: "0.2rem 0", fontSize: "1.4rem", fontWeight: 700, color: "#111827" }}>{kpi.valor}</h3>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Contenedor Principal (2 Columnas) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>
        
        {/* =========================================
            COLUMNA IZQUIERDA: CONFIGURACIÓN Y REGLAS
        ============================================= */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* TARJETA 1: Comportamiento Base */}
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <Settings size={20} color="#701030" />
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 600, color: "#111827" }}>Comportamiento Base</h3>
            </div>

            <form onSubmit={manejarGuardarConfig} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "0.4rem" }}>Personalidad del Asistente</label>
                <select value={personalidad} onChange={e => setPersonalidad(e.target.value)} style={{ width: "100%", padding: "0.7rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", background: "white", color: "#111827" }}>
                  <option value="Profesional y Empático">Profesional y Empático</option>
                  <option value="Casual y Amigable">Casual y Amigable</option>
                  <option value="Directo y Breve">Directo y Breve</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "0.4rem" }}>Límite de Presupuesto Sugerido (Bs.)</label>
                <input type="number" min="0" value={limitePresupuesto} onChange={e => setLimitePresupuesto(Number(e.target.value))} style={{ width: "100%", padding: "0.7rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", color: "#111827" }} />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.8rem", border: "1px solid #e5e7eb", borderRadius: "8px", background: "#f9fafb" }}>
                <div>
                  <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600, color: "#374151" }}>Restricciones de Inventario</p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#6b7280" }}>Solo mostrar productos en stock</p>
                </div>
                <div onClick={() => setSoloStock(!soloStock)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                  {soloStock ? <ToggleRight size={32} color="#16a34a" /> : <ToggleLeft size={32} color="#9ca3af" />}
                </div>
              </div>

              <button type="submit" style={{ marginTop: "0.5rem", width: "100%", padding: "0.8rem", background: "#701030", border: "none", borderRadius: "8px", color: "white", fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#5a0d26"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#701030"}>
                Guardar Configuración
              </button>
            </form>
          </div>

          {/* TARJETA 2: Gestión de Reglas IA */}
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldAlert size={20} color="#701030" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 600, color: "#111827" }}>Gestión de Reglas IA</h3>
              </div>
              <button onClick={agregarRegla} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.8rem", background: "#f3f4f6", border: "none", borderRadius: "6px", color: "#374151", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                <Plus size={16} /> Nueva Regla
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {reglas.map((regla) => (
                <div key={regla.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.8rem 1rem", border: "1px solid #e5e7eb", borderRadius: "8px", background: regla.estado === "Inactiva" ? "#f9fafb" : "white" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: regla.estado === "Inactiva" ? "#6b7280" : "#111827", fontWeight: 500 }}>
                      {regla.texto}
                    </p>
                    <div style={{ marginTop: "6px" }}>
                      <BadgeRegla estado={regla.estado} />
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    <button onClick={() => alternarRegla(regla.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "6px" }} title="Activar/Desactivar">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => eliminarRegla(regla.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "6px" }} title="Eliminar Regla">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* =========================================
            COLUMNA DERECHA: CONSULTAS RECIENTES
        ============================================= */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <MessageSquare size={20} color="#701030" />
            <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 600, color: "#111827" }}>Registro de Consultas Recientes</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
            {consultas.map((consulta) => (
              <div key={consulta.id} style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "8px", background: "#f9fafb" }}>
                
                {/* Encabezado del Chat */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                  <BadgeConsulta estado={consulta.estado} />
                  <span style={{ fontSize: "0.75rem", color: "#9ca3af", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={12} /> {consulta.tiempo}
                  </span>
                </div>

                {/* Mensaje Usuario */}
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.8rem" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#e0e7ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <User size={16} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 600, color: "#4b5563" }}>Usuario</p>
                    <p style={{ margin: "2px 0 0", fontSize: "0.9rem", color: "#111827" }}>"{consulta.usuario}"</p>
                  </div>
                </div>

                {/* Respuesta IA */}
                <div style={{ display: "flex", gap: "0.75rem", padding: "0.8rem", background: "white", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#fce7f3", color: "#db2777", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 600, color: "#db2777" }}>Emotia AI</p>
                    <p style={{ margin: "2px 0 0", fontSize: "0.9rem", color: "#374151" }}>{consulta.ia}</p>
                  </div>
                </div>

              </div>
            ))}
          </div>

          <button style={{ marginTop: "1.5rem", width: "100%", padding: "0.8rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "background 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "white"}>
            Ver Historial Completo <ArrowRight size={16} />
          </button>

        </div>
      </div>
      
    </div>
  );
}