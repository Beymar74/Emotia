import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedDetallePedidos(prisma: PrismaClient) {

    const pedidos = await prisma.pedidos.findMany()
    const productos = await prisma.productos.findMany()
    const proveedores = await prisma.proveedores.findMany()

    const findProducto = (nombre: string) => {
        const producto = productos.find((p: any) => p.nombre === nombre)
        if (!producto) throw new Error(`Producto no encontrado en seedDetallePedidos: ${nombre}`)
        return producto
    }

    const findProveedor = (nombre: string) => {
        const proveedor = proveedores.find((p: any) => p.nombre_negocio === nombre)
        if (!proveedor) throw new Error(`Proveedor no encontrado en seedDetallePedidos: ${nombre}`)
        return proveedor
    }

    const cadena = findProducto('Juego de cadena de aleación-BM23')
    const bouquetMama = findProducto('MINI BOUQUET GRACIAS MAMA')
    const auriculares = findProducto('Auriculares plegables')
    const rosas = findProducto('Ramo de 6 rosas')

    const miniso = findProveedor('Miniso Bolivia')
    const missFlores = findProveedor('Miss Flores')

    await prisma.$executeRaw`
        INSERT INTO detalle_pedidos 
            (pedido_id, producto_id, proveedor_id, cantidad, precio_unitario, subtotal, mensaje_personal, empaque_especial, calificacion, resena)
        VALUES
            (${pedidos[0].id}, ${cadena.id}, ${miniso.id}, 1, 143.00, 143.00, 'Feliz cumpleaños amor ❤️', true, 5, 'Hermoso detalle, llegó perfecto y bien empaquetado'),
            (${pedidos[1].id}, ${bouquetMama.id}, ${missFlores.id}, 1, 220.00, 220.00, 'Para mi mamá con todo mi amor', true, null, null),
            (${pedidos[2].id}, ${auriculares.id}, ${miniso.id}, 1, 143.00, 143.00, null, true, null, null),
            (${pedidos[3].id}, ${rosas.id}, ${missFlores.id}, 1, 115.00, 115.00, 'Te quiero mucho', false, null, null)
    `
}
