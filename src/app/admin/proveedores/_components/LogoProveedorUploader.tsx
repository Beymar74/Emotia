"use client";

import AvatarUploader from "@/components/AvatarUploader";
import { actualizarLogoProveedor } from "../acciones";

interface LogoProveedorUploaderProps {
  proveedorId: number;
  logoActual: string | null;
  label?: string;
}

export default function LogoProveedorUploader({
  proveedorId,
  logoActual,
  label = "",
}: LogoProveedorUploaderProps) {
  return (
    <AvatarUploader
      currentUrl={logoActual}
      label={label}
      shape="square"
      uploadPreset="emotia_preset"
      onSave={async (url) => {
        await actualizarLogoProveedor(proveedorId, url);
      }}
      onRemove={async () => {
        await actualizarLogoProveedor(proveedorId, null);
      }}
    />
  );
}