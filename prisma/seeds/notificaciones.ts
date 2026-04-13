import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedNotificaciones(prisma: PrismaClient) {
    const usuarios = await prisma.usuarios.findMany()

    const beymar = usuarios.find((u: any) => u.email === 'beymar@test.com')!
    const evelyn = usuarios.find((u: any) => u.email === 'evelyn@test.com')!
    const einard = usuarios.find((u: any) => u.email === 'einard@test.com')!
    const mauricio = usuarios.find((u: any) => u.email === 'mauricio@test.com')!

    await prisma.notificaciones.createMany({
        skipDuplicates: true,
        data: [
            {
                usuario_id: beymar.id,
                tipo: 'pedido',
                titulo: '¡Tu pedido fue entregado!',
                mensaje: 'El collar de plata artesanal llegó a tu dirección. ¿Cómo estuvo tu experiencia?',
                leida: true,
            },
            {
                usuario_id: beymar.id,
                tipo: 'recordatorio',
                titulo: 'Recordatorio: Cumpleaños de mamá en 7 días',
                mensaje: '¡No olvides buscar el regalo perfecto en Emotia!',
                leida: false,
            },
            {
                usuario_id: beymar.id,
                tipo: 'promo',
                titulo: '¡Tienes 150 puntos disponibles!',
                mensaje: 'Usa tus puntos en tu próxima compra y obtén un descuento especial.',
                leida: false,
            },
            {
                usuario_id: evelyn.id,
                tipo: 'pedido',
                titulo: 'Pedido confirmado',
                mensaje: 'Tu caja de chocolates artesanales está siendo preparada por el proveedor.',
                leida: true,
            },
            {
                usuario_id: evelyn.id,
                tipo: 'recordatorio',
                titulo: 'Día de la Madre en 10 días',
                mensaje: '¡Sorprende a mamá con algo especial! Tenemos opciones desde Bs. 40.',
                leida: false,
            },
            {
                usuario_id: einard.id,
                tipo: 'promo',
                titulo: 'Nueva categoría: Tecnología y Gadgets',
                mensaje: 'Explora los nuevos productos tecnológicos personalizables en Emotia.',
                leida: false,
            },
            {
                usuario_id: mauricio.id,
                tipo: 'pedido',
                titulo: 'Tu pedido está en preparación',
                mensaje: 'Los audífonos personalizados están siendo preparados. Tiempo estimado: 2 días.',
                leida: true,
            },
            {
                usuario_id: mauricio.id,
                tipo: 'promo',
                titulo: '¡Insignia desbloqueada! Cliente VIP 🏆',
                mensaje: 'Superaste los 300 puntos. Ahora tienes acceso a ofertas exclusivas.',
                leida: false,
            },
        ],
    })
}
