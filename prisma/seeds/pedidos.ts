import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedPedidos(prisma: PrismaClient) {

    const usuarios = await prisma.usuarios.findMany()
    const direcciones = await prisma.direcciones.findMany()

    const beymar = usuarios.find((u: any) => u.email === 'beymar@test.com')!
    const evelyn = usuarios.find((u: any) => u.email === 'evelyn@test.com')!
    const mauricio = usuarios.find((u: any) => u.email === 'mauricio@test.com')!

    const dirBeymar = direcciones.find((d: any) => d.usuario_id === beymar.id)!
    const dirEvelyn = direcciones.find((d: any) => d.usuario_id === evelyn.id)!
    const dirMauricio = direcciones.find((d: any) => d.usuario_id === mauricio.id)!

    await prisma.pedidos.createMany({
        skipDuplicates: true,
        data: [
            {
                usuario_id: beymar.id,
                direccion_id: dirBeymar.id,
                estado: 'entregado',
                subtotal: 143.00,
                costo_envio: 15.00,
                descuento_puntos: 0.00,
                total: 158.00,
                puntos_usados: 0,
                puntos_ganados: 15,
                metodo_pago: 'tarjeta',
                referencia_pago: 'TXN_001_TEST',
            },
            {
                usuario_id: evelyn.id,
                direccion_id: dirEvelyn.id,
                estado: 'confirmado',
                subtotal: 220.00,
                costo_envio: 10.00,
                descuento_puntos: 20.00,
                total: 210.00,
                puntos_usados: 20,
                puntos_ganados: 21,
                metodo_pago: 'qr',
                referencia_pago: 'TXN_002_TEST',
            },
            {
                usuario_id: mauricio.id,
                direccion_id: dirMauricio.id,
                estado: 'en_preparacion',
                subtotal: 143.00,
                costo_envio: 20.00,
                descuento_puntos: 0.00,
                total: 163.00,
                puntos_usados: 0,
                puntos_ganados: 16,
                metodo_pago: 'efectivo',
                referencia_pago: 'TXN_003_TEST',
            },
            {
                usuario_id: beymar.id,
                direccion_id: dirBeymar.id,
                estado: 'pendiente',
                subtotal: 115.00,
                costo_envio: 10.00,
                descuento_puntos: 0.00,
                total: 125.00,
                puntos_usados: 0,
                puntos_ganados: 12,
                metodo_pago: 'tarjeta',
                referencia_pago: 'TXN_004_TEST',
            },
        ],
    })
}
