"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, CheckCircle, Trash2 } from "lucide-react";
import { subirImagenCloudinaryAction } from "@/app/admin/actions/upload";
import ModalRecorte from "@/components/ModalRecorte";

interface HeaderPerfilAvatarProps {
  currentUrl?: string | null;
  onSave: (url: string) => Promise<void>;
  onRemove?: () => Promise<void>;
  /** Tamaño del avatar en px (default 128) */
  size?: number;
}

export default function HeaderPerfilAvatar({
  currentUrl,
  onSave,
  onRemove,
  size = 128,
}: HeaderPerfilAvatarProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showActions, setShowActions] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Solo se permiten imágenes");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setImageToCrop(objectUrl);
    setShowActions(false);
    setErrorMsg("");
    // reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleConfirmCrop = async (croppedBlob: Blob) => {
    setIsSaving(true);
    setSavedOk(false);
    try {
      const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("file", file);

      const result = await subirImagenCloudinaryAction(formData);
      if (result.error) throw new Error(result.error);
      if (result.success && result.url) {
        await onSave(result.url);
        setPreviewUrl(result.url);
        setSavedOk(true);
        setTimeout(() => setSavedOk(false), 2500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error al subir la imagen");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!onRemove) return;
    setIsRemoving(true);
    setShowActions(false);
    try {
      await onRemove();
      setPreviewUrl(null);
    } catch {
      setErrorMsg("No se pudo eliminar la imagen");
    } finally {
      setIsRemoving(false);
    }
  };

  const isBusy = isSaving || isRemoving;

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Avatar clickeable */}
      <div className="relative group" style={{ width: size, height: size }}>
        {/* Anillo decorativo exterior */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(135deg, #8E1B3A 0%, #BC9968 50%, #8E1B3A 100%)",
            padding: 3,
          }}
        >
          <div className="w-full h-full rounded-full bg-[#1A0810]" />
        </div>

        {/* Imagen / placeholder */}
        <div
          className="absolute rounded-full overflow-hidden bg-gradient-to-br from-[#F5E6D0] to-[#FDFBF9]"
          style={{ inset: 3 }}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Avatar"
              fill
              className="object-cover"
              sizes={`${size}px`}
              unoptimized={previewUrl.startsWith("blob:")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#BC9968]/50">
              <Camera size={size * 0.25} />
            </div>
          )}
        </div>

        {/* Overlay hover — ícono de cámara */}
        <button
          type="button"
          disabled={isBusy}
          onClick={() => {
            if (previewUrl) {
              setShowActions((v) => !v);
            } else {
              fileInputRef.current?.click();
            }
          }}
          className="
            absolute inset-0 rounded-full
            flex flex-col items-center justify-center gap-1
            bg-black/0 group-hover:bg-black/50
            transition-all duration-200
            cursor-pointer disabled:cursor-not-allowed
            z-10
          "
          aria-label="Cambiar foto de perfil"
        >
          {isBusy ? (
            <Loader2 size={size * 0.2} className="animate-spin text-white opacity-100" />
          ) : savedOk ? (
            <CheckCircle size={size * 0.22} className="text-emerald-400" />
          ) : (
            <>
              <Camera
                size={size * 0.2}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
              <span className="text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 leading-none">
                {previewUrl ? "Cambiar" : "Subir"}
              </span>
            </>
          )}
        </button>

        {/* Indicador verde de éxito */}
        {savedOk && (
          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center z-20">
            <CheckCircle size={10} className="text-white" />
          </div>
        )}
      </div>

      {/* Mini menú de acciones flotante */}
      {showActions && previewUrl && (
        <div className="absolute mt-2 flex flex-col gap-1 bg-white rounded-2xl shadow-xl border border-[#8E1B3A]/10 p-2 z-30 min-w-[160px]">
          <button
            type="button"
            onClick={() => {
              setShowActions(false);
              fileInputRef.current?.click();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#5A0F24] hover:bg-[#F5E6D0] transition-colors"
          >
            <Camera size={14} />
            Cambiar foto
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#A32D2D] hover:bg-[#FBF0F0] transition-colors"
            >
              <Trash2 size={14} />
              Eliminar foto
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <span className="text-[10px] text-[#A32D2D] font-bold bg-[#FBF0F0] px-2 py-1 rounded-full">
          {errorMsg}
        </span>
      )}

      {/* Modal de recorte */}
      <ModalRecorte
        image={imageToCrop}
        isOpen={!!imageToCrop}
        onClose={() => setImageToCrop(null)}
        onConfirm={handleConfirmCrop}
        shape="circle"
      />
    </>
  );
}