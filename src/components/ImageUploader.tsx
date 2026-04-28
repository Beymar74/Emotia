"use client";
import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus } from "lucide-react";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  buttonText?: string;
  uploadPreset?: string;
}

export default function ImageUploader({ 
  onUploadSuccess, 
  buttonText = "Subir Imagen",
  uploadPreset = "emotia_preset" 
}: ImageUploaderProps) {
  return (
    <CldUploadWidget
      uploadPreset={uploadPreset}
      onSuccess={(result: any) => {
        if (result.info && typeof result.info === 'object' && result.info.secure_url) {
          onUploadSuccess(result.info.secure_url);
        }
      }}
      options={{
        maxFiles: 1,
        resourceType: "auto", // Acepta imágenes y videos
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "mp4", "mov"],
      }}
    >
      {({ open }) => {
        return (
          <button
            type="button"
            onClick={() => open()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#F5E6D0",
              color: "#5A0F24",
              border: "1px solid #BC9968",
              padding: "10px 20px",
              borderRadius: "8px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#BC9968")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#F5E6D0")}
          >
            <ImagePlus size={18} />
            {buttonText}
          </button>
        );
      }}
    </CldUploadWidget>
  );
}
