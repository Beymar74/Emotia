import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedRecordatorios(prisma: PrismaClient) {
    const usuarios = await prisma.usuarios.findMany()

    const beymar = usuarios.find((u: any) => u.email === 'beymar@test.com')!
    const evelyn = usuarios.find((u: any) => u.email === 'evelyn@test.com')!
    const mauricio = usuarios.find((u: any) => u.email === 'mauricio@test.com')!

    await prisma.recordatorios.createMany({
        skipDuplicates: true,
        data: [
            {
                usuario_id: beymar.id,
                titulo: 'Cumpleaños de mamá',
                fecha_evento: new Date('2026-06-15'),
                dias_aviso: 7,
                descripcion: 'No olvidar comprar regalo con tiempo',
                activo: true,
            },
            {
                usuario_id: beymar.id,
                titulo: 'Aniversario con pareja',
                fecha_evento: new Date('2026-08-20'),
                dias_aviso: 14,
                descripcion: 'Buscar algo especial en Emotia',
                activo: true,
            },
            {
                usuario_id: evelyn.id,
                titulo: 'Día de la Madre',
                fecha_evento: new Date('2026-05-25'),
                dias_aviso: 10,
                descripcion: 'Regalo para mamá y abuela',
                activo: true,
            },
            {
                usuario_id: mauricio.id,
                titulo: 'Cumpleaños de hermano',
                fecha_evento: new Date('2026-07-10'),
                dias_aviso: 5,
                descripcion: 'Le gustan los gadgets tecnológicos',
                activo: true,
            },
            {
                usuario_id: mauricio.id,
                titulo: 'Navidad',
                fecha_evento: new Date('2026-12-25'),
                dias_aviso: 30,
                descripcion: 'Compras navideñas para toda la familia',
                activo: true,
            },
        ],
    })
}
