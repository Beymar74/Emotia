"use client";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reportes & Sistema</p>
        <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Configuración</h1>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Puntos y fidelización */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-6 space-y-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Sistema de puntos</h3>

          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">
              Puntos por cada Bs. gastado
            </label>
            <input
              type="number"
              defaultValue={1}
              className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]"
            />
            <p className="text-xs text-[#7A5260] mt-1">Ej: 1 punto por cada Bs. 10 gastados</p>
          </div>

          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">
              Equivalencia en Bs. por punto al canjear
            </label>
            <input
              type="number"
              defaultValue={0.5}
              step={0.1}
              className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">
              Límite máximo de puntos canjeables por transacción
            </label>
            <input
              type="number"
              defaultValue={200}
              className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]"
            />
          </div>

          <button className="w-full bg-[#8E1B3A] text-white text-sm py-2.5 rounded-lg font-medium hover:opacity-85 transition-opacity">
            Guardar configuración de puntos
          </button>
        </div>

        {/* Productos destacados */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-6 space-y-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Productos destacados</h3>

          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-3">
              Modo de selección de destacados
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="destacados" defaultChecked className="accent-[#8E1B3A]" />
                <div>
                  <p className="text-sm font-medium text-[#2A0E18]">Manual</p>
                  <p className="text-xs text-[#7A5260]">El admin elige los productos destacados</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="destacados" className="accent-[#8E1B3A]" />
                <div>
                  <p className="text-sm font-medium text-[#2A0E18]">Automático por popularidad</p>
                  <p className="text-xs text-[#7A5260]">Se seleccionan por calificación y volumen de ventas</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">
              Cantidad máxima de productos destacados
            </label>
            <input
              type="number"
              defaultValue={6}
              className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]"
            />
          </div>

          <button className="w-full bg-[#8E1B3A] text-white text-sm py-2.5 rounded-lg font-medium hover:opacity-85 transition-opacity">
            Guardar configuración de destacados
          </button>
        </div>

        {/* Info de la plataforma */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-6 space-y-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Información de la plataforma</h3>

          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">Nombre de la plataforma</label>
            <input type="text" defaultValue="Emotia" className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">Ciudad de operación</label>
            <input type="text" defaultValue="La Paz, Bolivia" className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">Email de soporte</label>
            <input type="email" defaultValue="soporte@emotia.bo" className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]" />
          </div>

          <button className="w-full bg-[#8E1B3A] text-white text-sm py-2.5 rounded-lg font-medium hover:opacity-85 transition-opacity">
            Guardar información
          </button>
        </div>

        {/* Seguridad */}
        <div className="bg-white rounded-xl border border-[#8E1B3A]/10 p-6 space-y-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Seguridad del administrador</h3>

          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">Email del administrador</label>
            <input type="email" defaultValue="admin@emotia.bo" className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">Nueva contraseña</label>
            <input type="password" placeholder="••••••••" className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">Confirmar contraseña</label>
            <input type="password" placeholder="••••••••" className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]" />
          </div>

          <button className="w-full bg-[#8E1B3A] text-white text-sm py-2.5 rounded-lg font-medium hover:opacity-85 transition-opacity">
            Actualizar credenciales
          </button>
        </div>
      </div>
    </div>
  );
}
