"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface MesData { mes: string; total: number }
interface Comprador { nombre: string; email: string; pedidos: number; total: number }
interface SegmentoData { label: string; value: number; color: string }

const TooltipArea = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#8E1B3A]/15 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-[#2A0E18] capitalize mb-1">{label}</p>
      <p className="text-[#BC9968]">{payload[0].value} clientes nuevos</p>
    </div>
  );
};

export function GraficoNuevosClientes({ data }: { data: MesData[] }) {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-5">Nuevos clientes por mes</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradClientes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#BC9968" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#BC9968" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip content={<TooltipArea />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#BC9968"
            strokeWidth={2.5}
            fill="url(#gradClientes)"
            dot={{ fill: "#BC9968", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#BC9968" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoSegmentacionClientes({ data }: { data: SegmentoData[] }) {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Segmentación de la base</h3>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={82}
              paddingAngle={3}
            >
              {data.map((s, i) => <Cell key={i} fill={s.color} />)}
            </Pie>
            <Tooltip
              formatter={(v: any, name: any) => [v + " clientes", name]}
              contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-3">
          {data.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
              <div className="flex-1">
                <p className="text-xs font-medium text-[#2A0E18]">{s.label}</p>
              </div>
              <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GraficoTopCompradores({ data }: { data: Comprador[] }) {
  const formatBs = (n: number) =>
    n >= 1000 ? `Bs ${(n / 1000).toFixed(1)}k` : `Bs ${n}`;

  const chartData = data.slice(0, 6).map((c) => ({
    nombre: c.nombre.split(" ")[0],
    total: c.total,
    pedidos: c.pedidos,
  }));

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-5">Top compradores</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
          <XAxis dataKey="nombre" tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={formatBs} tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(v: any) => [`Bs ${Number(v).toLocaleString()}`, "Gasto total"]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="total" fill="#8E1B3A" radius={[6, 6, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={i === 0 ? "#5A0F24" : i < 3 ? "#8E1B3A" : "#BC9968"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
