"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-2xl",
}: ModalProps) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle open/close with animation
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      // Small delay so the DOM renders first, then trigger animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
      document.body.style.overflow = "hidden";
    } else {
      setAnimating(false);
      const timer = setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = "unset";
      }, 300); // match transition duration
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop with Glassmorphism */}
      <div
        onClick={onClose}
        style={{
          transition: "opacity 400ms ease",
          opacity: animating ? 1 : 0,
        }}
        className="fixed inset-0 bg-[#1A0810]/40 backdrop-blur-[8px]"
      />

      {/* Floating Modal Panel */}
      <div
        ref={modalRef}
        style={{
          transition: "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: animating ? 1 : 0,
          transform: animating
            ? "translateY(0) scale(1)"
            : "translateY(20px) scale(0.95)",
        }}
        className={`
          relative bg-white/95 w-full ${maxWidth}
          flex flex-col
          rounded-[32px]
          shadow-[0_20px_50px_rgba(90,15,36,0.2),0_10px_15px_rgba(90,15,36,0.1)]
          border border-white/20
          backdrop-blur-md
          overflow-hidden
        `}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#8E1B3A]/10 flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#8E1B3A] to-[#BC9968]" />
            <h3
              id="modal-title"
              className="font-serif font-bold text-[#5A0F24] text-xl tracking-tight"
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="
              w-10 h-10 flex items-center justify-center rounded-full
              text-[#7A5260] hover:text-[#5A0F24]
              hover:bg-[#8E1B3A]/10
              active:scale-90
              transition-all duration-200
              bg-white/50 shadow-sm border border-white
            "
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-8 py-6 bg-white/50 border-t border-[#8E1B3A]/10 backdrop-blur-sm">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}