import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedRecomendaciones(prisma: PrismaClient) {

    const usuarios = await prisma.usuarios.findMany()
    const productos = await prisma.productos.findMany()

    const beymar = usuarios.find((u: any) => u.email === 'beymar@test.com')!
    const evelyn = usuarios.find((u: any) => u.email === 'evelyn@test.com')!
    const mauricio = usuarios.find((u: any) => u.email === 'mauricio@test.com')!

    const findProducto = (nombre: string) => {
        const producto = productos.find((p: any) => p.nombre === nombre)
        if (!producto) throw new Error(`Producto no encontrado en seedRecomendaciones: ${nombre}`)
        return producto
    }

    const cadena = findProducto('Juego de cadena de aleación-BM23')
    const bouquetMama = findProducto('MINI BOUQUET GRACIAS MAMA')
    const rosas = findProducto('Ramo de 6 rosas')
    const auriculares = findProducto('Auriculares plegables')
    const llaveroCorazon = findProducto('Llavero con espejo en forma de corazón de la colección MIKKO')

    await prisma.recomendaciones.createMany({
        skipDuplicates: true,
        data: [
            {
                usuario_id: beymar.id,
                destinatario_rel: 'pareja',
                destinatario_edad: 25,
                destinatario_genero: 'mujer',
                personalidad: ['romántico', 'detallista'],
                ocasion: 'aniversario',
                presupuesto_min: 100.00,
                presupuesto_max: 250.00,
                productos_sugeridos: [cadena.id, rosas.id, llaveroCorazon.id],
                producto_elegido: cadena.id,
                convertida_en_compra: true,
            },
            {
                usuario_id: evelyn.id,
                destinatario_rel: 'madre',
                destinatario_edad: 50,
                destinatario_genero: 'mujer',
                personalidad: ['detallista', 'romántico'],
                ocasion: 'día de la madre',
                presupuesto_min: 100.00,
                presupuesto_max: 250.00,
                productos_sugeridos: [bouquetMama.id, rosas.id, llaveroCorazon.id],
                producto_elegido: bouquetMama.id,
                convertida_en_compra: true,
            },
            {
                usuario_id: mauricio.id,
                destinatario_rel: 'amigo',
                destinatario_edad: 22,
                destinatario_genero: 'hombre',
                personalidad: ['tecnológico', 'aventurero'],
                ocasion: 'cumpleaños',
                presupuesto_min: 100.00,
                presupuesto_max: 200.00,
                productos_sugeridos: [auriculares.id],
                producto_elegido: auriculares.id,
                convertida_en_compra: true,
            },
            {
                usuario_id: beymar.id,
                destinatario_rel: 'pareja',
                destinatario_edad: 25,
                destinatario_genero: 'mujer',
                personalidad: ['romántico'],
                ocasion: 'aniversario',
                presupuesto_min: 50.00,
                presupuesto_max: 150.00,
                productos_sugeridos: [rosas.id, llaveroCorazon.id, cadena.id],
                producto_elegido: rosas.id,
                convertida_en_compra: false,
            },
        ],
    })
}
