"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const COLORES = ["#185FA5", "#2D7A47", "#BC9968", "#8E1B3A", "#AB3A50", "#5C3A2E"];

export function GraficoTiposNotif({ data }: { data: { tipo: string; total: number; leidas: number }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[272px] flex items-center justify-center text-xs text-[#7A5260]">
      Cargando tipos de notificación...
    </div>
  );
  const totalNotif = data.reduce((s, d) => s + d.total, 0) || 1;
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Notificaciones por tipo</h3>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={200}>
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="tipo" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
              {data.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
            </Pie>
            <Tooltip formatter={(v: any) => [v + " notificaciones", ""]} contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2 min-w-0">
          {data.map((d, i) => (
            <div key={d.tipo} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORES[i % COLORES.length] }} />
              <span className="text-xs text-[#2A0E18] flex-1 truncate capitalize">{d.tipo.replace(/_/g, " ")}</span>
              <span className="text-xs font-semibold text-[#5A0F24]">{Math.round((d.total / totalNotif) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GraficoNotifMes({ data }: { data: { mes: string; total: number; leidas: number }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[312px] flex items-center justify-center text-xs text-[#7A5260]">
      Cargando notificaciones por mes...
    </div>
  );
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-5">Notificaciones enviadas por mes</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradNotif" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#185FA5" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#185FA5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradLeidas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2D7A47" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#2D7A47" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            formatter={(v: any, name: any) => [v, name === "total" ? "Enviadas" : "Leídas"]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Area type="monotone" dataKey="total" name="total" stroke="#185FA5" strokeWidth={2.5} fill="url(#gradNotif)"
            dot={{ fill: "#185FA5", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
          <Area type="monotone" dataKey="leidas" name="leidas" stroke="#2D7A47" strokeWidth={1.5} fill="url(#gradLeidas)"
            dot={{ fill: "#2D7A47", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
