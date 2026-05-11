"use server";

import prisma from "@/lib/prisma";
import { requireProveedor } from "@/lib/auth-proveedor";
import { revalidatePath } from "next/cache";

export interface DatosProductoProveedor {
  id?: number;
  nombre: string;
  descripcion: string;
  categoriaId: number | null;
  precioBase: string;
  precioVenta: string;
  stock: string;
  imagenUrl: string | null;
  ocasiones: string[];
  personalidades: string[];
  generoDestinatario: string;
  edadMin: string;
  edadMax: string;
  permiteMensaje: boolean;
  permiteEmpaque: boolean;
  activo: boolean;
}

export async function obtenerCategoriasProductos() {
  const categorias = await prisma.categorias.findMany({
    orderBy: {
      nombre: "asc",
    },
    select: {
      id: true,
      nombre: true,
      activo: true,
    },
  });

  return categorias
    .filter((categoria) => categoria.activo !== false)
    .map((categoria) => ({
      id: categoria.id,
      nombre: categoria.nombre,
    }));
}

export async function obtenerProductosProveedor() {
  const proveedor = await requireProveedor();

  const productos = await prisma.productos.findMany({
    where: {
      proveedor_id: proveedor.id,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      categorias: {
        select: {
          id: true,
          nombre: true,
        },
      },
    },
  });

  return productos.map((producto) => ({
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion || "",
    categoriaId: producto.categoria_id,
    categoria: producto.categorias?.nombre || "Sin categoría",
    precioBase: producto.precio_base.toString(),
    precioVenta: producto.precio_venta.toString(),
    stock: producto.stock,
    imagenUrl: producto.imagen_url,
    ocasiones: producto.ocasiones || [],
    personalidades: producto.personalidades || [],
    generoDestinatario: producto.genero_destinatario || "cualquiera",
    edadMin: producto.edad_min?.toString() || "",
    edadMax: producto.edad_max?.toString() || "",
    permiteMensaje: producto.permite_mensaje,
    permiteEmpaque: producto.permite_empaque,
    activo: producto.activo,
  }));
}

function validarProducto(datos: DatosProductoProveedor) {
  const nombre = datos.nombre.trim();
  const descripcion = datos.descripcion.trim();

  const precioBase = Number(datos.precioBase);
  const precioVenta = Number(datos.precioVenta);
  const stock = Number(datos.stock);

  const edadMin = datos.edadMin ? Number(datos.edadMin) : null;
  const edadMax = datos.edadMax ? Number(datos.edadMax) : null;

  if (!nombre) {
    return { error: "El nombre del producto es obligatorio." };
  }

  if (!datos.categoriaId) {
    return { error: "Selecciona una categoría." };
  }

  if (Number.isNaN(precioBase) || precioBase < 0) {
    return { error: "El precio base no es válido." };
  }

  if (Number.isNaN(precioVenta) || precioVenta <= 0) {
    return { error: "El precio de venta debe ser mayor a 0." };
  }

  if (Number.isNaN(stock) || stock < 0) {
    return { error: "El stock no es válido." };
  }

  if (edadMin !== null && (Number.isNaN(edadMin) || edadMin < 0)) {
    return { error: "La edad mínima no es válida." };
  }

  if (edadMax !== null && (Number.isNaN(edadMax) || edadMax < 0)) {
    return { error: "La edad máxima no es válida." };
  }

  if (edadMin !== null && edadMax !== null && edadMin > edadMax) {
    return { error: "La edad mínima no puede ser mayor que la edad máxima." };
  }

  return {
    nombre,
    descripcion,
    precioBase,
    precioVenta,
    stock,
    edadMin,
    edadMax,
  };
}

