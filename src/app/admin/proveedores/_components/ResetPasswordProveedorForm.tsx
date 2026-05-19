"use client";

import { useState, useTransition } from "react";
import { KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { resetProveedorPasswordAction } from "../acciones";

export default function ResetPasswordProveedorForm({
  proveedorId,
}: {
  proveedorId: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    startTransition(async () => {
      const result = await resetProveedorPasswordAction(proveedorId, formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    });
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setSuccess(false);
          setError("");
        }}
        className="flex items-center gap-2 px-4 py-2 mt-4 bg-white border border-[#8E1B3A]/20 rounded-xl text-sm font-medium text-[#8E1B3A] hover:bg-[#FAF3EC] transition-colors shadow-sm"
      >
        <KeyRound size={16} />
        Restablecer contraseña
      </button>
    );
  }

  return (
    <div className="mt-4 p-5 bg-white border border-[#8E1B3A]/20 rounded-2xl shadow-sm animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#5A0F24] flex items-center gap-2">
          <KeyRound size={18} />
          Nueva contraseña del proveedor
        </h3>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-xs text-[#7A5260] hover:text-[#5A0F24] underline"
        >
          Cancelar
        </button>
      </div>

      {success ? (
        <div className="flex items-center gap-2 p-3 bg-[#EEF8F0] border border-[#2D7A47]/20 text-[#2D7A47] rounded-xl text-sm font-medium">
          <CheckCircle2 size={18} />
          Contraseña actualizada correctamente.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {error ? (
            <div className="bg-[#FBF0F0] text-[#A32D2D] text-xs font-bold p-2.5 rounded-xl border border-[#A32D2D]/10">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider mb-1 block">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                minLength={8}
                className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#7A5260] uppercase tracking-wider mb-1 block">
                Confirmar
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                minLength={8}
                className="w-full bg-[#FDFBF9] border border-[#8E1B3A]/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#8E1B3A]/20 transition-all text-[#2A0E18]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 mt-2 rounded-xl font-bold text-xs text-white bg-[#8E1B3A] hover:bg-[#5A0F24] transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Guardar nueva contraseña"
            )}
          </button>
        </form>
      )}
    </div>
  );
}