"use server";

import cloudinary from "@/lib/cloudinary";

export async function subirImagenCloudinaryAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No se proporcionó ningún archivo." };
    }

    // Validar tipo y tamaño
    if (!file.type.startsWith("image/")) {
      return { error: "El archivo debe ser una imagen." };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { error: "La imagen no debe superar los 5MB." };
    }

    // Convertir a ArrayBuffer y luego a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir a Cloudinary con una promesa
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "emotia", resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // Escribir el buffer al stream
      uploadStream.end(buffer);
    });

    // Retornar la URL generada
    return { success: true, url: (uploadResult as any).secure_url };
  } catch (error) {
    console.error("Error subiendo imagen a Cloudinary:", error);
    return { error: "Ocurrió un error inesperado al procesar la imagen." };
  }
}
