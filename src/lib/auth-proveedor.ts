import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function obtenerProveedorActual() {
  try {
    // =========================
    // OBTENER COOKIE
    // =========================

    const cookieStore = await cookies();

    const session = cookieStore.get("emotia_b2b_session");

    if (!session?.value) {
      return null;
    }

    // =========================
    // BUSCAR SESIÓN
    // =========================

    const sesionDB = await prisma.proveedor_sesiones.findUnique({
      where: {
        token: session.value,
      },
      include: {
        proveedores: {
          select: {
            id: true,
            nombre_negocio: true,
            email: true,
            estado: true,
            logo_url: true,
            rep_nombre: true,
          },
        },
      },
    });

    if (!sesionDB) {
      return null;
    }

    // =========================
    // VALIDAR EXPIRACIÓN
    // =========================

    const ahora = new Date();

    if (sesionDB.expires_at <= ahora) {
      await prisma.proveedor_sesiones.delete({
        where: {
          id: sesionDB.id,
        },
      });

      return null;
    }

    if (!sesionDB.proveedores) {
      return null;
    }

    if (sesionDB.proveedores.estado === "suspendido") {
      return null;
    }

    return sesionDB.proveedores;
  } catch (error) {
    console.error("Error obteniendo proveedor actual:", error);
    return null;
  }
}
export async function obtenerDatosNegocioActual() {
  const proveedor = await requireProveedor();

  return {
    id: proveedor.id,
    nombre: proveedor.nombre_negocio,
    iniciales: proveedor.nombre_negocio
      .split(" ")
      .map((p: string) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    estado: proveedor.estado,
    logo: proveedor.logo_url,
    email: proveedor.email,
    representante: proveedor.rep_nombre,
  };
}
export async function requireProveedor() {
  const proveedor = await obtenerProveedorActual();

  if (!proveedor) {
    redirect("/business/proveedores/login");
  }

  return proveedor;
}