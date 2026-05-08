import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedUsuarios(prisma: PrismaClient) {
    const usuariosData = [
        // Admin
        { nombre: 'Admin', apellido: 'Emotia', email: 'admin@emotia.bo', password_hash: '$2b$12$PLACEHOLDER_HASH', tipo: 'admin', plan: 'premium', puntos: 0 },
        // Usuarios de prueba base
        { nombre: 'Beymar', apellido: 'Mamani', email: 'beymar@test.com', password_hash: '$2b$12$PLACEHOLDER_HASH', tipo: 'usuario', plan: 'premium', puntos: 1500 },
        { nombre: 'Evelyn', apellido: 'Burgoa', email: 'evelyn@test.com', password_hash: '$2b$12$PLACEHOLDER_HASH', tipo: 'usuario', plan: 'basico', puntos: 800 },
        { nombre: 'Einard', apellido: 'Gutierrez', email: 'einard@test.com', password_hash: '$2b$12$PLACEHOLDER_HASH', tipo: 'usuario', plan: 'basico', puntos: 2000 },
        { nombre: 'Mauricio', apellido: 'Menacho', email: 'mauricio@test.com', password_hash: '$2b$12$PLACEHOLDER_HASH', tipo: 'usuario', plan: 'premium', puntos: 3200 },
        { nombre: 'María', apellido: 'Quispe', email: 'maria.quispe@test.com', password_hash: '$2b$12$PLACEHOLDER_HASH', tipo: 'usuario', plan: 'basico', puntos: 50 },
    ];

    const nombres = ['Carlos', 'Lucia', 'Andres', 'Sofia', 'Diego', 'Camila', 'Alejandro', 'Valeria', 'Javier', 'Fernanda', 'Mateo', 'Isabella', 'Sebastian', 'Valentina', 'Joaquin', 'Gabriela', 'Martin', 'Daniela', 'Rodrigo', 'Mariana'];
    const apellidos = ['Perez', 'Mendez', 'Salazar', 'Rojas', 'Vargas', 'Ortiz', 'Guzman', 'Lopez', 'Garcia', 'Martinez', 'Rodriguez', 'Flores', 'Gomez', 'Diaz', 'Cruz', 'Morales', 'Reyes', 'Aguilar', 'Castillo', 'Romero'];

    for (let i = 0; i < 40; i++) {
        const nombre = nombres[Math.floor(Math.random() * nombres.length)];
        const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
        const email = `${nombre.toLowerCase()}.${apellido.toLowerCase()}${i}@test.com`;
        
        usuariosData.push({
            nombre,
            apellido,
            email,
            password_hash: '$2b$12$PLACEHOLDER_HASH',
            tipo: 'usuario',
            plan: Math.random() > 0.7 ? 'premium' : 'basico',
            puntos: Math.floor(Math.random() * 500) * 10,
        });
    }

    await prisma.usuarios.createMany({
        skipDuplicates: true,
        data: usuariosData,
    })
}
