import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedPedidos(prisma: PrismaClient) {

    const usuarios = await prisma.usuarios.findMany()
    const direcciones = await prisma.direcciones.findMany()

    const estados = ['pendiente', 'en_preparacion', 'en_camino', 'entregado', 'cancelado']
    const metodos_pago = ['tarjeta', 'qr', 'efectivo', 'transferencia']

    const pedidosData = []

    for (let i = 0; i < 200; i++) {
        const usuario = usuarios[Math.floor(Math.random() * usuarios.length)]
        const dirUsuario = direcciones.find(d => d.usuario_id === usuario.id)
        if (!dirUsuario) continue

        const estado = estados[Math.floor(Math.random() * estados.length)]
        const subtotal = Math.floor(Math.random() * 500) + 50
        const costo_envio = Math.floor(Math.random() * 20) + 10
        const total = subtotal + costo_envio
        
        // Generar fecha en los últimos 60 días
        const created_at = new Date()
        created_at.setDate(created_at.getDate() - Math.floor(Math.random() * 60))

        pedidosData.push({
            usuario_id: usuario.id,
            direccion_id: dirUsuario.id,
            estado: estado,
            subtotal: subtotal,
            costo_envio: costo_envio,
            descuento_puntos: 0.00,
            total: total,
            puntos_usados: 0,
            puntos_ganados: Math.floor(total * 0.1),
            metodo_pago: metodos_pago[Math.floor(Math.random() * metodos_pago.length)],
            referencia_pago: `TXN_${Math.random().toString(36).substring(7).toUpperCase()}`,
            created_at: created_at,
            updated_at: created_at,
        })
    }

    // Asegurar que haya muchos entregados para los gráficos (100 más)
    for (let i = 0; i < 100; i++) {
        const usuario = usuarios[Math.floor(Math.random() * usuarios.length)]
        const dirUsuario = direcciones.find(d => d.usuario_id === usuario.id)
        if (!dirUsuario) continue

        const subtotal = Math.floor(Math.random() * 800) + 100
        const costo_envio = Math.floor(Math.random() * 20) + 10
        const total = subtotal + costo_envio
        
        const created_at = new Date()
        created_at.setDate(created_at.getDate() - Math.floor(Math.random() * 60))

        pedidosData.push({
            usuario_id: usuario.id,
            direccion_id: dirUsuario.id,
            estado: 'entregado',
            subtotal: subtotal,
            costo_envio: costo_envio,
            descuento_puntos: 0.00,
            total: total,
            puntos_usados: 0,
            puntos_ganados: Math.floor(total * 0.1),
            metodo_pago: metodos_pago[Math.floor(Math.random() * metodos_pago.length)],
            referencia_pago: `TXN_${Math.random().toString(36).substring(7).toUpperCase()}`,
            created_at: created_at,
            updated_at: created_at,
        })
    }

    await prisma.pedidos.createMany({
        skipDuplicates: true,
        data: pedidosData,
    })
}
