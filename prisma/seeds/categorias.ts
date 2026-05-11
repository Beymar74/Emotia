import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedCategorias(prisma: PrismaClient) {
  await prisma.categorias.createMany({
    skipDuplicates: true,
    data: [
      {
        nombre: 'Peluches',
        descripcion: 'Peluches y peluches temáticos de personajes populares',
        activo: true,
      },
      {
        nombre: 'Juguetes',
        descripcion: 'Juguetes didácticos, rompecabezas y juegos de mesa',
        activo: true,
      },
      {
        nombre: 'Salud y Belleza',
        descripcion: 'Espejos, antifaces y productos de cuidado personal',
        activo: true,
      },
      {
        nombre: 'Tecnología',
        descripcion: 'Auriculares, teclados, soportes y accesorios tecnológicos',
        activo: true,
      },
      {
        nombre: 'Accesorios y Bisutería',
        descripcion: 'Diademas, bandas elásticas, llaveros y accesorios de moda',
        activo: true,
      },
      {
        nombre: 'Flores',
        descripcion: 'Ramos de flores, arreglos florales y macetas decorativas',
        activo: true,
      },
      {
        nombre: 'Perfumes',
        descripcion: 'Fragancias y perfumes para ocasiones especiales',
        activo: true,
      },
      {
        nombre: 'Sorpresas',
        descripcion: 'Cajas sorpresa y blind boxes',
        activo: true,
      },

      // NUEVAS
      {
        nombre: 'Chocolates',
        descripcion: 'Chocolates premium, dulces y detalles comestibles',
        activo: true,
      },
      {
        nombre: 'Regalos Personalizados',
        descripcion: 'Tazas, cuadros, detalles con personalización',
        activo: true,
      },
      {
        nombre: 'Desayunos Sorpresa',
        descripcion: 'Canastas y desayunos especiales para regalo',
        activo: true,
      },
      {
        nombre: 'Bebidas y Gourmet',
        descripcion: 'Vinos, snacks premium y productos gourmet',
        activo: true,
      },
    ],
  })
}