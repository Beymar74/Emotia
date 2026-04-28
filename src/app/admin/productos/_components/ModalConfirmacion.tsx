"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface ModalConfirmacionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo?: string;
  mensaje?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ModalConfirmacion({
  isOpen,
  onClose,
  onConfirm,
  titulo = "Confirmar acción",
  mensaje = "¿Estás seguro de que deseas realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDestructive = true,
}: ModalConfirmacionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#2A0E18]/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#8E1B3A]/10 overflow-hidden"
          >
            {/* Header / Icon */}
            <div className="flex justify-center pt-8">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isDestructive ? "bg-[#FBF0F0] text-[#A32D2D]" : "bg-[#FAF3EC] text-[#BC9968]"
                }`}
              >
                <AlertCircle size={32} />
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pt-4 pb-6 text-center space-y-2">
              <h3 className="font-serif text-xl font-bold text-[#5A0F24]">{titulo}</h3>
              <p className="text-sm text-[#7A5260] leading-relaxed">
                {mensaje}
              </p>
            </div>

            {/* Footer / Buttons */}
            <div className="flex gap-3 px-6 pb-6 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-[#7A5260] bg-[#F1EFE8] hover:bg-[#E5E3DC] transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg ${
                  isDestructive
                    ? "bg-[#A32D2D] hover:bg-[#822424] shadow-[#A32D2D]/20"
                    : "bg-[#8E1B3A] hover:bg-[#5A0F24] shadow-[#8E1B3A]/20"
                }`}
              >
                {confirmText}
              </button>
            </div>

            {/* Close Button Top-Right */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full text-[#7A5260]/50 hover:text-[#5A0F24] hover:bg-[#F1EFE8] transition-all"
            >
              <X size={18} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
