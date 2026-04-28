import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stackServerApp } from "@/lib/stack";
import type { CatalogOrder } from "@/lib/catalog-order-status";

type CheckoutItemInput = {
  id: number;
  quantity: number;
};

const DELIVERY_ZONES = {
  centro: { label: "Centro", shippingCost: 0 },
  "zona-sur": { label: "Zona Sur", shippingCost: 8 },
  miraflores: { label: "Miraflores / Sopocachi", shippingCost: 5 },
} as const;

const PAYMENT_METHODS = {
  qr: "qr",
  tarjeta: "tarjeta_debito",
  transferencia: "transferencia_bancaria",
} as const;

function getFallbackName(email: string) {
  return email.split("@")[0]?.trim() || "Usuario";
}

async function getAuthenticatedUser() {
  const currentUser = await stackServerApp.getUser({ or: "return-null" });
  if (!currentUser?.primaryEmail) {
    return null;
  }

  const email = currentUser.primaryEmail;
  const displayName = currentUser.displayName?.trim() || getFallbackName(email);

  const usuario = await prisma.usuarios.upsert({
    where: { email },
    update: {
      updated_at: new Date(),
    },
    create: {
      nombre: displayName,
      email,
      tipo: "usuario",
      plan: "basico",
      puntos: 0,
      activo: true,
    },
    select: {
      id: true,
      email: true,
    },
  });

  return usuario;
}

function mapOrder(order: {
  id: number;
  estado: string;
  total: { toString(): string } | number;
  created_at: Date;
  detalle_pedidos: Array<{
    cantidad: number;
    productos: {
      id: number;
      nombre: string;
      imagen_url: string | null;
    };
    proveedores: {
      nombre_negocio: string;
      logo_url: string | null;
    };
  }>;
}): CatalogOrder {
  const firstItem = order.detalle_pedidos[0];

  return {
    id: order.id,
    estado: order.estado,
    total: Number(order.total),
    createdAt: order.created_at.toISOString(),
    itemCount: order.detalle_pedidos.reduce((acc, item) => acc + item.cantidad, 0),
    primaryProductName: firstItem?.productos.nombre ?? "Pedido Emotia",
    productImageUrl: firstItem?.productos.imagen_url ?? null,
    brandName: firstItem?.proveedores.nombre_negocio ?? "Emotia Store",
    brandLogoUrl: firstItem?.proveedores.logo_url ?? null,
    items: order.detalle_pedidos.map((item) => ({
      id: item.productos.id,
      name: item.productos.nombre,
      quantity: item.cantidad,
      imageUrl: item.productos.imagen_url ?? null,
    })),
  };
}

