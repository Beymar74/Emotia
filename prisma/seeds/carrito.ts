import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedCarrito(prisma: PrismaClient) {

    const usuarios = await prisma.usuarios.findMany()
    const productos = await prisma.productos.findMany()

    const einard = usuarios.find((u: any) => u.email === 'einard@test.com')!
    const maria = usuarios.find((u: any) => u.email === 'maria.quispe@test.com')!

    const findProducto = (nombre: string) => {
        const producto = productos.find((p: any) => p.nombre === nombre)
        if (!producto) throw new Error(`Producto no encontrado en seedCarrito: ${nombre}`)
        return producto
    }

    const llaveroCorazon = findProducto('Llavero con espejo en forma de corazón de la colección MIKKO')
    const espejoBarbie = findProducto('Espejo de mano de la colección Barbie')
    const maceta = findProducto('La Maceta Serenidad Clásica')
    const perfumeSurf = findProducto('Surf Secret Code 100 ml')

    await prisma.$executeRaw`
        INSERT INTO carrito
            (usuario_id, producto_id, cantidad, mensaje_personal, empaque_especial, precio_unitario, subtotal)
        VALUES
            (${einard.id}, ${llaveroCorazon.id}, 1, 'Para mi hermana', true, 47.00, 47.00),
            (${einard.id}, ${espejoBarbie.id}, 2, 'Recuerdo especial', false, 71.00, 142.00),
            (${maria.id}, ${maceta.id}, 1, null, true, 50.00, 50.00),
            (${maria.id}, ${perfumeSurf.id}, 1, 'Feliz cumple papá', false, 150.00, 150.00)
        ON CONFLICT (usuario_id, producto_id) DO NOTHING
    `
}
