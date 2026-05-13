"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export interface RedSocialRegistro {
  plataforma: string;
  url: string;
}

export interface DatosRegistro {
  nombreEmpresa: string;
  categorias: string[];
  ciudad: string;
  direccionNegocio: string;
  referenciaDireccion: string;
  redesSociales: RedSocialRegistro[];
  nombreRepresentante: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
  anioNacimiento: string;
  aceptaTerminos: boolean;
}

const CATEGORIAS_PERMITIDAS = [
  "artesanias",
  "joyeria",
  "floreria",
  "reposteria",
  "chocolateria",
  "decoracion",
  "papeleria_creativa",
  "textiles",
  "ceramica",
  "regalos_personalizados",
];

const PLATAFORMAS_PERMITIDAS = [
  "instagram",
  "tiktok",
  "facebook",
  "whatsapp",
  "web",
];

export async function registrarProveedorDB(datos: DatosRegistro) {
  try {
    const nombreEmpresa = datos.nombreEmpresa.trim();
    const categorias = Array.isArray(datos.categorias)
      ? datos.categorias
          .map((c) => c.trim())
          .filter((c) => CATEGORIAS_PERMITIDAS.includes(c))
      : [];

    const ciudad = datos.ciudad.trim();
    const direccionNegocio = datos.direccionNegocio.trim();
    const referenciaDireccion = datos.referenciaDireccion.trim();

    const redesSociales = Array.isArray(datos.redesSociales)
      ? datos.redesSociales
          .map((red) => ({
            plataforma: red.plataforma.trim(),
            url: red.url.trim(),
          }))
          .filter(
            (red) =>
              PLATAFORMAS_PERMITIDAS.includes(red.plataforma) &&
              red.url.length > 0
          )
      : [];

    const nombreRepresentante = datos.nombreRepresentante.trim();
    const email = datos.email.trim().toLowerCase();
    const telefono = datos.telefono.trim();
    const password = datos.password.trim();
    const confirmPassword = datos.confirmPassword.trim();
    const aceptaTerminos = datos.aceptaTerminos === true;
    const anioNacimiento = parseInt(datos.anioNacimiento);

    if (
      !nombreEmpresa ||
      categorias.length === 0 ||
      !ciudad ||
      !direccionNegocio ||
      !nombreRepresentante ||
      !email ||
      !telefono ||
      !password ||
      !confirmPassword
    ) {
      return {
        success: false,
        error: "Todos los campos obligatorios deben completarse.",
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "El correo electrónico no es válido.",
      };
    }

    const telefonoRegex = /^[67]\d{7}$/;

    if (!telefonoRegex.test(telefono)) {
      return {
        success: false,
        error: "El número debe tener 8 dígitos y comenzar con 6 o 7.",
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: "La contraseña debe tener al menos 8 caracteres.",
      };
    }
    if (password !== confirmPassword) {
      return {
        success: false,
        error: "Las contraseñas no coinciden.",
      };
    }

    if (!aceptaTerminos) {
      return {
        success: false,
        error: "Debes aceptar los términos y condiciones para continuar.",
      };
    }
    const anioActual = new Date().getFullYear();
    const edad = anioActual - anioNacimiento;

    if (
      isNaN(anioNacimiento) ||
      anioNacimiento < 1900 ||
      edad < 18 ||
      edad > 100
    ) {
      return {
        success: false,
        error: "Debes ingresar un año de nacimiento válido y ser mayor de edad.",
      };
    }

    const plataformasUnicas = new Set(redesSociales.map((r) => r.plataforma));

    if (plataformasUnicas.size !== redesSociales.length) {
      return {
        success: false,
        error: "No puedes repetir la misma plataforma en redes sociales.",
      };
    }

    const proveedorExistente = await prisma.proveedores.findUnique({
      where: {
        email,
      },
    });

    if (proveedorExistente) {
      return {
        success: false,
        error: "Ese correo ya está registrado.",
      };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const direccionCompleta = referenciaDireccion
      ? `${direccionNegocio}, ${ciudad}. Referencia: ${referenciaDireccion}`
      : `${direccionNegocio}, ${ciudad}`;

    const nuevoProveedor = await prisma.proveedores.create({
      data: {
        nombre_negocio: nombreEmpresa,

        descripcion: null,
        categorias,
        redes_sociales: redesSociales,

        email,
        password_hash: passwordHash,

        telefono,
        direccion: direccionCompleta,

        rep_nombre: nombreRepresentante,
        rep_email: email,
        rep_telefono: telefono,
        rep_anio_nacimiento: anioNacimiento,

        estado: "pendiente",
      },
    });

    return {
      success: true,
      id: nuevoProveedor.id,
      email: nuevoProveedor.email,
    };
  } catch (error) {
    console.error("Error al registrar proveedor:", error);

    return {
      success: false,
      error: "Ocurrió un error en el servidor. Intenta nuevamente.",
    };
  }
}