export async function GET() {
  try {
    const usuario = await getAuthenticatedUser();
    if (!usuario) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const orders = await prisma.pedidos.findMany({
      where: { usuario_id: usuario.id },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        estado: true,
        total: true,
        created_at: true,
        detalle_pedidos: {
          select: {
            cantidad: true,
            productos: {
              select: {
                id: true,
                nombre: true,
                imagen_url: true,
              },
            },
            proveedores: {
              select: {
                nombre_negocio: true,
                logo_url: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      authenticated: true,
      orders: orders.map(mapOrder),
    });
  } catch (error) {
    console.error("Error al obtener los pedidos del catalogo:", error);
    return NextResponse.json({ error: "No pudimos cargar tus pedidos." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const usuario = await getAuthenticatedUser();
    if (!usuario) {
      return NextResponse.json({ error: "Necesitas iniciar sesion para registrar un pedido." }, { status: 401 });
    }

    const body = (await req.json()) as {
      items?: CheckoutItemInput[];
      zonaEntrega?: keyof typeof DELIVERY_ZONES;
      direccion?: string;
      destinatario?: string;
      telefono?: string;
      referencia?: string;
      metodoPago?: keyof typeof PAYMENT_METHODS;
    };

    const rawItems = Array.isArray(body.items) ? body.items : [];
    const items = rawItems
      .map((item) => ({
        id: Number(item.id),
        quantity: Number(item.quantity),
      }))
      .filter((item) => Number.isInteger(item.id) && item.id > 0 && Number.isInteger(item.quantity) && item.quantity > 0);

    const zonaEntrega = body.zonaEntrega && body.zonaEntrega in DELIVERY_ZONES ? body.zonaEntrega : null;
    const metodoPago = body.metodoPago && body.metodoPago in PAYMENT_METHODS ? body.metodoPago : null;
    const direccion = body.direccion?.trim() || "";
    const destinatario = body.destinatario?.trim() || "";
    const telefono = body.telefono?.trim() || "";
    const referencia = body.referencia?.trim() || "";

    if (!items.length) {
      return NextResponse.json({ error: "Tu carrito esta vacio." }, { status: 400 });
    }

    if (!zonaEntrega || !metodoPago || direccion.length < 7 || !destinatario || !telefono) {
      return NextResponse.json({ error: "Completa los datos de entrega y pago." }, { status: 400 });
    }

    const productos = await prisma.productos.findMany({
      where: {
        id: { in: items.map((item) => item.id) },
        activo: true,
      },
      select: {
        id: true,
        proveedor_id: true,
        nombre: true,
        precio_venta: true,
        stock: true,
      },
    });

    if (productos.length !== items.length) {
      return NextResponse.json({ error: "Uno o mas productos ya no estan disponibles." }, { status: 400 });
    }

    const productsById = new Map(productos.map((product) => [product.id, product]));

    for (const item of items) {
      const product = productsById.get(item.id);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { error: `No hay stock suficiente para ${product?.nombre ?? "uno de los productos"}.` },
          { status: 400 },
        );
      }
    }

    const shippingCost = DELIVERY_ZONES[zonaEntrega].shippingCost;
    const subtotal = items.reduce((sum, item) => {
      const product = productsById.get(item.id)!;
      return sum + Number(product.precio_venta) * item.quantity;
    }, 0);
    const total = subtotal + shippingCost;
    const notas = [
      `Destinatario: ${destinatario}`,
      `Telefono: ${telefono}`,
      referencia ? `Referencia: ${referencia}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const createdOrder = await prisma.$transaction(async (tx) => {
      const createdAddress = await tx.direcciones.create({
        data: {
          usuario_id: usuario.id,
          calle: direccion,
          zona: DELIVERY_ZONES[zonaEntrega].label,
          referencia: referencia || null,
          ciudad: "La Paz",
          es_principal: false,
        },
        select: {
          id: true,
        },
      });

      const pedido = await tx.pedidos.create({
        data: {
          usuario_id: usuario.id,
          direccion_id: createdAddress.id,
          estado: "pendiente",
          subtotal,
          costo_envio: shippingCost,
          descuento_puntos: 0,
          total,
          puntos_usados: 0,
          puntos_ganados: Math.max(0, Math.round(total / 10)),
          metodo_pago: PAYMENT_METHODS[metodoPago],
          referencia_pago: `WEB-${Date.now()}`,
          notas,
        },
        select: {
          id: true,
        },
      });

      await tx.detalle_pedidos.createMany({
        data: items.map((item) => {
          const product = productsById.get(item.id)!;
          const unitPrice = Number(product.precio_venta);

          return {
            pedido_id: pedido.id,
            producto_id: product.id,
            proveedor_id: product.proveedor_id,
            cantidad: item.quantity,
            precio_unitario: unitPrice,
            subtotal: unitPrice * item.quantity,
          };
        }),
      });

      await Promise.all(
        items.map((item) => {
          const product = productsById.get(item.id)!;
          return tx.productos.update({
            where: { id: product.id },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }),
      );

      await tx.notificaciones.create({
        data: {
          usuario_id: usuario.id,
          tipo: "pedido",
          titulo: "Pedido registrado",
          mensaje: `Recibimos tu pedido EM-${String(pedido.id).padStart(4, "0")} y la marca lo revisara pronto.`,
          leida: false,
        },
      });

      return pedido;
    });

    return NextResponse.json({
      ok: true,
      orderId: createdOrder.id,
      orderCode: `EM-${String(createdOrder.id).padStart(4, "0")}`,
    });
  } catch (error) {
    console.error("Error al registrar el pedido del catalogo:", error);
    return NextResponse.json({ error: "No pudimos registrar tu pedido." }, { status: 500 });
  }
}
