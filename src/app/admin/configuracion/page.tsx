"use client";

import { useState, useTransition } from "react";
import {
  actualizarInfoPlataformaAction,
  actualizarDestacadosAction,
  actualizarAdminAction,
} from "./actions";

function Toast({ msg, tipo }: { msg: string; tipo: "ok" | "err" }) {
  return (
    <p className={`text-xs mt-3 px-3 py-2 rounded-lg ${
      tipo === "ok" ? "bg-[#EEF8F0] text-[#2D7A47]" : "bg-[#FBF0F0] text-[#A32D2D]"
    }`}>
      {msg}
    </p>
  );
}

function SaveBtn({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#8E1B3A] text-white text-sm py-2.5 rounded-lg font-medium hover:opacity-85 transition-opacity disabled:opacity-50"
    >
      {pending ? "Guardando…" : "Guardar cambios"}
    </button>
  );
}

export default function ConfiguracionPage() {
  const [msgPlataforma, setMsgPlataforma] = useState<{ t: "ok" | "err"; m: string } | null>(null);
  const [msgDestacados, setMsgDestacados] = useState<{ t: "ok" | "err"; m: string } | null>(null);
  const [msgAdmin, setMsgAdmin] = useState<{ t: "ok" | "err"; m: string } | null>(null);

  const [pendingP, startP] = useTransition();
  const [pendingD, startD] = useTransition();
  const [pendingA, startA] = useTransition();

  const handlePlataforma = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startP(async () => {
      const r = await actualizarInfoPlataformaAction(fd);
      setMsgPlataforma("error" in r ? { t: "err", m: r.error ?? "Error" } : { t: "ok", m: "Información guardada correctamente." });
      setTimeout(() => setMsgPlataforma(null), 3000);
    });
  };

  const handleDestacados = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startD(async () => {
      const r = await actualizarDestacadosAction(fd);
      setMsgDestacados("error" in r ? { t: "err", m: r.error ?? "Error" } : { t: "ok", m: "Configuración de productos guardada." });
      setTimeout(() => setMsgDestacados(null), 3000);
    });
  };

  const handleAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startA(async () => {
      const r = await actualizarAdminAction(fd);
      setMsgAdmin("error" in r ? { t: "err", m: r.error ?? "Error" } : { t: "ok", m: "Credenciales actualizadas." });
      setTimeout(() => setMsgAdmin(null), 3000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs tracking-widest uppercase text-[#BC9968] font-medium">Reportes &amp; Sistema</p>
        <h1 className="font-serif text-3xl font-bold text-[#5A0F24]">Configuración</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Información de la plataforma */}
        <form onSubmit={handlePlataforma} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-6 space-y-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Información de la plataforma</h3>
          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">Nombre de la plataforma</label>
            <input name="nombre" type="text" defaultValue="Emotia"
              className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">Ciudad de operación</label>
            <input name="ciudad" type="text" defaultValue="La Paz, Bolivia"
              className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]" />
          </div>
          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">Email de soporte</label>
            <input name="soporte" type="email" defaultValue="soporte@emotia.bo"
              className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]" />
          </div>
          <SaveBtn pending={pendingP} />
          {msgPlataforma && <Toast msg={msgPlataforma.m} tipo={msgPlataforma.t} />}
        </form>

        {/* Productos destacados */}
        <form onSubmit={handleDestacados} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-6 space-y-5">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Productos destacados</h3>
          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-3">Modo de selección</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="destacados" value="manual" defaultChecked className="accent-[#8E1B3A]" />
                <div>
                  <p className="text-sm font-medium text-[#2A0E18]">Manual</p>
                  <p className="text-xs text-[#7A5260]">El admin elige los productos destacados</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="destacados" value="automatico" className="accent-[#8E1B3A]" />
                <div>
                  <p className="text-sm font-medium text-[#2A0E18]">Automático por popularidad</p>
                  <p className="text-xs text-[#7A5260]">Calificación y volumen de ventas</p>
                </div>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">Cantidad máxima de destacados</label>
            <input name="limite" type="number" defaultValue={6} min={1} max={20}
              className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]" />
          </div>
          <SaveBtn pending={pendingD} />
          {msgDestacados && <Toast msg={msgDestacados.m} tipo={msgDestacados.t} />}
        </form>

        {/* Seguridad del administrador */}
        <form onSubmit={handleAdmin} className="bg-white rounded-xl border border-[#8E1B3A]/10 p-6 space-y-5 md:col-span-2">
          <h3 className="font-serif text-xl font-semibold text-[#5A0F24]">Seguridad del administrador</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">Email del administrador</label>
              <input name="email" type="email" defaultValue="admin@emotia.bo"
                className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">Nueva contraseña</label>
              <input name="password" type="password" placeholder="••••••••"
                className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#2A0E18] block mb-1.5">Confirmar contraseña</label>
              <input name="confirmar" type="password" placeholder="••••••••"
                className="w-full text-sm border border-[#8E1B3A]/15 rounded-lg px-4 py-2.5 outline-none focus:border-[#8E1B3A]/40 text-[#2A0E18]" />
            </div>
          </div>
          <div className="max-w-xs">
            <SaveBtn pending={pendingA} />
          </div>
          {msgAdmin && <Toast msg={msgAdmin.m} tipo={msgAdmin.t} />}
        </form>

      </div>
    </div>
  );
}
