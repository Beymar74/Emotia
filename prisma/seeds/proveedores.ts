import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedProveedores(prisma: PrismaClient) {

    await prisma.proveedores.createMany({
        skipDuplicates: true,
        data: [
            {
                nombre_negocio: 'Artesanías Mamani',
                descripcion: 'Joyería artesanal hecha a mano en La Paz',
                email: 'mamani.artesanias@gmail.com',
                password_hash: '$2b$12$PLACEHOLDER_HASH',
                telefono: '71234567',
                estado: 'aprobado',
                calificacion_prom: 4.8,
            },
            {
                nombre_negocio: 'Chocolates Quispe',
                descripcion: 'Chocolates y dulces artesanales bolivianos',
                email: 'chocolates.quispe@gmail.com',
                password_hash: '$2b$12$PLACEHOLDER_HASH',
                telefono: '76543210',
                estado: 'aprobado',
                calificacion_prom: 4.6,
            },
            {
                nombre_negocio: 'Flores Copacabana',
                descripcion: 'Arreglos florales y plantas decorativas',
                email: 'flores.copacabana@gmail.com',
                password_hash: '$2b$12$PLACEHOLDER_HASH',
                telefono: '79876543',
                estado: 'aprobado',
                calificacion_prom: 4.5,
            },
            {
                nombre_negocio: 'TechGadgets Bolivia',
                descripcion: 'Accesorios tecnológicos personalizados',
                email: 'techgadgets.bo@gmail.com',
                password_hash: '$2b$12$PLACEHOLDER_HASH',
                telefono: '72345678',
                estado: 'aprobado',
                calificacion_prom: 4.3,
            },
        ],
    })
}
