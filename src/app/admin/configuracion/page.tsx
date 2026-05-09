import prisma from "@/lib/prisma";
import ConfiguracionClient from "./_components/ConfiguracionClient";

export const dynamic = "force-dynamic";

export default async function ConfiguracionPage() {
  const admin = await prisma.usuarios.findFirst({
    where: { tipo: "admin" },
    select: { email: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reportes &amp; Sistema</p>
        <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Configuración</h1>
        <p className="mt-2 text-sm text-[#7A5260] max-w-3xl leading-relaxed">
          Aquí puedes ajustar las variables globales del sistema, parámetros de seguridad y preferencias de la plataforma administrativa.
        </p>
      </div>

      <ConfiguracionClient adminEmail={admin?.email ?? ""} />
    </div>
  );
}
