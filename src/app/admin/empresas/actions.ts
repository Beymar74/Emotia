"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

const REVALIDATE_PATHS = [
  "/admin/empresas",
  "/admin/empresas/actividad",
  "/admin/usuarios",
];

function revalidateAll() {
  REVALIDATE_PATHS.forEach((p) => revalidatePath(p));
}

export async function toggleSuspensionProveedor(id: number, estadoActual: string) {
  try {
    const nuevoEstado = estadoActual === "aprobado" ? "suspendido" : "aprobado";
    await prisma.proveedores.update({ where: { id }, data: { estado: nuevoEstado } });
    revalidateAll();
    return { success: true, nuevoEstado };
  } catch (error) {
    console.error("Error al cambiar estado de la empresa:", error);
    return { success: false, error: "No se pudo cambiar el estado de la empresa" };
  }
}

export async function crearEmpresaAction(formData: FormData) {
  const nombre_negocio = String(formData.get("nombre_negocio") || "").trim();
  const email          = String(formData.get("email")          || "").trim();
  const telefono       = String(formData.get("telefono")       || "").trim();
  const descripcion    = String(formData.get("descripcion")    || "").trim();
  const direccion      = String(formData.get("direccion")      || "").trim();
  const password       = String(formData.get("password")       || "").trim();
  const rep_nombre     = String(formData.get("rep_nombre")     || "").trim();
  const rep_email      = String(formData.get("rep_email")      || "").trim();
  const rep_telefono   = String(formData.get("rep_telefono")   || "").trim();
  const rep_anio_raw   = formData.get("rep_anio_nacimiento");

  if (!nombre_negocio || !email || !password || !rep_nombre) {
    return { error: "Nombre de negocio, email, contraseña y representante son obligatorios." };
  }

  try {
    const existe = await prisma.proveedores.findUnique({ where: { email } });
    if (existe) return { error: "El correo electrónico ya está registrado." };

    const password_hash = await bcrypt.hash(password, 10);

    await prisma.proveedores.create({
      data: {
        nombre_negocio,
        email,
        password_hash,
        telefono:            telefono   || null,
        descripcion:         descripcion || null,
        direccion:           direccion  || null,
        rep_nombre:          rep_nombre,
        rep_email:           rep_email  || null,
        rep_telefono:        rep_telefono || null,
        rep_anio_nacimiento: rep_anio_raw ? parseInt(String(rep_anio_raw)) : null,
        estado:              "aprobado",
        calificacion_prom:   0,
        total_vendido:       0,
      },
    });

    revalidateAll();
    return { success: true };
  } catch (error) {
    console.error("Error al crear empresa:", error);
    return { error: "Ocurrió un error al crear la empresa." };
  }
}
