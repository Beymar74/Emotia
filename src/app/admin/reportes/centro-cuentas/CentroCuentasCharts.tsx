"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface EvolucionMes {
  mes: string;
  usuarios: number;
  empresas: number;
  representantes: number;
}

interface SegmentoEcosistema {
  label: string;
  value: number;
  color: string;
}

interface EstadoCuenta {
  categoria: string;
  activo: number;
  suspendido: number;
  pendiente?: number;
}

interface DistribucionPlan {
  name: string;
  value: number;
  color: string;
}

interface TopRepresentante {
  nombre: string;
  representante: string;
  ventas: number;
  calificacion: number;
}

export default function CentroCuentasCharts({
  evolucionRegistro,
  composicionEcosistema,
  distribucionEstados,
  distribucionPlanes,
  topRepresentantes,
}: {
  evolucionRegistro: EvolucionMes[];
  composicionEcosistema: SegmentoEcosistema[];
  distribucionEstados: EstadoCuenta[];
  distribucionPlanes: DistribucionPlan[];
  topRepresentantes: TopRepresentante[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[320px] flex items-center justify-center text-xs text-[#7A5260]">
          Cargando evolución de registros...
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[320px] flex items-center justify-center text-xs text-[#7A5260]">
          Cargando composición del ecosistema...
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[320px] flex items-center justify-center text-xs text-[#7A5260]">
          Cargando distribución de estados...
        </div>
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5 h-[320px] flex items-center justify-center text-xs text-[#7A5260]">
          Cargando segmentación de planes...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Evolución del Registro de Cuentas */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-1">Evolución de Registros</h3>
          <p className="text-xs text-[#7A5260] mb-4">Nuevas cuentas incorporadas por mes en el ecosistema PREPE.</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={evolucionRegistro} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradCCUsuarios" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8E1B3A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8E1B3A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCCEmpresas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#185FA5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#185FA5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCCRepresentantes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5E3C" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8B5E3C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
              <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Area
                type="monotone"
                name="Usuarios"
                dataKey="usuarios"
                stroke="#8E1B3A"
                strokeWidth={2}
                fill="url(#gradCCUsuarios)"
              />
              <Area
                type="monotone"
                name="Empresas"
                dataKey="empresas"
                stroke="#185FA5"
                strokeWidth={2}
                fill="url(#gradCCEmpresas)"
              />
              <Area
                type="monotone"
                name="Representantes"
                dataKey="representantes"
                stroke="#8B5E3C"
                strokeWidth={2}
                fill="url(#gradCCRepresentantes)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Composición del Ecosistema */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-1">Composición del Ecosistema</h3>
          <p className="text-xs text-[#7A5260] mb-4">Proporción por tipo de cuenta registrado en la plataforma.</p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={180} className="sm:w-1/2">
              <PieChart>
                <Pie
                  data={composicionEcosistema}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {composicionEcosistema.map((s, i) => (
                    <Cell key={i} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v} cuentas`, "Cantidad"]}
                  contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 w-full space-y-3">
              {composicionEcosistema.map((s) => {
                const totalVal = composicionEcosistema.reduce((acc, curr) => acc + curr.value, 0);
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. Distribución por Estado de Cuenta */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-1">Distribución de Estados de Cuenta</h3>
          <p className="text-xs text-[#7A5260] mb-4">Comparativa de cuentas habilitadas vs suspendidas o pendientes.</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={distribucionEstados} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" />
              <XAxis dataKey="categoria" tick={{ fontSize: 11, fill: "#2A0E18", fontWeight: 500 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#7A5260" }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar name="Activo / Aprobado" dataKey="activo" fill="#2D7A47" radius={[4, 4, 0, 0]} />
              <Bar name="Suspendido / Inactivo" dataKey="suspendido" fill="#A32D2D" radius={[4, 4, 0, 0]} />
              <Bar name="Pendiente de Aprobación" dataKey="pendiente" fill="#BC9968" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Segmentación de Planes de Usuario */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-1">Segmentación de Planes de Cliente</h3>
          <p className="text-xs text-[#7A5260] mb-4">Proporción de clientes con planes Premium frente a planes Básicos.</p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={180} className="sm:w-1/2">
              <PieChart>
                <Pie
                  data={distribucionPlanes}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={75}
                >
                  {distribucionPlanes.map((s, i) => (
                    <Cell key={i} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v} usuarios`, "Cantidad"]}
                  contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 w-full space-y-3">
              {distribucionPlanes.map((s) => {
                const totalVal = distribucionPlanes.reduce((acc, curr) => acc + curr.value, 0);
                const pct = totalVal > 0 ? Math.round((s.value / totalVal) * 100) : 0;
                return (
                  <div key={s.name}>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                        <span className="text-[#2A0E18] truncate font-medium">{s.name}</span>
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

      {/* 5. Top 5 Representantes por Ventas */}
      {topRepresentantes.length > 0 && (
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
          <h3 className="font-serif text-lg font-semibold text-[#5A0F24] mb-1">Top 5 Representantes por Ventas</h3>
          <p className="text-xs text-[#7A5260] mb-4">Negocios con mayor facturación acumulada registrada en la plataforma.</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topRepresentantes} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e4" horizontal={true} vertical={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#7A5260" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="nombre" type="category" tick={{ fontSize: 10, fill: "#2A0E18", fontWeight: 500 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip
                formatter={(v) => [`Bs ${Number(v).toLocaleString("es-BO", { minimumFractionDigits: 2 })}`, "Ventas Totales"]}
                contentStyle={{ border: "1px solid #f0e8e4", borderRadius: 12, fontSize: 12 }}
              />
              <Bar dataKey="ventas" name="Ventas Acumuladas" fill="#8E1B3A" radius={[0, 4, 4, 0]} barSize={20}>
                {topRepresentantes.map((entry, index) => {
                  const colors = ["#8E1B3A", "#BC9968", "#8B5E3C", "#A32D2D", "#7A5260"];
                  return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
