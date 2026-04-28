"use server";

import prisma from "@/lib/prisma";

// 1. Definimos los tipos para que TypeScript sepa qué es "DatosRegistro"
export interface DatosRegistro {
  nombreEmpresa: string;
  categoria: string;
  ciudad: string;
  linkRedes: string;
  nombreRepresentante: string;
  email: string;
  telefono: string;
  password: string;
  anioNacimiento: string;
}

// 2. La función principal
export async function registrarProveedorDB(datos: DatosRegistro) {
  try {
    // Insertamos todo directamente en tu tabla 'proveedores'
    const nuevoProveedor = await prisma.proveedores.create({
      data: {
        // --- DATOS DEL NEGOCIO ---
        nombre_negocio: datos.nombreEmpresa,
        descripcion: `Categoría: ${datos.categoria} | Redes: ${datos.linkRedes || 'N/A'}`,
        email: datos.email, 
        password_hash: datos.password, // Recuerda: en producción usar bcrypt
        telefono: datos.telefono,
        estado: "SUSPENDIDO",
        direccion: datos.ciudad, 
        
        // --- DATOS DEL REPRESENTANTE ---
        rep_nombre: datos.nombreRepresentante,
        rep_email: datos.email,
        rep_telefono: datos.telefono,
        rep_anio_nacimiento: parseInt(datos.anioNacimiento) || 2000, 
      },
    });

    // ¡AQUÍ ESTÁ LA MAGIA! 
    // Devolvemos solo datos "planos" (boolean, string, number) para evitar el error Decimal
    return { 
      success: true, 
      id: nuevoProveedor.id,
      email: nuevoProveedor.email 
    };

  } catch (error) {
    console.error("Error al registrar en BD:", error);
    return { success: false, error: "El correo ya está registrado o hubo un problema de conexión." };
  }
}