"use client";

import React, { useState, useRef } from "react";
import { Camera, Trash2, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";
import { subirImagenCloudinaryAction } from "@/app/admin/actions/upload";
import ModalRecorte from "@/components/ModalRecorte";

interface AvatarUploaderProps {
  currentUrl?: string | null;
  label?: string;
  shape?: "circle" | "square";
  uploadPreset?: string;
  onSave: (url: string) => Promise<void>;
  onRemove?: () => Promise<void>;
}

export default function AvatarUploader({
  currentUrl,
  label = "Foto de Perfil",
  shape = "circle",
  onSave,
  onRemove,
}: AvatarUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Cropping state
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isCircle = shape === "circle";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Solo se permiten imágenes");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setImageToCrop(objectUrl);
    setErrorMsg("");
  };

  const handleConfirmCrop = async (croppedBlob: Blob) => {
    setIsSaving(true);
    setSavedOk(false);

    try {
      const croppedFile = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", croppedFile);

      const uploadResult = await subirImagenCloudinaryAction(formData);

      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      if (uploadResult.success && uploadResult.url) {
        await onSave(uploadResult.url);
        setPreviewUrl(uploadResult.url);
        setSavedOk(true);
        setTimeout(() => setSavedOk(false), 2500);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Error al subir la imagen");
    } finally {
      setIsSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (!onRemove) return;
    setIsRemoving(true);
    setErrorMsg("");
    try {
      await onRemove();
      setPreviewUrl(null);
    } catch (err) {
      setErrorMsg("No se pudo remover la imagen");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {label && (
        <p className="text-xs font-bold text-[#7A5260] uppercase tracking-wider self-start">
          {label}
        </p>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp, image/gif"
        className="hidden"
      />

      {/* Preview Container */}
      <div
        className={`relative overflow-hidden border-2 border-[#8E1B3A]/15 shadow-lg bg-gradient-to-br from-[#F5E6D0] to-[#FDFBF9] ${
          isCircle ? "w-28 h-28 rounded-full" : "w-32 h-32 rounded-2xl"
        }`}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="preview"
            fill
            className="object-cover"
            sizes="128px"
            unoptimized={previewUrl.startsWith("blob:")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#BC9968]/50">
            <Camera size={32} />
          </div>
        )}

        {(isSaving || isRemoving) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <Loader2 size={24} className="animate-spin text-white" />
          </div>
        )}

        {savedOk && (
          <div className="absolute inset-0 bg-[#2D7A47]/80 flex items-center justify-center animate-in fade-in duration-300 z-10">
            <CheckCircle size={28} className="text-white" />
          </div>
        )}
      </div>

      {errorMsg && (
        <span className="text-xs text-[#A32D2D] font-bold text-center bg-[#FBF0F0] px-3 py-1 rounded-full border border-[#A32D2D]/10">
          {errorMsg}
        </span>
      )}

      <div className="flex gap-2 mt-1">
        <button
          type="button"
          disabled={isSaving || isRemoving}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#8E1B3A] text-white hover:bg-[#5A0F24] transition-all shadow-md shadow-[#8E1B3A]/20 disabled:opacity-50 active:scale-95"
        >
          <Camera size={14} />
          {previewUrl ? "Cambiar imagen" : "Subir imagen"}
        </button>

        {previewUrl && onRemove && (
          <button
            type="button"
            disabled={isSaving || isRemoving}
            onClick={handleRemove}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-[#FBF0F0] text-[#A32D2D] border border-[#A32D2D]/15 hover:bg-[#F5DADA] transition-all disabled:opacity-50 active:scale-95"
          >
            <Trash2 size={14} />
            Quitar
          </button>
        )}
      </div>

      {/* Modal Específico de Recorte */}
      <ModalRecorte
        image={imageToCrop}
        isOpen={!!imageToCrop}
        onClose={() => setImageToCrop(null)}
        onConfirm={handleConfirmCrop}
        shape={shape}
      />

      <p className="text-[10px] text-[#BC9968] text-center leading-relaxed">
        JPG, PNG o WebP · máx. 5 MB
        {isCircle && " · se recortará en forma circular"}
      </p>
    </div>
  );
}
