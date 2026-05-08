"use client";

import {
  BarChart, Bar, Cell, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface DistData { stars: number; count: number; pct: number }

export function GraficoEstrellas({ data, promedio }: { data: DistData[]; promedio: number }) {
  const chartData = [...data].reverse(); // 1★ → 5★ ascendente
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <div className="flex items-start justify-between mb-5">
        <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Distribución de reseñas</h3>
        <div className="text-center">
          <p className="font-serif text-4xl font-bold text-[#BC9968]">{promedio.toFixed(1)}</p>
          <p className="text-xs text-[#7A5260]">de 5.0</p>
          <div className="flex gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className="text-sm" style={{ color: s <= Math.round(promedio) ? "#BC9968" : "#E5E7EB" }}>★</span>
            ))}
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="stars"
            width={32}
            tickFormatter={(v) => v + " ★"}
            tick={{ fontSize: 11, fill: "#2A0E18" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(v: any, _: any, props: any) => [
              `${v} reseñas (${props.payload.pct}%)`,
              "Cantidad",
            ]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}
            label={{ position: "right", formatter: (v: any) => v > 0 ? `${chartData.find(d => d.count === v)?.pct ?? 0}%` : "", fontSize: 10, fill: "#7A5260" }}
          >
            {chartData.map((d) => (
              <Cell key={d.stars} fill={d.stars >= 4 ? "#2D7A47" : d.stars === 3 ? "#BC9968" : "#A32D2D"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoSatisfaccion({ satisfaccion, tasaEntrega, tasaCancelacion }: {
  satisfaccion: number; tasaEntrega: number; tasaCancelacion: number;
}) {
  const radialData = [{ name: "Satisfacción", value: satisfaccion, fill: "#BC9968" }];

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Indicadores de calidad</h3>
      <div className="flex items-center gap-6">
        {/* Radial satisfacción */}
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={160} height={160}>
            <RadialBarChart
              cx="50%" cy="50%"
              innerRadius="65%" outerRadius="100%"
              startAngle={225} endAngle={-45}
              data={radialData}
            >
              <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "#f0e8e4" }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-serif text-3xl font-bold text-[#BC9968]">{satisfaccion}%</p>
            <p className="text-[10px] text-[#7A5260]">satisfacción</p>
          </div>
        </div>

        {/* Barras de entrega / cancelación */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium text-[#2A0E18]">Tasa de entrega</span>
              <span className="font-bold text-[#2D7A47]">{tasaEntrega}%</span>
            </div>
            <div className="h-3 bg-[#2D7A47]/12 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#2D7A47]" style={{ width: `${tasaEntrega}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium text-[#2A0E18]">Tasa cancelación</span>
              <span className="font-bold text-[#A32D2D]">{tasaCancelacion}%</span>
            </div>
            <div className="h-3 bg-[#A32D2D]/12 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#A32D2D]" style={{ width: `${tasaCancelacion}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
