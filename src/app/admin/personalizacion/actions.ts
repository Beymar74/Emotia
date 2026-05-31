"use server";

import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type DesignSection = "tarjetas" | "cajas" | "envolturas" | "listones";

const DESIGN_SECTION_OFFSETS: Record<DesignSection, number> = {
  tarjetas: 1_000_000,
  cajas: 2_000_000,
  envolturas: 3_000_000,
  listones: 4_000_000,
};

function decodeDesignSelectionKey(value: number): { section: DesignSection; id: number } | null {
  if (value >= DESIGN_SECTION_OFFSETS.listones) {
    return { section: "listones", id: value - DESIGN_SECTION_OFFSETS.listones };
  }
  if (value >= DESIGN_SECTION_OFFSETS.envolturas) {
    return { section: "envolturas", id: value - DESIGN_SECTION_OFFSETS.envolturas };
  }
  if (value >= DESIGN_SECTION_OFFSETS.cajas) {
    return { section: "cajas", id: value - DESIGN_SECTION_OFFSETS.cajas };
  }
  if (value >= DESIGN_SECTION_OFFSETS.tarjetas) {
    return { section: "tarjetas", id: value - DESIGN_SECTION_OFFSETS.tarjetas };
  }

  return null;
}

async function sincronizarEstadoDisenos(tx: Prisma.TransactionClient, designIds: number[]) {
  const seleccionadosPorSeccion: Record<DesignSection, number[]> = {
    tarjetas: [],
    cajas: [],
    envolturas: [],
    listones: [],
  };

  for (const value of designIds) {
    const decoded = decodeDesignSelectionKey(value);
    if (decoded) {
      seleccionadosPorSeccion[decoded.section].push(decoded.id);
      continue;
    }

    // Compatibilidad con registros antiguos que guardaban solo el id numérico.
    seleccionadosPorSeccion.tarjetas.push(value);
  }

  await tx.tarjeta_disenos.updateMany({ data: { activo: false } });
  await tx.envoltura_disenos.updateMany({ data: { activo: false } });

  if (seleccionadosPorSeccion.tarjetas.length > 0) {
    await tx.tarjeta_disenos.updateMany({
      where: { id: { in: seleccionadosPorSeccion.tarjetas } },
      data: { activo: true },
    });
  }

  if (seleccionadosPorSeccion.envolturas.length > 0) {
    await tx.envoltura_disenos.updateMany({
      where: { id: { in: seleccionadosPorSeccion.envolturas } },
      data: { activo: true },
    });
  }
}

type TarjetaCreateData = {
  section: "tarjetas";
  nombre: string;
  preview_url: string;
  color_acento: string;
  color_suave: string;
  color_marco: string;
  color_mensaje: string;
};

type SimpleDesignCreateData = {
  section: "cajas" | "envolturas" | "listones";
  nombre: string;
  preview_url: string;
  descripcion?: string;
};

export async function toggleDesignStatus(id: number, section: DesignSection, activeState: boolean) {
  try {
    if (section === "cajas") {
      const empaque = await prisma.empaque_disenos.findUnique({ where: { id } });
      if (empaque?.nombre.trim().toLowerCase() === "sin empaque") {
        revalidatePath("/admin/personalizacion");
        return { success: true };
      }
    }

    switch (section) {
      case "tarjetas":
        await prisma.tarjeta_disenos.update({ where: { id }, data: { activo: !activeState } });
        break;
      case "cajas":
        await prisma.empaque_disenos.update({ where: { id }, data: { activo: !activeState } });
        break;
      case "envolturas":
        await prisma.envoltura_disenos.update({ where: { id }, data: { activo: !activeState } });
        break;
      case "listones":
        await prisma.liston_disenos.update({ where: { id }, data: { activo: !activeState } });
        break;
    }

    revalidatePath("/admin/personalizacion");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar el diseño:", error);
    return { success: false, message: "Error al actualizar el diseñador." };
  }
}

