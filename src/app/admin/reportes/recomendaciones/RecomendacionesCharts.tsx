"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const VERDE = "#2D7A47";
const ROJO = "#A32D2D";
const DORADO = "#BC9968";
const COLORES = ["#2D7A47", "#185FA5", "#BC9968", "#8E1B3A", "#AB3A50", "#5C3A2E", "#6B4F12"];

export function GraficoOcasiones({ data }: { data: { ocasion: string; total: number; convertidas: number }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[286px] flex items-center justify-center text-xs text-[#7A5260]">
      Cargando ocasiones...
    </div>
  );
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Recomendaciones por ocasión</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis
            type="category" dataKey="ocasion" width={110}
            tick={{ fontSize: 10, fill: "#2A0E18" }} tickLine={false} axisLine={false}
            tickFormatter={(v) => v.length > 16 ? v.slice(0, 15) + "…" : v}
          />
          <Tooltip contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }} />
          <Bar dataKey="total" name="Total" fill={DORADO} radius={[0, 3, 3, 0]} />
          <Bar dataKey="convertidas" name="Compradas" fill={VERDE} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoConversionIA({ convertidas, noConvertidas }: { convertidas: number; noConvertidas: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[272px] flex items-center justify-center text-xs text-[#7A5260]">
      Cargando conversión...
    </div>
  );
  const data = [
    { nombre: "Convertidas en compra", valor: convertidas, color: VERDE },
    { nombre: "Sin conversión", valor: noConvertidas, color: "#E5E7EB" },
  ];
  const tasa = convertidas + noConvertidas > 0 ? Math.round((convertidas / (convertidas + noConvertidas)) * 100) : 0;
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Tasa de conversión IA</h3>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="45%" height={180}>
          <PieChart>
            <Pie data={data} dataKey="valor" nameKey="nombre" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Tooltip formatter={(v: any) => [v + " recomendaciones", ""]} contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-4">
          <div>
            <p className="font-serif text-4xl font-bold text-[#2D7A47]">{tasa}%</p>
            <p className="text-sm text-[#7A5260] mt-0.5">Tasa de conversión</p>
          </div>
          <div className="space-y-2">
            {data.map((d) => (
              <div key={d.nombre} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-xs text-[#2A0E18] flex-1">{d.nombre}</span>
                <span className="text-xs font-semibold text-[#5A0F24]">{d.valor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
