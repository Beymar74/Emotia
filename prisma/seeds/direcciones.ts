import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedDirecciones(prisma: PrismaClient) {

    const usuarios = await prisma.usuarios.findMany()

    const direccionesBase = usuarios.map((u, i) => ({
        usuario_id: u.id,
        calle: `Calle ${i + 1} de Obrajes`,
        numero: `${100 + i}`,
        zona: 'Obrajes',
        referencia: 'Cerca de la plaza',
        ciudad: 'La Paz',
        es_principal: true,
    }))

    await prisma.direcciones.createMany({
        skipDuplicates: true,
        data: direccionesBase,
    })
}