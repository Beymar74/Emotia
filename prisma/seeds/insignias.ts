import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedInsignias(prisma: PrismaClient) {
    const usuarios = await prisma.usuarios.findMany()

    const beymar = usuarios.find(u => u.email === 'beymar@test.com')!
    const evelyn = usuarios.find(u => u.email === 'evelyn@test.com')!
    const einard = usuarios.find(u => u.email === 'einard@test.com')!
    const mauricio = usuarios.find(u => u.email === 'mauricio@test.com')!

    await prisma.insignias.createMany({
        skipDuplicates: true,
        data: [
            {
                usuario_id: beymar.id,
                tipo: 'primera_compra',
                descripcion: 'Realizó su primera compra en Emotia',
            },
            {
                usuario_id: beymar.id,
                tipo: 'cliente_premium',
                descripcion: 'Activó el plan premium',
            },
            {
                usuario_id: evelyn.id,
                tipo: 'primera_compra',
                descripcion: 'Realizó su primera compra en Emotia',
            },
            {
                usuario_id: einard.id,
                tipo: 'explorador',
                descripcion: 'Exploró más de 10 productos distintos',
            },
            {
                usuario_id: mauricio.id,
                tipo: 'primera_compra',
                descripcion: 'Realizó su primera compra en Emotia',
            },
            {
                usuario_id: mauricio.id,
                tipo: 'cliente_vip',
                descripcion: 'Superó los 300 puntos acumulados',
            },
        ],
    })
}
