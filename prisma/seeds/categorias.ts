import { PrismaClient } from '../../src/generated/prisma/client'
export async function seedCategorias(prisma: PrismaClient) {
  await prisma.categorias.createMany({
    skipDuplicates: true,
    data: [
      { nombre: 'Joyeria y Accesorios',    descripcion: 'Collares, pulseras, aretes artesanales' },
      { nombre: 'Textiles Personalizados', descripcion: 'Poleras, tazas, cojines con mensaje' },
      { nombre: 'Arte y Decoracion',       descripcion: 'Cuadros, artesanias, piezas unicas' },
      { nombre: 'Experiencias',            descripcion: 'Cenas, spa, actividades especiales' },
      { nombre: 'Dulces y Delicias',       descripcion: 'Chocolates, tortas, cajas de regalo gourmet' },
      { nombre: 'Tecnologia y Gadgets',    descripcion: 'Accesorios tecnologicos personalizados' },
      { nombre: 'Flores y Plantas',        descripcion: 'Arreglos florales y plantas decorativas' },
    ],
  })
}