import prisma from "@/lib/prisma";
import TarjetasClient from "./_components/TarjetasClient";

export const dynamic = "force-dynamic";

export default async function PersonalizacionPage() {
  const tarjetasDB = await prisma.tarjeta_disenos.findMany({
    orderBy: { id: "asc" },
  });

  const totalTarjetas = tarjetasDB.length;
  const activas = tarjetasDB.filter((t) => t.activo).length;
  const desactivadas = totalTarjetas - activas;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">
            Personalización
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">
            Diseños de Tarjeta
          </h1>
          <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
            Administra los diseños de tarjetas que los clientes pueden elegir para personalizar sus productos. Puedes crear nuevas opciones o pausar las existentes.
          </p>
        </div>
      </div>

      <TarjetasClient
        tarjetas={tarjetasDB}
        total={totalTarjetas}
        activas={activas}
        desactivadas={desactivadas}
      />
    </div>
  );
}
