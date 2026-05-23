"use server";

import prisma from "@/lib/prisma";
import { PrismaClient } from "@/generated/prisma/client";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function validarLogin(formData: FormData) {
  try {
    // =========================
    // OBTENER DATOS
    // =========================

    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    const password = String(
      formData.get("password") || ""
    ).trim();

    // =========================
    // VALIDACIONES
    // =========================

    if (!email || !password) {
      return {
        error:
          "Por favor completa todos los campos.",
      };
    }

    // =========================
    // BUSCAR PROVEEDOR
    // =========================

    const proveedor =
      await prisma.proveedores.findUnique({
        where: {
          email,
        },
      });

    if (!proveedor) {
      return {
        error:
          "Correo o contraseña incorrectos.",
      };
    }

    // =========================
    // VALIDAR PASSWORD
    // =========================

    const passwordCorrecta =
      await bcrypt.compare(
        password,
        proveedor.password_hash
      );

    if (!passwordCorrecta) {
      return {
        error:
          "Correo o contraseña incorrectos.",
      };
    }

    // =========================
    // VALIDAR ESTADO
    // =========================

    if (proveedor.estado === "pendiente") {
      return {
        error:
          "Tu cuenta aún está pendiente de aprobación. Te avisaremos cuando sea revisada.",
      };
    }

    if (proveedor.estado === "suspendido") {
      return {
        error:
          "Tu cuenta se encuentra suspendida. Contacta con soporte para más información.",
      };
    }

    if (proveedor.estado !== "aprobado") {
      return {
        error:
          "Tu cuenta no está habilitada para ingresar al panel Business.",
      };
    }

    const token = crypto.randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + 7
    );

    // =========================
    // GUARDAR SESIÓN EN DB
    // =========================

    const sesionesModel =
      (prisma as any)["proveedor_sesiones"];

    console.log(
      "delegate:",
      sesionesModel
    );

    await sesionesModel.create({
      data: {
        proveedor_id: proveedor.id,
        token,
        expires_at: expiresAt,
      },
    });

    // =========================
    // CREAR COOKIE
    // =========================

    const cookieStore = await cookies();

    cookieStore.set(
      "emotia_b2b_session",
      token,
      {
        path: "/",
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Error en login proveedor:",
      error
    );

    return {
      error:
        "Ocurrió un error del servidor.",
    };
  }
}