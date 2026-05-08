import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedDetallePedidos(prisma: PrismaClient) {

    const pedidos = await prisma.pedidos.findMany()
    const productos = await prisma.productos.findMany()

    if (productos.length === 0 || pedidos.length === 0) return;

    const resenas_5_estrellas = ['¡Excelente producto!', 'Llegó a tiempo y muy bonito.', 'A mi pareja le encantó, 10/10.', 'Muy buena calidad, superó mis expectativas.', 'Totalmente recomendado, volveré a pedir.', 'Hermoso detalle, muy cuidadosos con el empaque.', 'El empaque estaba precioso y el producto impecable.', 'Fascinada con la compra.'];
    const resenas_4_estrellas = ['Buen producto, me gustó.', 'Todo muy bien, aunque llegó un poquito tarde.', 'Bonito, igual a la foto.', 'Me parece muy buen regalo.', 'Buen material y buen servicio.'];
    const resenas_3_estrellas = ['Buen producto, pero tardó bastante en llegar.', 'Es bonito pero me imaginaba otra cosa por las fotos.', 'Está bien para el precio.', 'Aceptable, aunque el empaque venía un poco maltratado.'];
    const resenas_1_2_estrellas = ['Pésima experiencia, llegó roto.', 'No era lo que pedí, muy decepcionado.', 'La calidad deja mucho que desear.', 'El envío fue un desastre y no responden los mensajes.'];

    const detallesData = []

    for (const pedido of pedidos) {
        const numItems = Math.floor(Math.random() * 3) + 1
        
        let subtotalPedido = 0;

        for (let i = 0; i < numItems; i++) {
            const producto = productos[Math.floor(Math.random() * productos.length)]
            const cantidad = Math.floor(Math.random() * 2) + 1
            const precio = Number(producto.precio_venta)
            const subtotal = precio * cantidad

            let calificacion = null
            let resena = null

            // 85% chance to have a review if delivered
            if (pedido.estado === 'entregado' && Math.random() > 0.15) {
                const rand = Math.random()
                if (rand < 0.6) {
                    calificacion = 5
                    resena = resenas_5_estrellas[Math.floor(Math.random() * resenas_5_estrellas.length)]
                } else if (rand < 0.8) {
                    calificacion = 4
                    resena = resenas_4_estrellas[Math.floor(Math.random() * resenas_4_estrellas.length)]
                } else if (rand < 0.95) {
                    calificacion = 3
                    resena = resenas_3_estrellas[Math.floor(Math.random() * resenas_3_estrellas.length)]
                } else {
                    calificacion = Math.floor(Math.random() * 2) + 1 // 1 o 2 estrellas
                    resena = resenas_1_2_estrellas[Math.floor(Math.random() * resenas_1_2_estrellas.length)]
                }
            }

            detallesData.push({
                pedido_id: pedido.id,
                producto_id: producto.id,
                proveedor_id: producto.proveedor_id,
                cantidad: cantidad,
                precio_unitario: precio,
                subtotal: subtotal,
                mensaje_personal: Math.random() > 0.5 ? 'Con mucho amor ❤️' : null,
                empaque_especial: Math.random() > 0.5,
                calificacion: calificacion,
                resena: resena,
                created_at: pedido.created_at
            })
            
            subtotalPedido += subtotal;
        }
    }

    await prisma.detalle_pedidos.createMany({
        skipDuplicates: true,
        data: detallesData,
    })
}
