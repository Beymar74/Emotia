import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { seedCategorias } from './seeds/categorias'
import { seedProveedores } from './seeds/proveedores'
import { seedUsuarios } from './seeds/usuarios'
import { seedProductos } from './seeds/productos'
import { seedDirecciones } from './seeds/direcciones'
import { seedPedidos } from './seeds/pedidos'
import { seedDetallePedidos } from './seeds/detalle_pedidos'
import { seedCarrito } from './seeds/carrito'
import { seedRecomendaciones } from './seeds/recomendaciones'
import { seedInsignias } from './seeds/insignias'
import { seedRecordatorios } from './seeds/recordatorios'
import { seedNotificaciones } from './seeds/notificaciones'
import { seedAuditLog } from './seeds/audit_log'

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('🌱 Iniciando seed de Emotia...\n')

    // Orden importa por las relaciones entre tablas
    await seedCategorias(prisma)
    console.log('✅ Categorías')

    await seedProveedores(prisma)
    console.log('✅ Proveedores')

    await seedUsuarios(prisma)
    console.log('✅ Usuarios')

    await seedProductos(prisma)
    console.log('✅ Productos')

    await seedDirecciones(prisma)
    console.log('✅ Direcciones')

    await seedPedidos(prisma)
    console.log('✅ Pedidos')

    await seedDetallePedidos(prisma)
    console.log('✅ Detalle de pedidos')

    await seedCarrito(prisma)
    console.log('✅ Carrito')

    await seedRecomendaciones(prisma)
    console.log('✅ Recomendaciones')

    await seedInsignias(prisma)
    console.log('✅ Insignias')

    await seedRecordatorios(prisma)
    console.log('✅ Recordatorios')

    await seedNotificaciones(prisma)
    console.log('✅ Notificaciones')

    await seedAuditLog(prisma)
    console.log('✅ Audit log')

    console.log('\n🎉 Seed completado exitosamente!')
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