export async function crearDesign(data: TarjetaCreateData | SimpleDesignCreateData) {
  try {
    switch (data.section) {
      case "tarjetas": {
        const exists = await prisma.tarjeta_disenos.findUnique({ where: { nombre: data.nombre } });
        if (exists) {
          return { success: false, message: "Ya existe una tarjeta con ese nombre." };
        }

        await prisma.tarjeta_disenos.create({
          data: {
            nombre: data.nombre,
            design_url: data.preview_url,
            color_acento: data.color_acento,
            color_suave: data.color_suave,
            color_marco: data.color_marco,
            color_mensaje: data.color_mensaje,
            ornamento: "none",
          },
        });
        break;
      }
      case "envolturas": {
        const exists = await prisma.envoltura_disenos.findUnique({ where: { nombre: data.nombre } });
        if (exists) {
          return { success: false, message: "Ya existe una envoltura con ese nombre." };
        }

        await prisma.envoltura_disenos.create({
          data: {
            nombre: data.nombre,
            preview_url: data.preview_url,
            descripcion: data.descripcion ?? "",
          },
        });
        break;
      }
      case "cajas": {
        const exists = await prisma.empaque_disenos.findUnique({ where: { nombre: data.nombre } });
        if (exists) {
          return { success: false, message: "Ya existe una caja con ese nombre." };
        }

        await prisma.empaque_disenos.create({
          data: {
            nombre: data.nombre,
            preview_url: data.preview_url,
            descripcion: data.descripcion ?? "",
          },
        });
        break;
      }
      case "listones": {
        const exists = await prisma.liston_disenos.findUnique({ where: { nombre: data.nombre } });
        if (exists) {
          return { success: false, message: "Ya existe un listón con ese nombre." };
        }

        await prisma.liston_disenos.create({
          data: {
            nombre: data.nombre,
            preview_url: data.preview_url,
            descripcion: data.descripcion ?? "",
          },
        });
        break;
      }
    }

    revalidatePath("/admin/personalizacion");
    return { success: true };
  } catch (error) {
    console.error("Error al crear el diseño:", error);
    return { success: false, message: "Error al crear el diseño en la base de datos." };
  }
}

export async function crearFechaEspecial(data: { fecha: string; titulo?: string; designIds?: number[] }) {
  try {
    const fecha = new Date(data.fecha);
    await prisma.$transaction(async (tx) => {
      await tx.personalizacion_fechas.create({
        data: {
          fecha,
          titulo: data.titulo?.trim() || "Fecha especial",
          design_ids: data.designIds ?? [],
        },
      });
      await sincronizarEstadoDisenos(tx, data.designIds ?? []);
    });

    revalidatePath("/admin/personalizacion");
    return { success: true };
  } catch (error) {
    console.error("Error al crear fecha especial:", error);
    return { success: false, message: "Error al crear la fecha especial." };
  }
}

export async function actualizarFechaEspecial(
  id: number,
  data: { fecha: string; titulo?: string; designIds?: number[] },
) {
  try {
    const fecha = new Date(data.fecha);
    await prisma.$transaction(async (tx) => {
      await tx.personalizacion_fechas.update({
        where: { id },
        data: {
          fecha,
          titulo: data.titulo?.trim() || "Fecha especial",
          design_ids: data.designIds ?? [],
        },
      });
      await sincronizarEstadoDisenos(tx, data.designIds ?? []);
    });

    revalidatePath("/admin/personalizacion");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar fecha especial:", error);
    return { success: false, message: "Error al actualizar la fecha especial." };
  }
}

export async function toggleFechaEspecialStatus(id: number, activeState: boolean) {
  try {
    await prisma.personalizacion_fechas.update({ where: { id }, data: { activo: !activeState } });
    revalidatePath("/admin/personalizacion");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar estado de fecha especial:", error);
    return { success: false, message: "Error al actualizar la fecha especial." };
  }
}

export async function eliminarFechaEspecial(id: number) {
  try {
    await prisma.personalizacion_fechas.delete({ where: { id } });
    revalidatePath("/admin/personalizacion");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar fecha especial:", error);
    return { success: false, message: "Error al eliminar la fecha especial." };
  }
}
