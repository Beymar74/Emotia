"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface RegistroMensual {
  mes: string;
  total: number;
  activos: number;
}

interface Segmento {
  label: string;
  value: number;
  color: string;
}

interface Comprador {
  nombre: string;
  total: number;
}

export default function UsuariosCharts({
  registroMensual,
  segmentos,
  topCompradores,
}: {
  registroMensual: RegistroMensual[];
  segmentos: Segmento[];
  topCompradores: Comprador[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[320px] flex items-center justify-center text-xs text-[#7A5260]">
          Cargando evolución de usuarios...
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[320px] flex items-center justify-center text-xs text-[#7A5260]">
          Cargando segmentación...
        </div>
      </div>
    );
  }

  const formatBs = (n: number) =>
    n >= 1000 ? `Bs ${(n / 1000).toFixed(1)}k` : `Bs ${n}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Registro mensual */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-4">Nuevos usuarios por mes</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={registroMensual} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradUsuarios" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8E1B3A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#8E1B3A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
            <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              formatter={(v: any) => [`${v} usuarios`, "Registrados"]}
              contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#8E1B3A"
              strokeWidth={2.5}
              fill="url(#gradUsuarios)"
              dot={{ fill: "#8E1B3A", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#8E1B3A" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Segmentación */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-4">Segmentación de usuarios</h3>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width="50%" height={200}>
            <PieChart>
              <Pie
                data={segmentos}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {segmentos.map((s, i) => (
                  <Cell key={i} fill={s.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any) => [`${v} usuarios`, "Cantidad"]}
                contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-3">
            {segmentos.map((s) => {
              const totalVal = segmentos.reduce((acc, curr) => acc + curr.value, 0);
              const pct = totalVal > 0 ? Math.round((s.value / totalVal) * 100) : 0;
              return (
                <div key={s.label}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                      <span className="text-[#2A0E18] truncate font-medium">{s.label}</span>
                    </div>
                    <span className="font-bold text-[#5A0F24] ml-2 flex-shrink-0">
                      {s.value} <span className="text-[#7A5260] font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#FAF3EC] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: s.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
