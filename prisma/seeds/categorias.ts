import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedCategorias(prisma: PrismaClient) {

    await prisma.categorias.createMany({
        skipDuplicates: true,
        data: [
            { nombre: 'Peluches', descripcion: 'Peluches y peluches temáticos de personajes populares' },
            { nombre: 'Juguetes', descripcion: 'Juguetes didácticos, rompecabezas y juegos de mesa' },
            { nombre: 'Salud y Belleza', descripcion: 'Espejos, antifaces y productos de cuidado personal' },
            { nombre: 'Tecnología', descripcion: 'Auriculares, teclados, soportes y accesorios tecnológicos' },
            { nombre: 'Accesorios y Bisutería', descripcion: 'Diademas, bandas elásticas, llaveros y accesorios de moda' },
            { nombre: 'Flores', descripcion: 'Ramos de flores, arreglos florales y macetas decorativas' },
            { nombre: 'Perfumes', descripcion: 'Fragancias y perfumes para ocasiones especiales' },
            { nombre: 'Sorpresas', descripcion: 'Cajas sorpresa y blind boxes' },
        ],
    })
}