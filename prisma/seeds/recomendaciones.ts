import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedRecomendaciones(prisma: PrismaClient) {

    const usuarios = await prisma.usuarios.findMany()
    const productos = await prisma.productos.findMany()

    const beymar = usuarios.find((u: any) => u.email === 'beymar@test.com')!
    const evelyn = usuarios.find((u: any) => u.email === 'evelyn@test.com')!
    const mauricio = usuarios.find((u: any) => u.email === 'mauricio@test.com')!

    const collar = productos.find((p: any) => p.nombre === 'Collar de plata artesanal')!
    const chocolates = productos.find((p: any) => p.nombre === 'Caja de chocolates artesanales')!
    const rosas = productos.find((p: any) => p.nombre === 'Ramo de rosas rojas')!
    const audifonos = productos.find((p: any) => p.nombre === 'Audífonos personalizados')!
    const pulsera = productos.find((p: any) => p.nombre === 'Pulsera tejida con nombre')!

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
                presupuesto_max: 200.00,
                productos_sugeridos: [collar.id, rosas.id, chocolates.id],
                producto_elegido: collar.id,
                convertida_en_compra: true,
            },
            {
                usuario_id: evelyn.id,
                destinatario_rel: 'madre',
                destinatario_edad: 50,
                destinatario_genero: 'mujer',
                personalidad: ['detallista', 'romántico'],
                ocasion: 'día de la madre',
                presupuesto_min: 50.00,
                presupuesto_max: 150.00,
                productos_sugeridos: [chocolates.id, rosas.id, pulsera.id],
                producto_elegido: chocolates.id,
                convertida_en_compra: true,
            },
            {
                usuario_id: mauricio.id,
                destinatario_rel: 'amigo',
                destinatario_edad: 22,
                destinatario_genero: 'hombre',
                personalidad: ['tecnológico', 'aventurero'],
                ocasion: 'cumpleaños',
                presupuesto_min: 200.00,
                presupuesto_max: 300.00,
                productos_sugeridos: [audifonos.id],
                producto_elegido: audifonos.id,
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
                presupuesto_max: 100.00,
                productos_sugeridos: [rosas.id, pulsera.id, chocolates.id],
                producto_elegido: rosas.id,
                convertida_en_compra: false,
            },
        ],
    })
}
