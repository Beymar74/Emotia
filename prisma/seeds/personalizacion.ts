import { PrismaClient } from '../../src/generated/prisma/client'


const DISENOS_TARJETA = [
    {
        nombre: 'Elegante',
        design_url: 'https://res.cloudinary.com/dcq7xfyyn/image/upload/v1777322450/emotia3_bmutfx.png',
        color_acento: '#A53E6C',
        color_suave: '#FFF3F7',
        color_marco: '#D46A92',
        color_mensaje: '#000000',
        ornamento: 'none',
    },
    {
        nombre: 'Clásico',
        design_url: 'https://res.cloudinary.com/dcq7xfyyn/image/upload/v1777323057/emotia2_cpkpzc.png',
        color_acento: '#5F4636',
        color_suave: '#FFF8F0',
        color_marco: '#C8A47C',
        color_mensaje: '#000000',
        ornamento: 'none',
    },
    {
        nombre: 'Infantil',
        design_url: 'https://res.cloudinary.com/dcq7xfyyn/image/upload/v1777323056/emotia1_wxoby0.png',
        color_acento: '#D94A6A',
        color_suave: '#FFF6F8',
        color_marco: '#FFB34D',
        color_mensaje: '#000000',
        ornamento: 'none',
    },
]

const MENSAJES_EJEMPLO = [
    'Para ti, con mucho cariño y un detalle pensado especialmente para este momento.',
    '¡Feliz cumpleaños! Que este día esté lleno de alegría y sorpresas.',
    'Gracias por ser tan especial. Este detalle es para recordarte cuánto te quiero.',
    'Con todo mi amor, espero que este regalo te saque una sonrisa.',
    'Para alguien increíble. ¡Disfruta tu día!',
    'Un pequeño detalle con un gran significado. Te quiero mucho.',
    '¡Felicidades! Mereces lo mejor y mucho más.',
    'Este regalo lleva un poquito de mi corazón. Espero que te guste.',
]

export async function seedPersonalizacion(prisma: PrismaClient) {
    // ── 1. Seedear tarjeta_disenos ──
    for (const diseno of DISENOS_TARJETA) {
        await prisma.tarjeta_disenos.upsert({
            where: { nombre: diseno.nombre },
            update: diseno,
            create: diseno,
        })
    }

    // ── 2. Seedear personalizaciones ──
    const carritos = await prisma.carrito.findMany({
        select: { id: true },
        orderBy: { id: 'asc' },
    })

    const detalles = await prisma.detalle_pedidos.findMany({
        select: { id: true },
        orderBy: { id: 'asc' },
    })

    const nombres = DISENOS_TARJETA.map((d) => d.nombre)

    const personalizacionesData: Array<{
        carrito_id?: number
        detalle_pedido_id?: number
        tipo_tarjeta: string
        mensaje: string
    }> = []

    // Personalizar cada item del carrito
    for (let i = 0; i < carritos.length; i++) {
        personalizacionesData.push({
            carrito_id: carritos[i].id,
            tipo_tarjeta: nombres[i % nombres.length],
            mensaje: MENSAJES_EJEMPLO[i % MENSAJES_EJEMPLO.length],
        })
    }

    // Personalizar ~40% de los detalles de pedido
    for (let i = 0; i < detalles.length; i++) {
        if (Math.random() > 0.4) continue

        personalizacionesData.push({
            detalle_pedido_id: detalles[i].id,
            tipo_tarjeta: nombres[i % nombres.length],
            mensaje: MENSAJES_EJEMPLO[i % MENSAJES_EJEMPLO.length],
        })
    }

    if (personalizacionesData.length > 0) {
        await prisma.personalizaciones.createMany({
            skipDuplicates: true,
            data: personalizacionesData,
        })
    }
}
