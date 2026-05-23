"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const COLORES = ["#8E1B3A", "#BC9968", "#185FA5", "#2D7A47", "#AB3A50", "#5C3A2E"];

export function GraficoTiposTarjeta({ data }: { data: { tipo: string; total: number }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[272px] flex items-center justify-center text-xs text-[#7A5260]">
      Cargando tipos de tarjeta...
    </div>
  );
  const totalTarjetas = data.reduce((s, d) => s + d.total, 0) || 1;
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Tipos de tarjeta más usados</h3>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={200}>
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="tipo" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
              {data.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
            </Pie>
            <Tooltip formatter={(v: any) => [v + " pedidos", ""]} contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2 min-w-0">
          {data.map((d, i) => (
            <div key={d.tipo} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORES[i % COLORES.length] }} />
              <span className="text-xs text-[#2A0E18] flex-1 truncate capitalize">{d.tipo}</span>
              <span className="text-xs font-semibold text-[#5A0F24]">{Math.round((d.total / totalTarjetas) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GraficoAdopcionPersonalizacion({
  conMensaje, conEmpaque, conTarjeta, total,
}: {
  conMensaje: number; conEmpaque: number; conTarjeta: number; total: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[272px] flex items-center justify-center text-xs text-[#7A5260]">
      Cargando adopción...
    </div>
  );
  const base = total || 1;
  const data = [
    { label: "Mensaje personal", valor: conMensaje, pct: Math.round((conMensaje / base) * 100), color: "#8E1B3A" },
    { label: "Empaque especial", valor: conEmpaque, pct: Math.round((conEmpaque / base) * 100), color: "#BC9968" },
    { label: "Tarjeta personalizada", valor: conTarjeta, pct: Math.round((conTarjeta / base) * 100), color: "#185FA5" },
  ];
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-5">Adopción de personalización</h3>
      <div className="space-y-5">
        {data.map((d) => (
          <div key={d.label}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-medium text-[#2A0E18]">{d.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold" style={{ color: d.color }}>{d.pct}%</span>
                <span className="text-xs text-[#7A5260]">({d.valor} pedidos)</span>
              </div>
            </div>
            <div className="w-full bg-[#F3EBE8] rounded-full h-2.5">
              <div className="h-2.5 rounded-full transition-all" style={{ width: `${d.pct}%`, background: d.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
