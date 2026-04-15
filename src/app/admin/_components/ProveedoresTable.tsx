import Link from "next/link";
import { proveedores } from "@/generated/prisma/client";

interface Props {
  data: proveedores[];
}

export default function ProveedoresTable({ data }: Props) {
  return (
    <div className="bg-white rounded-sm border border-[#F5E6D0] p-5 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[#5C3A2E] font-serif text-lg">Proveedores registrados</h3>
        <Link
          href="/admin/proveedores"
          className="text-[#BC9968] text-[10px] uppercase tracking-wider hover:underline"
        >
          Ver todos →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="text-[#7A5260] uppercase tracking-[1px] border-b border-[#F5E6D0]">
              <th className="pb-3 font-medium">Negocio</th>
              <th className="pb-3 font-medium">Cal.</th>
              <th className="pb-3 font-medium">Ventas</th>
              <th className="pb-3 font-medium">Estado</th>
              <th className="pb-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5E6D0]/50">
            {data.map((prov) => (
              <tr key={prov.id} className="hover:bg-[#FDF8F3] transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F5E6D0] flex items-center justify-center text-[#8E1B3A] font-bold">
                      {prov.nombre_negocio[0]}
                    </div>
                    <div>
                      <p className="text-[#5C3A2E] font-medium">{prov.nombre_negocio}</p>
                      <p className="text-[#7A5260]/60 text-[9px]">{prov.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-[#BC9968] font-medium">
                  ★ {prov.calificacion_prom ? Number(prov.calificacion_prom).toFixed(1) : "N/A"}
                </td>
                <td className="py-4 text-[#5C3A2E]">
                  Bs {Number(prov.total_vendido || 0).toLocaleString()}
                </td>
                <td className="py-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-tighter ${
                      prov.estado === "aprobado"
                        ? "bg-green-100 text-green-700"
                        : prov.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {prov.estado}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <Link
                    href="/admin/proveedores"
                    className="text-[#7A5260] hover:text-[#8E1B3A] text-[10px] font-medium px-2 transition-colors"
                  >
                    Gestionar →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}