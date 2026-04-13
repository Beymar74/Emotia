import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedAuditLog(prisma: PrismaClient) {

    const usuarios = await prisma.usuarios.findMany()

    const admin = usuarios.find((u: any) => u.email === 'admin@emotia.bo')!
    const beymar = usuarios.find((u: any) => u.email === 'beymar@test.com')!
    const evelyn = usuarios.find((u: any) => u.email === 'evelyn@test.com')!
    const mauricio = usuarios.find((u: any) => u.email === 'mauricio@test.com')!

    await prisma.audit_log.createMany({
        data: [
            {
                actor_id: admin.id,
                actor_tipo: 'admin',
                accion: 'APROBAR_PROVEEDOR',
                detalle: { proveedor: 'Artesanías Mamani', motivo: 'Documentación completa' },
                ip_address: '192.168.1.1',
            },
            {
                actor_id: admin.id,
                actor_tipo: 'admin',
                accion: 'APROBAR_PROVEEDOR',
                detalle: { proveedor: 'Chocolates Quispe', motivo: 'Documentación completa' },
                ip_address: '192.168.1.1',
            },
            {
                actor_id: beymar.id,
                actor_tipo: 'usuario',
                accion: 'INICIO_SESION',
                detalle: { metodo: 'email' },
                ip_address: '190.15.20.5',
            },
            {
                actor_id: beymar.id,
                actor_tipo: 'usuario',
                accion: 'CREAR_PEDIDO',
                detalle: { pedido_id: 1, total: 159.00 },
                ip_address: '190.15.20.5',
            },
            {
                actor_id: evelyn.id,
                actor_tipo: 'usuario',
                accion: 'INICIO_SESION',
                detalle: { metodo: 'google' },
                ip_address: '190.15.21.8',
            },
            {
                actor_id: evelyn.id,
                actor_tipo: 'usuario',
                accion: 'CREAR_PEDIDO',
                detalle: { pedido_id: 2, total: 86.00 },
                ip_address: '190.15.21.8',
            },
            {
                actor_id: mauricio.id,
                actor_tipo: 'usuario',
                accion: 'INICIO_SESION',
                detalle: { metodo: 'email' },
                ip_address: '190.15.22.3',
            },
            {
                actor_id: mauricio.id,
                actor_tipo: 'usuario',
                accion: 'CREAR_PEDIDO',
                detalle: { pedido_id: 3, total: 260.00 },
                ip_address: '190.15.22.3',
            },
            {
                actor_id: null,
                actor_tipo: 'sistema',
                accion: 'SEED_INICIAL',
                detalle: { descripcion: 'Datos de prueba cargados correctamente' },
                ip_address: 'localhost',
            },
        ],
    })
}
