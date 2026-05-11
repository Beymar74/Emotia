import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireProveedor } from "@/lib/auth-proveedor";
import prisma from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const proveedor = await requireProveedor();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No se recibió ninguna imagen." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "El archivo debe ser una imagen." },
        { status: 400 }
      );
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "La imagen no debe superar los 2MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "emotia/proveedores/logos",
            public_id: `proveedor_${proveedor.id}_${Date.now()}`,
            overwrite: true,
            resource_type: "image",
            transformation: [
              {
                width: 600,
                height: 600,
                crop: "fill",
                gravity: "auto",
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    await prisma.proveedores.update({
      where: {
        id: proveedor.id,
      },
      data: {
        logo_url: uploadResult.secure_url,
      },
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Error subiendo logo:", error);

    return NextResponse.json(
      { success: false, error: "No se pudo subir el logo." },
      { status: 500 }
    );
  }
}