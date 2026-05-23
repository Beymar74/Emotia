"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface EstadoData {
  nombre: string;
  valor: number;
  color: string;
}

interface RegistroMensual {
  mes: string;
  total: number;
}

interface TopRepresentante {
  id: number;
  rep_nombre: string | null;
  nombre_negocio: string;
  total_vendido: number;
}

export default function RepresentantesCharts({
  estados,
  registroMensual,
  topRepresentantes,
}: {
  estados: EstadoData[];
  registroMensual: RegistroMensual[];
  topRepresentantes: TopRepresentante[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[272px] flex items-center justify-center text-xs text-[#7A5260]">
            Cargando estado de representantes...
          </div>
          <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[272px] flex items-center justify-center text-xs text-[#7A5260]">
            Cargando nuevos representantes...
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[280px] flex items-center justify-center text-xs text-[#7A5260]">
          Cargando top representantes...
        </div>
      </div>
    );
  }

  const formatBs = (n: number) =>
    n >= 1000 ? `Bs ${(n / 1000).toFixed(1)}k` : `Bs ${n}`;

  const topChartsData = topRepresentantes.map((p) => {
    const nombreLabel = p.rep_nombre ? `${p.rep_nombre} (${p.nombre_negocio})` : p.nombre_negocio;
    return {
      nombre: nombreLabel.length > 28 ? nombreLabel.slice(0, 26) + "…" : nombreLabel,
      ventas: Number(p.total_vendido || 0),
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Estado de representantes */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-4">Distribución por estado</h3>
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
                  formatter={(v: any) => [`${v} representantes`, "Cantidad"]}
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

        {/* Registro mensual */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-4">Nuevos representantes por mes</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={registroMensual} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRepresentantes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BC9968" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#BC9968" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
              <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                formatter={(v: any) => [`${v} representantes`, "Nuevos"]}
                contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#BC9968"
                strokeWidth={2.5}
                fill="url(#gradRepresentantes)"
                dot={{ fill: "#BC9968", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#BC9968" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top representantes por ventas */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-4">Rendimiento por ventas (Top Representantes)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={topChartsData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" horizontal={false} />
            <XAxis type="number" tickFormatter={formatBs} tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="nombre"
              width={160}
              tick={{ fontSize: 10, fill: "#2A0E18" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(v: any) => [`Bs ${Number(v).toLocaleString()}`, "Ventas totales"]}
              contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
            />
            <Bar dataKey="ventas" radius={[0, 6, 6, 0]}>
              {topChartsData.map((_, i) => (
                <Cell key={i} fill={i === 0 ? "#5A0F24" : i < 3 ? "#8E1B3A" : "#BC9968"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
