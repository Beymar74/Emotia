"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const COLORES = ["#185FA5", "#8E1B3A", "#BC9968", "#2D7A47", "#AB3A50", "#5C3A2E", "#6B4F12", "#7A5260"];
const fmt = (n: number) => n >= 1000 ? `Bs ${(n / 1000).toFixed(1)}k` : `Bs ${Math.round(n)}`;

export function GraficoVentasCategoria({ data }: { data: { nombre: string; ventas: number }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[286px] flex items-center justify-center text-xs text-[#7A5260]">
      Cargando ventas por categoría...
    </div>
  );
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Ingresos por categoría</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" horizontal={false} />
          <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis
            type="category" dataKey="nombre" width={100}
            tick={{ fontSize: 10, fill: "#2A0E18" }} tickLine={false} axisLine={false}
            tickFormatter={(v) => v.length > 14 ? v.slice(0, 13) + "…" : v}
          />
          <Tooltip
            formatter={(v: any) => [`Bs ${Number(v).toLocaleString()}`, "Ingresos"]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="ventas" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoProductosCategoria({ data }: { data: { nombre: string; productos: number }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[272px] flex items-center justify-center text-xs text-[#7A5260]">
      Cargando productos por categoría...
    </div>
  );
  const total = data.reduce((s, d) => s + d.productos, 0) || 1;
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Productos por categoría</h3>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={200}>
          <PieChart>
            <Pie data={data} dataKey="productos" nameKey="nombre" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
              {data.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
            </Pie>
            <Tooltip formatter={(v: any) => [v + " productos", ""]} contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2 min-w-0">
          {data.map((c, i) => (
            <div key={c.nombre} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORES[i % COLORES.length] }} />
              <span className="text-xs text-[#2A0E18] flex-1 truncate">{c.nombre}</span>
              <span className="text-xs font-semibold text-[#5A0F24]">{Math.round((c.productos / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
