"use client";
import React, { useState, useMemo } from "react";
import { 
  Gamepad2, Award, Coins, TrendingUp, Trophy, Target, 
  Plus, Edit, Trash2, ToggleRight, ToggleLeft, X, Medal, Crown, Palette
} from "lucide-react";

// --- INTERFACES DE TYPESCRIPT ---
interface Nivel {
  id: number;
  nombre: string;
  // rango: string; <-- ELIMINADO
  puntosMin: number; // <-- NUEVO
  puntosMax: number | null; // <-- NUEVO (null = ilimitado top)
  beneficio: string;
  activo: boolean;
  color: string;
}

interface Logro {
  id: number;
  nombre: string;
  puntos: number;
  descripcion: string;
}

interface RankingUser {
  id: number;
  posicion: number;
  nombre: string;
  iniciales: string;
  color: string;
  nivel: string;
  puntos: number;
}

// --- DATOS INICIALES DE PRUEBA ACTUALIZADOS ---
const kpisGamificacion = [
  { icon: <Gamepad2 size={20} color="#701030" />, label: "Usuarios Activos (Juego)", valor: "1,245", sub: "+15% este mes" },
  { icon: <Award size={20} color="#16a34a" />, label: "Logros Desbloqueados", valor: "8,420", sub: "+12% vs mes anterior" },
  { icon: <Coins size={20} color="#ca8a04" />, label: "Puntos Repartidos", valor: "45,200", sub: "En circulación" },
  { icon: <TrendingUp size={20} color="#0284c7" />, label: "Tasa de Retención", valor: "68%", sub: "+5% por gamificación" },
];

const nivelesIniciales: Nivel[] = [
  // Actualizados para usar puntosMin y puntosMax matemáticos
  { id: 1, nombre: "Bronce", puntosMin: 0, puntosMax: 500, beneficio: "0% descuento", activo: true, color: "#b45309" }, 
  { id: 2, nombre: "Plata", puntosMin: 501, puntosMax: 2000, beneficio: "5% descuento", activo: true, color: "#9ca3af" }, 
  { id: 3, nombre: "Oro", puntosMin: 2001, puntosMax: 5000, beneficio: "10% descuento", activo: true, color: "#eab308" }, 
  { id: 4, nombre: "Platino", puntosMin: 5001, puntosMax: null, beneficio: "Envío Gratis", activo: true, color: "#06b6d4" }, 
];

const logrosIniciales: Logro[] = [
  { id: 1, nombre: "Primera Compra", puntos: 50, descripcion: "Completar el primer pedido" },
  { id: 2, nombre: "Comprador Frecuente", puntos: 200, descripcion: "Realizar 5 compras en un mes" },
  { id: 3, nombre: "Cazador de Ofertas", puntos: 100, descripcion: "Comprar 3 productos en descuento" },
  { id: 4, nombre: "Amigo Fiel", puntos: 150, descripcion: "Invitar a un amigo a la plataforma" },
];

const rankingInicial: RankingUser[] = [
  { id: 1, posicion: 1, nombre: "Ana Martínez", iniciales: "AM", color: "#fca5a5", nivel: "Platino", puntos: 6240 },
  { id: 2, posicion: 2, nombre: "Carlos Ruiz", iniciales: "CR", color: "#93c5fd", nivel: "Oro", puntos: 4850 },
  { id: 3, posicion: 3, nombre: "Elena Gómez", iniciales: "EG", color: "#d8b4fe", nivel: "Oro", puntos: 3920 },
  { id: 4, posicion: 4, nombre: "Roberto Díaz", iniciales: "RD", color: "#fcd34d", nivel: "Plata", puntos: 1840 },
  { id: 5, posicion: 5, nombre: "Sofía Castro", iniciales: "SC", color: "#86efac", nivel: "Plata", puntos: 1200 },
];