export async function crearProductoProveedor(datos: DatosProductoProveedor) {
  try {
    const proveedor = await requireProveedor();
    const validacion = validarProducto(datos);

    if ("error" in validacion) {
      return {
        success: false,
        error: validacion.error,
      };
    }

    const producto = await prisma.productos.create({
      data: {
        proveedor_id: proveedor.id,
        categoria_id: datos.categoriaId,
        nombre: validacion.nombre,
        descripcion: validacion.descripcion || null,
        precio_base: validacion.precioBase,
        precio_venta: validacion.precioVenta,
        stock: validacion.stock,
        imagen_url: datos.imagenUrl || null,
        ocasiones: datos.ocasiones || [],
        personalidades: datos.personalidades || [],
        genero_destinatario: datos.generoDestinatario || "cualquiera",
        edad_min: validacion.edadMin,
        edad_max: validacion.edadMax,
        permite_mensaje: datos.permiteMensaje,
        permite_empaque: datos.permiteEmpaque,
        activo: datos.activo,
      },
    });

    revalidatePath("/business/proveedores/productos");

    return {
      success: true,
      id: producto.id,
    };
  } catch (error) {
    console.error("Error creando producto:", error);

    return {
      success: false,
      error: "No se pudo crear el producto.",
    };
  }
}

export async function actualizarProductoProveedor(datos: DatosProductoProveedor) {
  try {
    const proveedor = await requireProveedor();

    if (!datos.id) {
      return {
        success: false,
        error: "Producto no válido.",
      };
    }

    const productoExistente = await prisma.productos.findFirst({
      where: {
        id: datos.id,
        proveedor_id: proveedor.id,
      },
    });

    if (!productoExistente) {
      return {
        success: false,
        error: "No tienes permiso para editar este producto.",
      };
    }

    const validacion = validarProducto(datos);

    if ("error" in validacion) {
      return {
        success: false,
        error: validacion.error,
      };
    }

    await prisma.productos.update({
      where: {
        id: datos.id,
      },
      data: {
        categoria_id: datos.categoriaId,
        nombre: validacion.nombre,
        descripcion: validacion.descripcion || null,
        precio_base: validacion.precioBase,
        precio_venta: validacion.precioVenta,
        stock: validacion.stock,
        imagen_url: datos.imagenUrl || null,
        ocasiones: datos.ocasiones || [],
        personalidades: datos.personalidades || [],
        genero_destinatario: datos.generoDestinatario || "cualquiera",
        edad_min: validacion.edadMin,
        edad_max: validacion.edadMax,
        permite_mensaje: datos.permiteMensaje,
        permite_empaque: datos.permiteEmpaque,
        activo: datos.activo,
      },
    });

    revalidatePath("/business/proveedores/productos");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error actualizando producto:", error);

    return {
      success: false,
      error: "No se pudo actualizar el producto.",
    };
  }
}

export async function cambiarEstadoProductoProveedor(idProducto: number) {
  try {
    const proveedor = await requireProveedor();

    const producto = await prisma.productos.findFirst({
      where: {
        id: idProducto,
        proveedor_id: proveedor.id,
      },
    });

    if (!producto) {
      return {
        success: false,
        error: "No tienes permiso para modificar este producto.",
      };
    }

    await prisma.productos.update({
      where: {
        id: idProducto,
      },
      data: {
        activo: !producto.activo,
      },
    });

    revalidatePath("/business/proveedores/productos");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error cambiando estado producto:", error);

    return {
      success: false,
      error: "No se pudo cambiar el estado del producto.",
    };
  }
}

export async function eliminarProductoProveedor(idProducto: number) {
  try {
    const proveedor = await requireProveedor();

    const producto = await prisma.productos.findFirst({
      where: {
        id: idProducto,
        proveedor_id: proveedor.id,
      },
    });

    if (!producto) {
      return {
        success: false,
        error: "No tienes permiso para eliminar este producto.",
      };
    }

    await prisma.productos.delete({
      where: {
        id: idProducto,
      },
    });

    revalidatePath("/business/proveedores/productos");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error eliminando producto:", error);

    return {
      success: false,
      error:
        "No se pudo eliminar el producto. Puede que ya tenga pedidos asociados.",
    };
  }
}