"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORES = ["#8E1B3A", "#BC9968", "#5C3A2E", "#AB3A50", "#185FA5", "#2D7A47"];

interface MesData { mes: string; pedidos: number; monto: number }
interface EmpresaData { nombre: string; monto: number; pct: number; items: number }
interface CatData { nombre: string; monto: number; items: number; pct: number }

interface Props {
  ventasMensuales: MesData[];
  ventasEmpresas: EmpresaData[];
  ventasCategorias: CatData[];
  totalIngresos: number;
}

const fmt = (n: number) =>
  n >= 1000 ? `Bs ${(n / 1000).toFixed(1)}k` : `Bs ${n}`;

const TooltipMes = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#8E1B3A]/15 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-[#2A0E18] mb-1 capitalize">{label}</p>
      <p className="text-[#8E1B3A]">Bs {Number(payload[0]?.value || 0).toLocaleString()}</p>
      {payload[1] && <p className="text-[#BC9968]">{payload[1].value} pedidos</p>}
    </div>
  );
};

const TooltipPie = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#8E1B3A]/15 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-semibold text-[#2A0E18]">{payload[0].name}</p>
      <p style={{ color: payload[0].fill }}>Bs {Number(payload[0].value || 0).toLocaleString()}</p>
      <p className="text-[#7A5260]">{payload[0].payload.pct}% del total</p>
    </div>
  );
};

export function GraficoEvolucionVentas({ data }: { data: MesData[] }) {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-5">Evolución de ingresos — últimos 6 meses</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradMonto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8E1B3A" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8E1B3A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <Tooltip content={<TooltipMes />} />
          <Area
            type="monotone"
            dataKey="monto"
            name="Ingresos"
            stroke="#8E1B3A"
            strokeWidth={2.5}
            fill="url(#gradMonto)"
            dot={{ fill: "#8E1B3A", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#8E1B3A" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoPedidosMes({ data }: { data: MesData[] }) {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-5">Pedidos por mes</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#7A5260" }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            formatter={(v: any) => [v + " pedidos", "Pedidos"]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="pedidos" fill="#BC9968" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoEmpresasVentas({ data }: { data: EmpresaData[] }) {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Top empresas por ventas</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" horizontal={false} />
          <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="nombre"
            width={110}
            tick={{ fontSize: 10, fill: "#2A0E18" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.length > 16 ? v.slice(0, 15) + "…" : v}
          />
          <Tooltip
            formatter={(v: any) => [`Bs ${Number(v).toLocaleString()}`, "Ingresos"]}
            contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="monto" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? "#8E1B3A" : i === 1 ? "#AB3A50" : "#BC9968"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoCategoriasPie({ data }: { data: CatData[] }) {
  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">Ventas por categoría</h3>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="monto"
              nameKey="nombre"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORES[i % COLORES.length]} />
              ))}
            </Pie>
            <Tooltip content={<TooltipPie />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {data.map((c, i) => (
            <div key={c.nombre} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORES[i % COLORES.length] }} />
              <span className="text-xs text-[#2A0E18] flex-1 truncate">{c.nombre}</span>
              <span className="text-xs font-semibold text-[#5A0F24]">{c.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
