"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function cambiarEstadoProveedorAction(
  id: number,
  nuevoEstado: "aprobado" | "pendiente" | "suspendido"
) {
  try {
    await prisma.proveedores.update({
      where: { id },
      data: {
        estado: nuevoEstado,
        updated_at: new Date(),
      },
    });

    revalidatePath("/admin/proveedores");
    revalidatePath(`/admin/proveedores/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error cambiando estado proveedor:", error);
    return { error: "No se pudo cambiar el estado del proveedor." };
  }
}

export async function editarProveedorAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const nombre_negocio = String(formData.get("nombre_negocio") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const telefono = String(formData.get("telefono") || "").trim();
  const direccion = String(formData.get("direccion") || "").trim();
  const rep_nombre = String(formData.get("rep_nombre") || "").trim();
  const rep_email = String(formData.get("rep_email") || "").trim();
  const rep_telefono = String(formData.get("rep_telefono") || "").trim();
  const descripcion = String(formData.get("descripcion") || "").trim();
  const estadoRaw = String(formData.get("estado") || "pendiente");
  const estado = ["pendiente", "aprobado", "suspendido"].includes(estadoRaw)
  ? estadoRaw
  : "pendiente";
  
  if (!id || !nombre_negocio || !email) {
    return {
      error: "El nombre del negocio y el correo son obligatorios.",
    };
  }

  try {
    await prisma.proveedores.update({
      where: { id },
      data: {
        nombre_negocio,
        email,
        telefono: telefono || null,
        direccion: direccion || null,
        rep_nombre: rep_nombre || null,
        rep_email: rep_email || null,
        rep_telefono: rep_telefono || null,
        descripcion: descripcion || null,
        estado,
        updated_at: new Date(),
      },
    });

    revalidatePath("/admin/proveedores");
    revalidatePath(`/admin/proveedores/${id}`);
    revalidatePath("/admin/empresas/actividad");
    revalidatePath("/admin/usuarios");

    return { success: true };
  } catch (error) {
    console.error("Error editando proveedor:", error);

    return {
      error:
        "No se pudo actualizar el proveedor. Verifica que el correo no esté repetido.",
    };
  }
}
export async function crearRepresentanteAction(formData: FormData) {
  const nombre_negocio = String(formData.get("nombre_negocio") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const telefono = String(formData.get("telefono") || "").trim();
  const direccion = String(formData.get("direccion") || "").trim();
  const rep_nombre = String(formData.get("rep_nombre") || "").trim();
  const rep_email = String(formData.get("rep_email") || "").trim();
  const rep_telefono = String(formData.get("rep_telefono") || "").trim();
  const rep_anio_raw = formData.get("rep_anio_nacimiento");

  if (!nombre_negocio || !email || !password || !rep_nombre) {
    return { error: "Nombre de negocio, email, contraseña y nombre del representante son obligatorios." };
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  try {
    const existente = await prisma.proveedores.findUnique({ where: { email } });
    if (existente) {
      return { error: "Ya existe una empresa registrada con ese correo electrónico." };
    }

    const password_hash = await bcrypt.hash(password, 12);

    await prisma.proveedores.create({
      data: {
        nombre_negocio,
        email,
        password_hash,
        telefono: telefono || null,
        direccion: direccion || null,
        rep_nombre,
        rep_email: rep_email || null,
        rep_telefono: rep_telefono || null,
        rep_anio_nacimiento: rep_anio_raw ? parseInt(String(rep_anio_raw)) : null,
        estado: "pendiente",
      },
    });

    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error creando representante:", error);
    return { error: "No se pudo crear el representante. Verifica que el correo no esté duplicado." };
  }
}

export async function actualizarLogoProveedor(id: number, url: string | null) {
  try {
    await prisma.proveedores.update({
      where: { id },
      data: {
        logo_url: url,
        updated_at: new Date(),
      },
    });

    revalidatePath("/admin/proveedores");
    revalidatePath(`/admin/proveedores/${id}`);
    revalidatePath("/admin/empresas/actividad");
    revalidatePath("/admin/usuarios");

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar logo del proveedor:", error);

    return {
      error: "No se pudo guardar el logo del proveedor.",
    };
  }
}
export async function resetProveedorPasswordAction(
  proveedorId: number,
  formData: FormData
) {
  const password = String(formData.get("password") || "").trim();
  const confirmPassword = String(formData.get("confirmPassword") || "").trim();

  if (!proveedorId) {
    return {
      error: "Proveedor inválido.",
    };
  }

  if (password.length < 8) {
    return {
      error: "La contraseña debe tener al menos 8 caracteres.",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Las contraseñas no coinciden.",
    };
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.proveedores.update({
      where: {
        id: proveedorId,
      },
      data: {
        password_hash: passwordHash,
        updated_at: new Date(),
      },
    });

    revalidatePath("/admin/proveedores");
    revalidatePath(`/admin/proveedores/${proveedorId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error restableciendo contraseña proveedor:", error);

    return {
      error: "No se pudo restablecer la contraseña del proveedor.",
    };
  }
}