// --- COMPONENTES AUXILIARES ---
const BadgeNivel = ({ nivel }: { nivel: string }) => {
  const estilos: Record<string, { bg: string, text: string }> = {
    "Bronce": { bg: "#fef3c7", text: "#b45309" },
    "Plata": { bg: "#f3f4f6", text: "#4b5563" },
    "Oro": { bg: "#fef08a", text: "#a16207" },
    "Platino": { bg: "#e0f2fe", text: "#0369a1" }
  };
  const estilo = estilos[nivel] || estilos["Bronce"];
  return (
    <span style={{ background: estilo.bg, color: estilo.text, padding: "2px 8px", borderRadius: "12px", fontSize: "0.7rem", fontWeight: 700 }}>
      {nivel}
    </span>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function GamificacionView() {
  const [niveles, setNiveles] = useState<Nivel[]>(nivelesIniciales);
  const [logros, setLogros] = useState<Logro[]>(logrosIniciales);

  // Estados para Modales
  const [modalNivelAbierto, setModalNivelAbierto] = useState(false);
  const [formNivel, setFormNivel] = useState({ nombre: "", puntosMin: 0, beneficio: "", color: "#8b5cf6" });

  const [modalLogroAbierto, setModalLogroAbierto] = useState(false);
  const [logroEditando, setLogroEditando] = useState<Logro | null>(null);
  const [formLogro, setFormLogro] = useState({ nombre: "", puntos: 50, descripcion: "" });

  // Ordenar niveles por puntos máximos descendentes para el renderizado
  const nivelesOrdenados = useMemo(() => {
    return [...niveles].sort((a, b) => b.puntosMin - a.puntosMin);
  }, [niveles]);

  // --- MANEJADORES NIVELES ---
  const alternarNivel = (id: number) => {
    setNiveles(niveles.map(n => n.id === id ? { ...n, activo: !n.activo } : n));
  };

  const guardarNivel = (e: React.FormEvent) => {
    e.preventDefault();

    // LÓGICA DE AUTO-AJUSTE:
    // Al añadir un nivel que empieza en X puntos, buscamos el nivel actual más alto (que tenía max null) 
    // y lo limitamos a X-1.

    // 1. Encontrar el nivel más alto actual (el que tiene puntosMax en null)
    const nivelMasAltoActual = niveles.find(n => n.puntosMax === null);

    // Validación básica: El nuevo nivel debe empezar después del inicio del actual más alto
    if (nivelMasAltoActual && formNivel.puntosMin <= nivelMasAltoActual.puntosMin) {
        alert(`El nuevo nivel debe empezar después de ${nivelMasAltoActual.nombre} (requiere más de ${nivelMasAltoActual.puntosMin} pts).`);
        return;
    }

    // 2. Crear el arreglo actualizado limitando el anterior
    const nivelesActualizados = niveles.map(n => {
        if (n.puntosMax === null) {
            // Este era el top, ahora lo limitamos
            return { ...n, puntosMax: formNivel.puntosMin - 1 };
        }
        return n;
    });

    // 3. Crear el nuevo nivel (que será el nuevo top, max null)
    const nuevoNivel: Nivel = {
        ...formNivel,
        id: Date.now(),
        puntosMax: null, // El nuevo siempre es ilimitado top
        activo: false // Inicia inactivo
    };

    setNiveles([...nivelesActualizados, nuevoNivel]);
    setModalNivelAbierto(false);
    // Reset form
    setFormNivel({ nombre: "", puntosMin: 0, beneficio: "", color: "#8b5cf6" });
  };

  const eliminarNivel = (id: number, nombre: string) => {
    if (confirm(`¿Estás seguro de eliminar el nivel ${nombre}? Esto causará un hueco en la lógica de puntos que deberás arreglar manualmente.`)) {
        setNiveles(niveles.filter(n => n.id !== id));
    }
  };

  // --- MANEJADORES LOGROS ---
  const abrirModalLogro = (logro?: Logro) => {
    if (logro) {
      setLogroEditando(logro);
      setFormLogro({ nombre: logro.nombre, puntos: logro.puntos, descripcion: logro.descripcion });
    } else {
      setLogroEditando(null);
      setFormLogro({ nombre: "", puntos: 50, descripcion: "" });
    }
    setModalLogroAbierto(true);
  };

  const eliminarLogro = (id: number) => {
    if (confirm("¿Seguro de eliminar este logro?")) {
      setLogros(logros.filter(l => l.id !== id));
    }
  };

  const guardarLogro = (e: React.FormEvent) => {
    e.preventDefault();
    if (logroEditando) {
      setLogros(logros.map(l => l.id === logroEditando.id ? { ...l, ...formLogro } : l));
    } else {
      setLogros([...logros, { id: Date.now(), ...formLogro }]);
    }
    setModalLogroAbierto(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", position: "relative" }}>
      
      {/* 1. Cabecera */}
      <div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827", margin: "0 0 0.5rem 0" }}>Sistema de Gamificación</h2>
        <p style={{ color: "#6b7280", margin: 0, fontSize: "0.95rem" }}>Configura los logros, niveles y visualiza a los usuarios más activos.</p>
      </div>

      {/* 2. KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }}>
        {kpisGamificacion.map((kpi, index) => (
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

      {/* 3. Contenedor Principal Diviso (2 Columnas, Layout Figma Restaurado) */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem", alignItems: "start" }}>
        
        {/* =========================================
            COLUMNA IZQUIERDA: CONFIGURACIÓN
        ============================================= */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* TARJETA 1: Niveles de Usuario (Renderizado Arreglado) */}
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <Trophy size={20} color="#701030" />
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 600, color: "#111827" }}>Niveles de Usuario</h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {nivelesOrdenados.map((nivel) => (
                <div key={nivel.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "8px", background: nivel.activo ? "white" : "#f9fafb", opacity: nivel.activo ? 1 : 0.6, transition: "all 0.2s" }}>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {/* Escudo de Color */}
                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: `${nivel.color}20`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${nivel.color}50` }}>
                      <Medal size={24} color={nivel.color} />
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <p style={{ margin: 0, fontWeight: 700, color: "#111827", fontSize: "1rem" }}>{nivel.nombre}</p>
                        {/* FORMATEO DE RANGO AUTOMÁTICO */}
                        <span style={{ fontSize: "0.75rem", background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px", color: "#4b5563", fontWeight: 500 }}>
                          {nivel.puntosMax === null 
                            ? `+ ${nivel.puntosMin.toLocaleString()}` 
                            : `${nivel.puntosMin.toLocaleString()} - ${nivel.puntosMax.toLocaleString()}`
                          } pts
                        </span>
                      </div>
                      <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.85rem" }}>Beneficio: <span style={{ fontWeight: 500, color: "#374151" }}>{nivel.beneficio}</span></p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {/* Botón Eliminar Nivel (Solo para creados, no los iniciales básicos por seguridad en test) */}
                    {nivel.id > 10 && (
                        <button onClick={() => eliminarNivel(nivel.id, nivel.nombre)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "4px" }}>
                            <Trash2 size={16} />
                        </button>
                    )}
                    <div onClick={() => alternarNivel(nivel.id)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }} title={nivel.activo ? "Desactivar Nivel" : "Activar Nivel"}>
                        {nivel.activo ? <ToggleRight size={32} color="#16a34a" /> : <ToggleLeft size={32} color="#9ca3af" />}
                    </div>
                  </div>

                </div>
              ))}
            </div>

            <button onClick={() => setModalNivelAbierto(true)} style={{ marginTop: "1.5rem", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.8rem", background: "#f9fafb", border: "1px dashed #d1d5db", borderRadius: "8px", color: "#374151", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#f9fafb"}>
              <Plus size={18} /> Añadir Nivel
            </button>
          </div>

          {/* TARJETA 2: Gestión de Logros y Misiones */}
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Target size={20} color="#701030" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 600, color: "#111827" }}>Gestión de Logros y Misiones</h3>
              </div>
              <button onClick={() => abrirModalLogro()} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", background: "#701030", border: "none", borderRadius: "8px", color: "white", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#5a0d26"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#701030"}>
                <Plus size={16} /> Nuevo Logro
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {logros.map((logro) => (
                <div key={logro.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "8px", background: "#f9fafb" }}>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#ffedd5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Award size={22} color="#ea580c" />
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <p style={{ margin: 0, fontWeight: 700, color: "#111827", fontSize: "0.95rem" }}>{logro.nombre}</p>
                        <span style={{ fontSize: "0.7rem", background: "#dcfce7", color: "#16a34a", padding: "2px 6px", borderRadius: "10px", fontWeight: 700 }}>
                          +{logro.puntos} pts
                        </span>
                      </div>
                      <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "0.85rem" }}>{logro.descripcion}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    <button onClick={() => abrirModalLogro(logro)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "6px" }} title="Editar">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => eliminarLogro(logro.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "6px" }} title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>

        {/* =========================================
            COLUMNA DERECHA: RANKING DE USUARIOS
        ============================================= */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <Crown size={20} color="#701030" />
            <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 600, color: "#111827" }}>Ranking de Usuarios</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {rankingInicial.map((user) => (
              <div key={user.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.8rem", borderBottom: "1px solid #f3f4f6" }}>
                
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {/* Número de Posición */}
                  <div style={{ width: "24px", textAlign: "center", fontWeight: 800, color: user.posicion <= 3 ? "#eab308" : "#9ca3af", fontSize: "1.1rem" }}>
                    {user.posicion}
                  </div>
                  
                  {/* Avatar */}
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: user.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "0.85rem" }}>
                    {user.iniciales}
                  </div>
                  
                  {/* Info Usuario */}
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: "#111827", fontSize: "0.9rem" }}>{user.nombre}</p>
                    <BadgeNivel nivel={user.nivel} />
                  </div>
                </div>

                {/* Puntos */}
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontWeight: 800, color: "#701030", fontSize: "1rem" }}>{user.puntos.toLocaleString()}</p>
                  <p style={{ margin: 0, fontSize: "0.7rem", color: "#6b7280", fontWeight: 600 }}>PUNTOS</p>
                </div>

              </div>
            ))}
          </div>
          
          <button style={{ marginTop: "1rem", width: "100%", padding: "0.7rem", background: "transparent", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            Ver Tabla Completa
          </button>
        </div>

      </div>

      {/* --- MODAL CREAR NUEVO NIVEL (NUEVO) --- */}
      {modalNivelAbierto && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", width: "420px", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", position: "relative" }}>
            <button onClick={() => setModalNivelAbierto(false)} style={{ position: "absolute", top: "1.2rem", right: "1.2rem", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
              <X size={20} />
            </button>
            
            <h3 style={{ margin: "0 0 1.5rem 0", color: "#111827", fontSize: "1.2rem" }}>
              Añadir Nuevo Nivel
            </h3>
            
            <form onSubmit={guardarNivel} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Nombre del Nivel</label>
                <input required type="text" value={formNivel.nombre} onChange={e => setFormNivel({...formNivel, nombre: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} placeholder="Ej. Diamante" />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 50px", gap: "1rem", alignItems: "end" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Puntos requeridos de inicio</label>
                  <input required type="number" min="1" step="100" value={formNivel.puntosMin} onChange={e => setFormNivel({...formNivel, puntosMin: Number(e.target.value)})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} />
                </div>
                <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Color</label>
                    <input type="color" value={formNivel.color} onChange={e => setFormNivel({...formNivel, color: e.target.value})} style={{ width: "100%", height: "38px", border: "none", borderRadius: "8px", cursor: "pointer", padding: 0, background: "none" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Beneficios ofrecidos</label>
                <input required type="text" value={formNivel.beneficio} onChange={e => setFormNivel({...formNivel, beneficio: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} placeholder="Ej. 15% de descuento o Regalo sorpresa" />
              </div>
              
              <div style={{ background: "#fef9c3", padding: "1rem", borderRadius: "8px", border: "1px solid #fde047", marginTop: "0.5rem" }}>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#a16207", lineHeight: "1.4" }}>
                    Al guardar, el nivel anterior más alto se ajustará automáticamente para terminar 1 punto antes de que inicie este nuevo nivel.
                  </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setModalNivelAbierto(false)} style={{ flex: 1, padding: "0.6rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontWeight: 500, cursor: "pointer" }}>
                  Cancelar
                </button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", background: "#701030", border: "none", borderRadius: "8px", color: "white", fontWeight: 600, cursor: "pointer" }}>
                  Guardar Nivel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL CREAR / EDITAR LOGRO --- */}
      {modalLogroAbierto && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", width: "400px", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", position: "relative" }}>
            <button onClick={() => setModalLogroAbierto(false)} style={{ position: "absolute", top: "1.2rem", right: "1.2rem", background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
              <X size={20} />
            </button>
            
            <h3 style={{ margin: "0 0 1.5rem 0", color: "#111827", fontSize: "1.2rem" }}>
              {logroEditando ? "Editar Misión" : "Nueva Misión"}
            </h3>
            
            <form onSubmit={guardarLogro} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Nombre del Logro</label>
                <input required type="text" value={formLogro.nombre} onChange={e => setFormLogro({...formLogro, nombre: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} placeholder="Ej. Cazador de Ofertas" />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Puntos de Recompensa</label>
                <input required type="number" min="0" step="10" value={formLogro.puntos} onChange={e => setFormLogro({...formLogro, puntos: Number(e.target.value)})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "#374151", marginBottom: "0.3rem" }}>Misión / Descripción</label>
                <textarea required value={formLogro.descripcion} onChange={e => setFormLogro({...formLogro, descripcion: e.target.value})} style={{ width: "100%", padding: "0.6rem", border: "1px solid #d1d5db", borderRadius: "8px", outline: "none", resize: "none", height: "70px", fontFamily: "inherit" }} placeholder="Ej. Comprar 3 productos en descuento..." />
              </div>
              
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setModalLogroAbierto(false)} style={{ flex: 1, padding: "0.6rem", background: "white", border: "1px solid #d1d5db", borderRadius: "8px", color: "#374151", fontWeight: 500, cursor: "pointer" }}>
                  Cancelar
                </button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", background: "#701030", border: "none", borderRadius: "8px", color: "white", fontWeight: 600, cursor: "pointer" }}>
                  {logroEditando ? "Guardar" : "Añadir"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}