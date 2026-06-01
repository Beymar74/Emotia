import prisma from "@/lib/prisma";
import PersonalizacionClient from "./_components/TarjetasClient";

export const dynamic = "force-dynamic";

export default async function PersonalizacionPage() {
  const tarjetasDB = await prisma.tarjeta_disenos.findMany({ orderBy: { id: "asc" } });
  const empaquesDB = await prisma.empaque_disenos.findMany({ orderBy: { id: "asc" } });
  const envolturasDB = await prisma.envoltura_disenos.findMany({ orderBy: { id: "asc" } });
  const listonesDB = await prisma.liston_disenos.findMany({ orderBy: { id: "asc" } });
  const fechasEspeciales = await prisma.personalizacion_fechas.findMany({ orderBy: { fecha: "asc" } });

  const empaquesVisiblesDB = empaquesDB.filter((empaque) => empaque.nombre.trim().toLowerCase() !== "sin empaque");
  const totalTarjetas = tarjetasDB.length;
  const totalCajas = empaquesVisiblesDB.length;
  const totalEnvolturas = envolturasDB.length;
  const totalListones = listonesDB.length;
  const totalDiseños = totalTarjetas + totalCajas + totalEnvolturas + totalListones;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">
            Personalización
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">
            Administración de personalizaciones
          </h1>
          <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
            Administra las opciones de personalización para tarjetas, cajas, envolturas y listones. Puedes ver todo junto o filtrar por cada sección, además de programar fechas especiales en las que se podrá enviar regalos.
          </p>
        </div>
      </div>

      <PersonalizacionClient
        tarjetas={tarjetasDB}
        empaques={empaquesVisiblesDB}
        envolturas={envolturasDB}
        listones={listonesDB}
        fechasEspeciales={fechasEspeciales}
        resumen={{
          totalDiseños,
          totalTarjetas,
          totalCajas,
          totalEnvolturas,
          totalListones,
        }}
      />
    </div>
  );
}
