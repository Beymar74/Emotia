"use client";
import React from "react";
import { FileText } from "lucide-react";

// Datos mockeados basados exactamente en tu captura
const auditoriaMock = [
  { id: 1, fecha: "2026-02-28 14:30", usuario: "Carlos López", accion: "Creó usuario", detalle: "Nuevo usuario: Laura Díaz" },
  { id: 2, fecha: "2026-02-28 12:15", usuario: "Carlos López", accion: "Aprobó proveedor", detalle: "Proveedor: Wellness Co" },
  { id: 3, fecha: "2026-02-27 16:45", usuario: "Admin", accion: "Eliminó producto", detalle: "Producto: Reloj Vintage" },
  { id: 4, fecha: "2026-02-27 10:00", usuario: "Admin", accion: "Cambió configuración", detalle: "Actualización de seguridad" },
  { id: 5, fecha: "2026-02-26 09:30", usuario: "Carlos López", accion: "Cambió estado pedido", detalle: "Pedido #1021 → Enviado" },
  { id: 6, fecha: "2026-02-25 11:20", usuario: "Admin", accion: "Creó categoría", detalle: "Nueva categoría: Arte y Cultura" },
];

export default function AuditoriaView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Contenedor Principal (Tarjeta Blanca) */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", overflow: "hidden" }}>
        
        {/* Cabecera de la Tarjeta */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1.5rem", borderBottom: "1px solid #f3f4f6" }}>
          <FileText size={20} color="#9B2335" />
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#111827" }}>Registro de Auditoría</h3>
        </div>

        {/* Tabla */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                {["FECHA", "USUARIO", "ACCIÓN", "DETALLE"].map((header) => (
                  <th key={header} style={{ 
                    padding: "1rem 1.5rem", fontSize: "0.75rem", fontWeight: 600, 
                    color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" 
                  }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditoriaMock.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  
                  {/* Fecha */}
                  <td style={{ padding: "1.2rem 1.5rem", color: "#6b7280", fontSize: "0.9rem" }}>
                    {log.fecha}
                  </td>
                  
                  {/* Usuario (En negrita según el diseño) */}
                  <td style={{ padding: "1.2rem 1.5rem", fontWeight: 600, color: "#111827", fontSize: "0.9rem" }}>
                    {log.usuario}
                  </td>
                  
                  {/* Acción (Con estilo de píldora) */}
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    <span style={{ 
                      background: "#f9fafb", border: "1px solid #e5e7eb", color: "#374151",
                      padding: "0.3rem 0.8rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 500
                    }}>
                      {log.accion}
                    </span>
                  </td>
                  
                  {/* Detalle */}
                  <td style={{ padding: "1.2rem 1.5rem", color: "#6b7280", fontSize: "0.9rem" }}>
                    {log.detalle}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}