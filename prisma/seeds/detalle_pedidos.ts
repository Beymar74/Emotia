import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedDetallePedidos(prisma: PrismaClient) {

    const pedidos = await prisma.pedidos.findMany()
    const productos = await prisma.productos.findMany()
    const proveedores = await prisma.proveedores.findMany()

    const collar = productos.find((p: any) => p.nombre === 'Collar de plata artesanal')!
    const chocolates = productos.find((p: any) => p.nombre === 'Caja de chocolates artesanales')!
    const audifonos = productos.find((p: any) => p.nombre === 'Audífonos personalizados')!
    const rosas = productos.find((p: any) => p.nombre === 'Ramo de rosas rojas')!

    const artesanias = proveedores.find((p: any) => p.nombre_negocio === 'Artesanías Mamani')!
    const chocoProv = proveedores.find((p: any) => p.nombre_negocio === 'Chocolates Quispe')!
    const tech = proveedores.find((p: any) => p.nombre_negocio === 'TechGadgets Bolivia')!
    const flores = proveedores.find((p: any) => p.nombre_negocio === 'Flores Copacabana')!

    await prisma.$executeRaw`
        INSERT INTO detalle_pedidos 
            (pedido_id, producto_id, proveedor_id, cantidad, precio_unitario, subtotal, mensaje_personal, empaque_especial, calificacion, resena)
        VALUES
            (${pedidos[0].id}, ${collar.id}, ${artesanias.id}, 1, 144.00, 144.00, 'Feliz cumpleaños amor ❤️', true, 5, 'Hermoso collar, llegó perfecto y bien empaquetado'),
            (${pedidos[1].id}, ${chocolates.id}, ${chocoProv.id}, 1, 96.00, 96.00, 'Para mi mamá con todo mi amor', true, null, null),
            (${pedidos[2].id}, ${audifonos.id}, ${tech.id}, 1, 240.00, 240.00, null, true, null, null),
            (${pedidos[3].id}, ${rosas.id}, ${flores.id}, 1, 72.00, 72.00, 'Te quiero mucho', false, null, null)
    `
}