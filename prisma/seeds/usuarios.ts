import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedUsuarios(prisma: PrismaClient) {

    await prisma.usuarios.createMany({
        skipDuplicates: true,
        data: [
            // Admin
            {
                nombre: 'Admin',
                apellido: 'Emotia',
                email: 'admin@emotia.bo',
                password_hash: '$2b$12$PLACEHOLDER_HASH',
                tipo: 'admin',
                plan: 'premium',
                puntos: 0,
            },
            // Usuarios de prueba
            {
                nombre: 'Beymar',
                apellido: 'Mamani',
                email: 'beymar@test.com',
                password_hash: '$2b$12$PLACEHOLDER_HASH',
                tipo: 'usuario',
                plan: 'premium',
                puntos: 150,
            },
            {
                nombre: 'Evelyn',
                apellido: 'Burgoa',
                email: 'evelyn@test.com',
                password_hash: '$2b$12$PLACEHOLDER_HASH',
                tipo: 'usuario',
                plan: 'basico',
                puntos: 80,
            },
            {
                nombre: 'Einard',
                apellido: 'Gutierrez',
                email: 'einard@test.com',
                password_hash: '$2b$12$PLACEHOLDER_HASH',
                tipo: 'usuario',
                plan: 'basico',
                puntos: 200,
            },
            {
                nombre: 'Mauricio',
                apellido: 'Menacho',
                email: 'mauricio@test.com',
                password_hash: '$2b$12$PLACEHOLDER_HASH',
                tipo: 'usuario',
                plan: 'premium',
                puntos: 320,
            },
            {
                nombre: 'María',
                apellido: 'Quispe',
                email: 'maria.quispe@test.com',
                password_hash: '$2b$12$PLACEHOLDER_HASH',
                tipo: 'usuario',
                plan: 'basico',
                puntos: 50,
            },
        ],
    })
}
