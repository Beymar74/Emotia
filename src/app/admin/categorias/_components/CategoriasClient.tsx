"use client";

import { useState, useTransition } from "react";
import {
  crearCategoriaAction,
  editarCategoriaAction,
  toggleCategoriaAction,
} from "../actions";

type Categoria = {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  _count: { productos: number };
};

export default function CategoriasClient({
  categorias,
}: {
  categorias: Categoria[];
}) {
  const [lista, setLista] = useState(categorias);
  const [modal, setModal] = useState<"nuevo" | "editar" | null>(null);
  const [seleccionada, setSeleccionada] = useState<Categoria | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const abrirNuevo = () => {
    setSeleccionada(null);
    setError("");
    setModal("nuevo");
  };

  const abrirEditar = (cat: Categoria) => {
    setSeleccionada(cat);
    setError("");
    setModal("editar");
  };

  const cerrar = () => {
    setModal(null);
    setSeleccionada(null);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError("");

    startTransition(async () => {
      const result =
        modal === "editar"
          ? await editarCategoriaAction(formData)
          : await crearCategoriaAction(formData);

      if ("error" in result) {
        setError(result.error ?? "No se pudo guardar la categoría.");
      } else {
        cerrar();
        // Refrescar navegando (RSC revalida)
        window.location.reload();
      }
    });
  };

  const handleToggle = (cat: Categoria) => {
    startTransition(async () => {
      await toggleCategoriaAction(cat.id, cat.activo);
      setLista((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, activo: !c.activo } : c))
      );
    });
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#7A5260]">
          {lista.length} categoría{lista.length !== 1 ? "s" : ""} registrada
          {lista.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={abrirNuevo}
          className="bg-[#8E1B3A] text-white text-sm px-5 py-2.5 rounded-lg font-medium hover:opacity-85 transition-opacity"
        >
          + Nueva categoría
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[#8E1B3A]/10 overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr>
              {["ID", "Nombre", "Descripción", "Productos", "Estado", "Acciones"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs tracking-widest uppercase text-[#7A5260] font-medium border-b border-[#8E1B3A]/10"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {lista.map((cat) => (
              <tr
                key={cat.id}
                className="border-b border-[#8E1B3A]/5 last:border-0 hover:bg-[#FAF3EC]/50 transition-colors"
              >
                <td className="px-4 py-3 text-xs font-mono text-[#7A5260]">
                  #{cat.id}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-[#2A0E18]">
                  {cat.nombre}
                </td>
                <td className="px-4 py-3 text-sm text-[#7A5260] max-w-xs truncate">
                  {cat.descripcion ?? (
                    <span className="italic text-[#B0B0B0]">Sin descripción</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-center text-[#5A0F24] font-bold">
                  {cat._count.productos}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      cat.activo
                        ? "bg-[#EEF8F0] text-[#2D7A47]"
                        : "bg-[#FBF0F0] text-[#A32D2D]"
                    }`}
                  >
                    {cat.activo ? "Activa" : "Inactiva"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => abrirEditar(cat)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#FAF3EC] text-[#8C5E08] font-medium hover:opacity-80 transition-opacity"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggle(cat)}
                      disabled={isPending}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition-opacity disabled:opacity-50 ${
                        cat.activo
                          ? "bg-[#FBF0F0] text-[#A32D2D]"
                          : "bg-[#EEF8F0] text-[#2D7A47]"
                      }`}
                    >
                      {cat.activo ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-[#7A5260]"
                >
                  No hay categorías registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="font-serif text-xl font-bold text-[#5A0F24] mb-5">
              {modal === "editar" ? "Editar categoría" : "Nueva categoría"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {modal === "editar" && seleccionada && (
                <input type="hidden" name="id" value={seleccionada.id} />
              )}
              <div>
                <label className="block text-xs font-semibold text-[#5A0F24] mb-1 uppercase tracking-wider">
                  Nombre *
                </label>
                <input
                  name="nombre"
                  required
                  defaultValue={seleccionada?.nombre ?? ""}
                  className="w-full border border-[#8E1B3A]/20 rounded-lg px-3 py-2 text-sm text-[#2A0E18] outline-none focus:border-[#8E1B3A]/50"
                  placeholder="Ej. Flores, Chocolates..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5A0F24] mb-1 uppercase tracking-wider">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  rows={3}
                  defaultValue={seleccionada?.descripcion ?? ""}
                  className="w-full border border-[#8E1B3A]/20 rounded-lg px-3 py-2 text-sm text-[#2A0E18] outline-none focus:border-[#8E1B3A]/50 resize-none"
                  placeholder="Descripción opcional..."
                />
              </div>
              {error && (
                <p className="text-xs text-[#A32D2D] bg-[#FBF0F0] px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={cerrar}
                  className="flex-1 border border-[#8E1B3A]/20 text-sm px-4 py-2.5 rounded-lg text-[#7A5260] hover:bg-[#FAF3EC] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-[#8E1B3A] text-white text-sm px-4 py-2.5 rounded-lg font-medium hover:opacity-85 transition-opacity disabled:opacity-60"
                >
                  {isPending ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
