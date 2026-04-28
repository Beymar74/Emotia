"use client";

import AvatarUploader from "@/components/AvatarUploader";
import { actualizarFotoUsuario } from "../acciones";

interface FotoPerfilUploaderProps {
  usuarioId: number;
  fotoActual: string | null;
  label?: string;
}

export default function FotoPerfilUploader({ usuarioId, fotoActual, label = "" }: FotoPerfilUploaderProps) {
  return (
    <AvatarUploader
      currentUrl={fotoActual}
      label={label}
      shape="circle"
      uploadPreset="emotia_preset"
      onSave={async (url) => {
        await actualizarFotoUsuario(usuarioId, url);
      }}
      onRemove={async () => {
        await actualizarFotoUsuario(usuarioId, null);
      }}
    />
  );
}
