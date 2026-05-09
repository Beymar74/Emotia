import prisma from "@/lib/prisma";
import MetodosPagoClient from "./_components/MetodosPagoClient";
import Paginacion from "../_components/Paginacion";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const POR_PAGINA = 25;

export default async function PagosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const pagina = Math.max(1, parseInt(typeof sp.pagina === "string" ? sp.pagina : "1") || 1);

  const formatFecha = (fecha: Date) =>
    new Intl.DateTimeFormat("es-BO", {
      day: "2-digit", month: "2-digit", year: "numeric",
    }).format(fecha);

  const [metodosBD, totalTxn, pedidosBD] = await Promise.all([
    prisma.metodos_pago.findMany({ orderBy: { id: "asc" } }),
    prisma.pedidos.count({ where: { metodo_pago: { not: null } } }),
    prisma.pedidos.findMany({
      where: { metodo_pago: { not: null } },
      orderBy: { created_at: "desc" },
      skip: (pagina - 1) * POR_PAGINA,
      take: POR_PAGINA,
      include: { usuarios: { select: { nombre: true, apellido: true } } },
    }),
  ]);

  type Transaccion = {
    id: string;
    pedido: string;
    usuario: string;
    monto: string;
    metodo: string;
    fecha: string;
    estado: "aprobado" | "fallido";
  };

  const transacciones: Transaccion[] = pedidosBD.map((p: any) => ({
    id:      p.referencia_pago ? p.referencia_pago.slice(0, 10).toUpperCase() : `TXN-${p.id.toString().padStart(4, "0")}`,
    pedido:  `#${p.id.toString().padStart(4, "0")}`,
    usuario: `${p.usuarios?.nombre || ""} ${p.usuarios?.apellido || ""}`.trim() || "Desconocido",
    monto:   `Bs ${Number(p.total).toLocaleString("en-US", { minimumFractionDigits: 0 })}`,
    metodo:  p.metodo_pago,
    fecha:   formatFecha(p.created_at),
    estado:  p.estado === "cancelado" ? "fallido" : "aprobado",
  }));

  const pagosFallidosCount = transacciones.filter((t) => t.estado === "fallido").length;
  const totalPaginas = Math.max(1, Math.ceil(totalTxn / POR_PAGINA));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Pedidos &amp; Pagos</p>
        <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Métodos de pago</h1>
        <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
          Habilita o deshabilita los métodos de pago disponibles para los clientes. Solo los métodos activos aparecerán como opción al momento de realizar un pedido.
        </p>
      </div>

      {/* Métodos de pago */}
      <div>
        <h2 className="font-serif text-xl font-semibold text-[#5A0F24] mb-1">Métodos disponibles</h2>
        <p className="text-sm text-[#7A5260] mb-4">Activa o desactiva cada método según las operaciones habilitadas en la plataforma.</p>
        <MetodosPagoClient metodos={metodosBD} />
      </div>

      {/* Transacciones paginadas */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Historial de transacciones</h3>
          <div className="flex items-center gap-2">
            {pagosFallidosCount > 0 && (
              <span className="text-xs bg-[#FBF0F0] text-[#A32D2D] px-3 py-1 rounded-full font-medium">
                {pagosFallidosCount} {pagosFallidosCount === 1 ? "fallido" : "fallidos"} esta página
              </span>
            )}
            <span className="text-xs bg-[#8E1B3A]/8 text-[#8E1B3A] px-3 py-1 rounded-full font-medium">
              {totalTxn} total
            </span>
          </div>
        </div>

        {transacciones.length === 0 ? (
          <p className="text-sm text-[#7A5260] text-center py-10">No hay transacciones registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr>
                  {["Referencia", "Pedido", "Usuario", "Monto", "Método", "Fecha", "Estado"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transacciones.map((t) => (
                  <tr key={t.id + t.pedido} className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50 transition-colors">
                    <td className="px-3 py-3 text-xs font-mono text-[#7A5260]">{t.id}</td>
                    <td className="px-3 py-3 text-sm font-bold text-[#5A0F24]">{t.pedido}</td>
                    <td className="px-3 py-3 text-sm text-[#2A0E18]">{t.usuario}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-[#5A0F24]">{t.monto}</td>
                    <td className="px-3 py-3 text-sm text-[#7A5260] capitalize">{t.metodo}</td>
                    <td className="px-3 py-3 text-sm text-[#7A5260]">{t.fecha}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        t.estado === "aprobado"
                          ? "bg-[#EEF8F0] text-[#2D7A47]"
                          : "bg-[#FBF0F0] text-[#A32D2D]"
                      }`}>
                        {t.estado === "aprobado" ? "Aprobado" : "Fallido"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Suspense>
        <Paginacion
          paginaActual={pagina}
          totalPaginas={totalPaginas}
          totalItems={totalTxn}
          porPagina={POR_PAGINA}
        />
      </Suspense>
    </div>
  );
}
