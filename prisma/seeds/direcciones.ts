import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedDirecciones(prisma: PrismaClient) {
    const usuarios = await prisma.usuarios.findMany()

    const beymar = usuarios.find(u => u.email === 'beymar@test.com')!
    const evelyn = usuarios.find(u => u.email === 'evelyn@test.com')!
    const einard = usuarios.find(u => u.email === 'einard@test.com')!
    const mauricio = usuarios.find(u => u.email === 'mauricio@test.com')!
    const maria = usuarios.find(u => u.email === 'maria.quispe@test.com')!

    await prisma.direcciones.createMany({
        skipDuplicates: true,
        data: [
            {
                usuario_id: beymar.id,
                calle: 'Av. Arce',
                numero: '2345',
                zona: 'Sopocachi',
                referencia: 'Frente al parque',
                ciudad: 'La Paz',
                es_principal: true,
            },
            {
                usuario_id: evelyn.id,
                calle: 'Calle Murillo',
                numero: '123',
                zona: 'San Pedro',
                referencia: 'Edificio azul, piso 3',
                ciudad: 'La Paz',
                es_principal: true,
            },
            {
                usuario_id: einard.id,
                calle: 'Av. 6 de Agosto',
                numero: '789',
                zona: 'Miraflores',
                referencia: 'Cerca del estadio',
                ciudad: 'La Paz',
                es_principal: true,
            },
            {
                usuario_id: mauricio.id,
                calle: 'Calle Potosí',
                numero: '456',
                zona: 'Centro',
                referencia: 'Al lado de la farmacia',
                ciudad: 'La Paz',
                es_principal: true,
            },
            {
                usuario_id: maria.id,
                calle: 'Av. Villazón',
                numero: '321',
                zona: 'Obrajes',
                referencia: 'Casa verde con rejas negras',
                ciudad: 'La Paz',
                es_principal: true,
            },
        ],
    })
}
