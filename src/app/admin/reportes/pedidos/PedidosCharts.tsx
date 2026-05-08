"use client";

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const ESTADO_COLORS: Record<string, string> = {
  pendiente: "#8C5E08",
  procesando: "#185FA5",
  enviado: "#BC9968",
  entregado: "#2D7A47",
  cancelado: "#A32D2D",
};

interface EstadoData { estado: string; label: string; color: string; count: number; monto: number }
interface MesData { mes: string; entregados: number; cancelados: number; total: number }

const TooltipDonut = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-[#8E1B3A]/15 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-[#2A0E18]">{d.name}</p>
      <p style={{ color: d.payload.color }}>{d.value} pedidos</p>
    </div>
  );
};

const TooltipBar = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#8E1B3A]/15 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-[#2A0E18] mb-1 capitalize">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.fill || p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const RenderLabel = ({ cx, cy, total }: { cx: number; cy: number; total: number }) => (
  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
    <tspan x={cx} dy="-8" fontSize="22" fontWeight="700" fill="#5A0F24">{total}</tspan>
    <tspan x={cx} dy="20" fontSize="11" fill="#7A5260">pedidos</tspan>
  </text>
);

export function GraficoDonutEstados({ data, total }: { data: EstadoData[]; total: number }) {
  const pieData = data.map((e) => ({ name: e.label, value: e.count, color: e.color }));
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Distribución por estado</h3>
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={90}
                paddingAngle={2}
                label={false}
              >
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<TooltipDonut />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2.5">
          {data.map((e) => {
            const pct = total > 0 ? Math.round((e.count / total) * 100) : 0;
            return (
              <div key={e.estado}>
                <div className="flex justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
                    <span className="font-medium text-[#2A0E18]">{e.label}</span>
                  </div>
                  <span className="font-semibold text-[#5A0F24]">{e.count} <span className="text-[#7A5260] font-normal">({pct}%)</span></span>
                </div>
                <div className="h-1.5 bg-[#8E1B3A]/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: e.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function GraficoEvolucionPedidos({ data }: { data: MesData[] }) {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-5">Evolución mensual</h3>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip content={<TooltipBar />} />
          <Legend wrapperStyle={{ fontSize: 11, color: "#7A5260", paddingTop: 12 }} />
          <Bar dataKey="entregados" name="Entregados" fill="#2D7A47" radius={[4, 4, 0, 0]} />
          <Bar dataKey="cancelados" name="Cancelados" fill="#A32D2D" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoValorEstados({ data }: { data: EstadoData[] }) {
  const formatBs = (n: number) =>
    n >= 1000 ? `Bs ${(n / 1000).toFixed(1)}k` : `Bs ${n}`;
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-5">Valor monetario por estado</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={formatBs} tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(v: any) => [`Bs ${Number(v).toLocaleString()}`, "Monto"]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="monto" radius={[6, 6, 0, 0]}>
            {data.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
