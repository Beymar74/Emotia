import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedCarrito(prisma: PrismaClient) {

    const usuarios = await prisma.usuarios.findMany()
    const productos = await prisma.productos.findMany()

    const einard = usuarios.find((u: any) => u.email === 'einard@test.com')!
    const maria = usuarios.find((u: any) => u.email === 'maria.quispe@test.com')!

    const pulsera = productos.find((p: any) => p.nombre === 'Pulsera tejida con nombre')!
    const taza = productos.find((p: any) => p.nombre === 'Taza con foto personalizada')!
    const cactus = productos.find((p: any) => p.nombre === 'Cactus decorativo')!
    const torta = productos.find((p: any) => p.nombre === 'Torta personalizada')!

    // subtotal es columna GENERATED en Postgres, no se puede insertar manualmente
    await prisma.$executeRaw`
        INSERT INTO carrito
            (usuario_id, producto_id, cantidad, mensaje_personal, empaque_especial, precio_unitario)
        VALUES
            (${einard.id}, ${pulsera.id}, 1, 'Para mi hermana', true, 54.00),
            (${einard.id}, ${taza.id}, 2, 'Recuerdo especial', false, 48.00),
            (${maria.id}, ${cactus.id}, 1, null, true, 42.00),
            (${maria.id}, ${torta.id}, 1, 'Feliz cumple papá', false, 180.00)
        ON CONFLICT (usuario_id, producto_id) DO NOTHING
    `
}