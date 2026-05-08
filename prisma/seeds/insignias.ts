import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedInsignias(prisma: PrismaClient) {

    const usuarios = await prisma.usuarios.findMany()

    const insigniasData = []

    for (const usuario of usuarios) {
        // Todo usuario tiene la primera compra si tiene plan
        if (Math.random() > 0.3) {
            insigniasData.push({
                usuario_id: usuario.id,
                tipo: 'primera_compra',
                descripcion: 'Realizó su primera compra en Emotia',
            })
        }

        if (usuario.plan === 'premium') {
            insigniasData.push({
                usuario_id: usuario.id,
                tipo: 'cliente_premium',
                descripcion: 'Activó el plan premium',
            })
        }

        if (usuario.puntos >= 300) {
            insigniasData.push({
                usuario_id: usuario.id,
                tipo: 'cliente_vip',
                descripcion: 'Superó los 300 puntos acumulados',
            })
        }
        
        if (Math.random() > 0.5) {
            insigniasData.push({
                usuario_id: usuario.id,
                tipo: 'explorador',
                descripcion: 'Exploró más de 10 productos distintos',
            })
        }
    }

    await prisma.insignias.createMany({
        skipDuplicates: true,
        data: insigniasData,
    })
}
