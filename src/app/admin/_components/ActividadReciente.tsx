import prisma from "@/lib/prisma";

export default async function ActividadReciente() {
  // --- 1. CONSULTA A LA BASE DE DATOS ---
  // Traemos solo los 4 registros más recientes
  const logsDB = await prisma.audit_log.findMany({
    take: 4,
    orderBy: { created_at: 'desc' }
  });

  // --- 2. FUNCIONES AUXILIARES ---
  // Calcula "Hace X min/horas/días"
  const getTiempoTranscurrido = (fecha: Date) => {
    const segundos = Math.floor((new Date().getTime() - fecha.getTime()) / 1000);
    if (segundos < 60) return "Hace un momento";
    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) return `Hace ${minutos} min`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `Hace ${horas} h`;
    const dias = Math.floor(horas / 24);
    return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
  };

  // Paleta de colores de tu diseño para los puntitos
  const colores = ["#8E1B3A", "#BC9968", "#AB3A50", "#5C3A2E"];

  return (
    <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-5">
      <h3 className="font-serif text-xl font-semibold text-[#5A0F24] mb-4">
        Actividad reciente
      </h3>
      
      {logsDB.length === 0 ? (
        <p className="text-sm text-[#7A5260] py-4 text-center">No hay actividad reciente.</p>
      ) : (
        <div className="divide-y divide-[#8E1B3A]/6">
          {logsDB.map((log: any, i: number) => {
            // Asignamos un color rotativo de la paleta
            const colorPunto = colores[i % colores.length];
            
            // Formateamos el ID para que se vea como #4821
            const logId = `#${log.id.toString().padStart(4, '0')}`;
            
            // Construimos el texto combinando el actor y la acción
            // Ej: "Admin — Suspendió cuenta..."
            const actor = log.actor || "Sistema";
            const textoAccion = `${actor} ${log.accion.toLowerCase().startsWith(actor.toLowerCase()) ? log.accion.slice(actor.length).trim() : '— ' + log.accion}`;

            return (
              <div key={log.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <span
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ background: colorPunto }}
                />
                <div>
                  <p className="text-sm text-[#2A0E18] leading-snug">{textoAccion}</p>
                  <p className="text-xs text-[#7A5260] mt-1">
                    {getTiempoTranscurrido(log.created_at)} · log {logId}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}