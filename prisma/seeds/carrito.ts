import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedCarrito(prisma: PrismaClient) {
    const usuarios = await prisma.usuarios.findMany()
    const productos = await prisma.productos.findMany()

    const einard = usuarios.find(u => u.email === 'einard@test.com')!
    const maria = usuarios.find(u => u.email === 'maria.quispe@test.com')!

    const pulsera = productos.find(p => p.nombre === 'Pulsera tejida con nombre')!
    const taza = productos.find(p => p.nombre === 'Taza con foto personalizada')!
    const cactus = productos.find(p => p.nombre === 'Cactus decorativo')!
    const torta = productos.find(p => p.nombre === 'Torta personalizada')!

    await prisma.carrito.createMany({
        skipDuplicates: true,
        data: [
            {
                usuario_id: einard.id,
                producto_id: pulsera.id,
                cantidad: 1,
                mensaje_personal: 'Para mi hermana',
                empaque_especial: true,
                precio_unitario: 54.00,
                subtotal: 54.00,
            },
            {
                usuario_id: einard.id,
                producto_id: taza.id,
                cantidad: 2,
                mensaje_personal: 'Recuerdo especial',
                empaque_especial: false,
                precio_unitario: 48.00,
                subtotal: 96.00,
            },
            {
                usuario_id: maria.id,
                producto_id: cactus.id,
                cantidad: 1,
                empaque_especial: true,
                precio_unitario: 42.00,
                subtotal: 42.00,
            },
            {
                usuario_id: maria.id,
                producto_id: torta.id,
                cantidad: 1,
                mensaje_personal: 'Feliz cumple papá',
                empaque_especial: false,
                precio_unitario: 180.00,
                subtotal: 180.00,
            },
        ],
    })
}
