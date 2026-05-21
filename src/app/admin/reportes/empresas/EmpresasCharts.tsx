"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, Cell, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface EstadoData {
  nombre: string;
  valor: number;
  color: string;
}

interface EmpresaRow {
  id: number;
  nombre: string;
  initials: string;
  estado: string;
  ingresos: number;
  productos: number;
  despachos: number;
  calificacion: number;
  pct: number;
}

export default function EmpresasCharts({
  estados,
  empresas,
  maxIngresos,
}: {
  estados: EstadoData[];
  empresas: EmpresaRow[];
  maxIngresos: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[280px] flex items-center justify-center text-xs text-[#7A5260]">
          Cargando distribución de empresas...
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[280px] flex items-center justify-center text-xs text-[#7A5260]">
          Cargando gráfico de ingresos...
        </div>
      </div>
    );
  }

  const formatBs = (n: number) =>
    n >= 1000 ? `Bs ${(n / 1000).toFixed(1)}k` : `Bs ${n}`;

  const topEmpresasData = empresas
    .filter((e) => e.estado === "aprobado")
    .slice(0, 6)
    .map((e) => ({
      nombre: e.nombre.length > 15 ? e.nombre.slice(0, 13) + "…" : e.nombre,
      ingresos: e.ingresos,
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Estado de empresas */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-4">Estado de afiliación</h3>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width="50%" height={180}>
            <PieChart>
              <Pie
                data={estados}
                dataKey="valor"
                nameKey="nombre"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={75}
                paddingAngle={3}
              >
                {estados.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any) => [`${v} empresas`, "Cantidad"]}
                contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-3">
            {estados.map((e) => {
              const totalVal = estados.reduce((acc, curr) => acc + curr.valor, 0);
              const pct = totalVal > 0 ? Math.round((e.valor / totalVal) * 100) : 0;
              return (
                <div key={e.nombre}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
                      <span className="text-[#2A0E18] truncate font-medium">{e.nombre}</span>
                    </div>
                    <span className="font-bold text-[#5A0F24] ml-2 flex-shrink-0">
                      {e.valor} <span className="text-[#7A5260] font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#FAF3EC] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: e.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Empresas */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-4">Ingresos de principales empresas</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={topEmpresasData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
            <XAxis dataKey="nombre" tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={formatBs} tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(v: any) => [`Bs ${Number(v).toLocaleString()}`, "Ingresos"]}
              contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
            />
            <Bar dataKey="ingresos" fill="#8E1B3A" radius={[6, 6, 0, 0]}>
              {topEmpresasData.map((_, i) => (
                <Cell key={i} fill={i === 0 ? "#5A0F24" : i < 3 ? "#8E1B3A" : "#BC9968"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
