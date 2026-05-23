"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const COLORES = ["#185FA5", "#2D7A47", "#BC9968", "#8E1B3A", "#AB3A50", "#5C3A2E"];
const fmt = (n: number) => n >= 1000 ? `Bs ${(n / 1000).toFixed(1)}k` : `Bs ${Math.round(n)}`;

export function GraficoDistribucionPagos({ data }: { data: { metodo: string; pedidos: number; color: string }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[272px] flex items-center justify-center text-xs text-[#7A5260]">
      Cargando métodos de pago...
    </div>
  );
  const total = data.reduce((s, d) => s + d.pedidos, 0) || 1;
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Distribución de métodos</h3>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={200}>
          <PieChart>
            <Pie data={data} dataKey="pedidos" nameKey="metodo" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
              {data.map((d, i) => <Cell key={i} fill={d.color || COLORES[i % COLORES.length]} />)}
            </Pie>
            <Tooltip formatter={(v: any) => [v + " pedidos", ""]} contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2 min-w-0">
          {data.map((d, i) => (
            <div key={d.metodo} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color || COLORES[i % COLORES.length] }} />
              <span className="text-xs text-[#2A0E18] flex-1 truncate capitalize">{d.metodo || "Sin registrar"}</span>
              <span className="text-xs font-semibold text-[#5A0F24]">{Math.round((d.pedidos / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GraficoIngresosPagos({ data }: { data: { metodo: string; ingresos: number }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[286px] flex items-center justify-center text-xs text-[#7A5260]">
      Cargando ingresos por método...
    </div>
  );
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Ingresos por método de pago</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" horizontal={false} />
          <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis
            type="category" dataKey="metodo" width={110}
            tick={{ fontSize: 10, fill: "#2A0E18" }} tickLine={false} axisLine={false}
            tickFormatter={(v) => v ? (v.length > 16 ? v.slice(0, 15) + "…" : v) : "Sin registrar"}
          />
          <Tooltip
            formatter={(v: any) => [`Bs ${Number(v).toLocaleString()}`, "Ingresos"]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="ingresos" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
