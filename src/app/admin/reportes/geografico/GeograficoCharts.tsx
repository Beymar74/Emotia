"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const COLORES = ["#185FA5", "#8E1B3A", "#BC9968", "#2D7A47", "#AB3A50", "#5C3A2E", "#6B4F12"];
const fmt = (n: number) => n >= 1000 ? `Bs ${(n / 1000).toFixed(1)}k` : `Bs ${Math.round(n)}`;

export function GraficoPedidosCiudad({ data }: { data: { ciudad: string; pedidos: number }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[286px] flex items-center justify-center text-xs text-[#7A5260]">
      Cargando pedidos por ciudad...
    </div>
  );
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Pedidos por ciudad</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis
            type="category" dataKey="ciudad" width={90}
            tick={{ fontSize: 10, fill: "#2A0E18" }} tickLine={false} axisLine={false}
            tickFormatter={(v) => v.length > 13 ? v.slice(0, 12) + "…" : v}
          />
          <Tooltip
            formatter={(v: any) => [v + " pedidos", "Pedidos"]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="pedidos" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoIngresosCiudad({ data }: { data: { ciudad: string; ingresos: number }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[286px] flex items-center justify-center text-xs text-[#7A5260]">
      Cargando ingresos por ciudad...
    </div>
  );
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Ingresos por ciudad</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" horizontal={false} />
          <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis
            type="category" dataKey="ciudad" width={90}
            tick={{ fontSize: 10, fill: "#2A0E18" }} tickLine={false} axisLine={false}
            tickFormatter={(v) => v.length > 13 ? v.slice(0, 12) + "…" : v}
          />
          <Tooltip
            formatter={(v: any) => [`Bs ${Number(v).toLocaleString()}`, "Ingresos"]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="ingresos" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => <Cell key={i} fill={i === 0 ? "#185FA5" : i === 1 ? "#8E1B3A" : "#BC9968"} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
