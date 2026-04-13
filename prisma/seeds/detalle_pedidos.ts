import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedDetallePedidos(prisma: PrismaClient) {
    // Limpiar antes de insertar para evitar duplicados
    await prisma.detalle_pedidos.deleteMany()

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

    await prisma.detalle_pedidos.createMany({
        data: [
            {
                pedido_id: pedidos[0].id,
                producto_id: collar.id,
                proveedor_id: artesanias.id,
                cantidad: 1,
                precio_unitario: 144.00,
                subtotal: 144.00,
                mensaje_personal: 'Feliz cumpleaños amor ❤️',
                empaque_especial: true,
                calificacion: 5,
                resena: 'Hermoso collar, llegó perfecto y bien empaquetado',
            },
            {
                pedido_id: pedidos[1].id,
                producto_id: chocolates.id,
                proveedor_id: chocoProv.id,
                cantidad: 1,
                precio_unitario: 96.00,
                subtotal: 96.00,
                mensaje_personal: 'Para mi mamá con todo mi amor',
                empaque_especial: true,
            },
            {
                pedido_id: pedidos[2].id,
                producto_id: audifonos.id,
                proveedor_id: tech.id,
                cantidad: 1,
                precio_unitario: 240.00,
                subtotal: 240.00,
                empaque_especial: true,
            },
            {
                pedido_id: pedidos[3].id,
                producto_id: rosas.id,
                proveedor_id: flores.id,
                cantidad: 1,
                precio_unitario: 72.00,
                subtotal: 72.00,
                mensaje_personal: 'Te quiero mucho',
                empaque_especial: false,
            },
        ],
    })
}