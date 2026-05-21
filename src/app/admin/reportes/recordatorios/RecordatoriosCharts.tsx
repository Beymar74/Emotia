"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const MORADO = "#185FA5";
const DORADO = "#BC9968";

export function GraficoRecordatoriosMes({ data }: { data: { mes: string; total: number; activos: number }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[312px] flex items-center justify-center text-xs text-[#7A5260]">
      Cargando recordatorios por mes...
    </div>
  );
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-5">Recordatorios creados por mes</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradRec" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={MORADO} stopOpacity={0.2} />
              <stop offset="95%" stopColor={MORADO} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            formatter={(v: any, name: any) => [v, name === "total" ? "Creados" : "Activos"]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Area type="monotone" dataKey="total" name="total" stroke={MORADO} strokeWidth={2.5} fill="url(#gradRec)"
            dot={{ fill: MORADO, r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
          <Area type="monotone" dataKey="activos" name="activos" stroke={DORADO} strokeWidth={1.5} fill="none"
            dot={{ fill: DORADO, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} strokeDasharray="4 2" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoProximidadEventos({ data }: { data: { rango: string; total: number; color: string }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[272px] flex items-center justify-center text-xs text-[#7A5260]">
      Cargando proximidad de eventos...
    </div>
  );
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Eventos próximos por período</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
          <XAxis dataKey="rango" tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            formatter={(v: any) => [v + " eventos", "Recordatorios"]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
