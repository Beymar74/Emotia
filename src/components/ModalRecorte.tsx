"use client";

import React, { useState, useCallback } from "react";
import { Loader2, Crop as CropIcon } from "lucide-react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import Modal from "@/components/Modal";

interface ModalRecorteProps {
  image: string | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (croppedBlob: Blob) => Promise<void>;
  shape?: "circle" | "square";
}

export default function ModalRecorte({
  image,
  isOpen,
  onClose,
  onConfirm,
  shape = "circle",
}: ModalRecorteProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isCircle = shape === "circle";

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!image || !croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
      await onConfirm(croppedImageBlob);
      onClose();
    } catch (err) {
      console.error("Error al procesar el recorte:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recortar Imagen"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-sm text-[#7A5260] bg-white border border-[#8E1B3A]/10 hover:bg-[#F1EFE8] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleConfirm}
            className="flex-[2] py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#8E1B3A] hover:bg-[#5A0F24] transition-all flex justify-center items-center gap-2 disabled:opacity-70 shadow-lg shadow-[#8E1B3A]/20"
          >
            {isProcessing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Aplicar y Subir"
            )}
          </button>
        </div>
      }
    >
      <div className="flex flex-col">
        {/* Area del Cropper */}
        <div className="relative w-full h-[300px] sm:h-[400px] bg-[#1a1a1a]">
          <Cropper
            image={image || ""}
            crop={crop}
            zoom={zoom}
            aspect={isCircle || shape === "square" ? 1 : undefined}
            cropShape={isCircle ? "round" : "rect"}
            showGrid={true}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controles de Zoom */}
        <div className="p-6 space-y-3 bg-[#FDFBF9]">
          <div className="flex justify-between text-xs font-bold text-[#7A5260] uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <CropIcon size={14} className="text-[#BC9968]" />
              Nivel de Zoom
            </span>
            <span className="text-[#8E1B3A]">{Math.round(zoom * 100)}%</span>
          </div>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2 bg-[#BC9968]/20 rounded-lg appearance-none cursor-pointer accent-[#8E1B3A]"
          />
        </div>
      </div>
    </Modal>
  );
}
