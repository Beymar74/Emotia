import { PrismaClient } from '../../src/generated/prisma/client'

export async function seedProductos(prisma: PrismaClient) {
    // Obtener IDs de proveedores y categorías
    const proveedores = await prisma.proveedores.findMany()
    const categorias = await prisma.categorias.findMany()

    const artesanias = proveedores.find((p: any) => p.nombre_negocio === 'Artesanías Mamani')!
    const chocolates = proveedores.find((p: any) => p.nombre_negocio === 'Chocolates Quispe')!
    const flores = proveedores.find((p: any) => p.nombre_negocio === 'Flores Copacabana')!
    const tech = proveedores.find((p: any) => p.nombre_negocio === 'TechGadgets Bolivia')!

    const catJoyeria = categorias.find((c: any) => c.nombre === 'Joyeria y Accesorios')!
    const catDulces = categorias.find((c: any) => c.nombre === 'Dulces y Delicias')!
    const catFlores = categorias.find((c: any) => c.nombre === 'Flores y Plantas')!
    const catTech = categorias.find((c: any) => c.nombre === 'Tecnologia y Gadgets')!
    const catTextiles = categorias.find((c: any) => c.nombre === 'Textiles Personalizados')!

    await prisma.productos.createMany({
        skipDuplicates: true,
        data: [
            // Joyería
            {
                proveedor_id: artesanias.id,
                categoria_id: catJoyeria.id,
                nombre: 'Collar de plata artesanal',
                descripcion: 'Collar hecho a mano con plata boliviana y piedras preciosas',
                precio_base: 120.00,
                precio_venta: 144.00,
                stock: 15,
                ocasiones: ['cumpleaños', 'aniversario', 'día de la madre'],
                personalidades: ['romántico', 'detallista', 'artístico'],
                genero_destinatario: 'mujer',
                edad_min: 18,
                edad_max: 60,
                permite_mensaje: true,
                permite_empaque: true,
            },
            {
                proveedor_id: artesanias.id,
                categoria_id: catJoyeria.id,
                nombre: 'Pulsera tejida con nombre',
                descripcion: 'Pulsera artesanal tejida con el nombre del destinatario',
                precio_base: 45.00,
                precio_venta: 54.00,
                stock: 30,
                ocasiones: ['cumpleaños', 'amistad', 'graduación'],
                personalidades: ['detallista', 'artístico', 'romántico'],
                genero_destinatario: 'cualquiera',
                edad_min: 10,
                edad_max: 40,
                permite_mensaje: true,
                permite_empaque: true,
            },
            // Dulces
            {
                proveedor_id: chocolates.id,
                categoria_id: catDulces.id,
                nombre: 'Caja de chocolates artesanales',
                descripcion: 'Caja de 12 chocolates artesanales con rellenos variados',
                precio_base: 80.00,
                precio_venta: 96.00,
                stock: 20,
                ocasiones: ['cumpleaños', 'aniversario', 'día de la madre', 'navidad'],
                personalidades: ['romántico', 'detallista', 'aventurero'],
                genero_destinatario: 'cualquiera',
                edad_min: 5,
                edad_max: 80,
                permite_mensaje: true,
                permite_empaque: true,
            },
            {
                proveedor_id: chocolates.id,
                categoria_id: catDulces.id,
                nombre: 'Torta personalizada',
                descripcion: 'Torta decorada con mensaje y diseño personalizado',
                precio_base: 150.00,
                precio_venta: 180.00,
                stock: 10,
                ocasiones: ['cumpleaños', 'graduación', 'aniversario'],
                personalidades: ['detallista', 'romántico'],
                genero_destinatario: 'cualquiera',
                edad_min: 1,
                edad_max: 100,
                permite_mensaje: true,
                permite_empaque: false,
            },
            // Flores
            {
                proveedor_id: flores.id,
                categoria_id: catFlores.id,
                nombre: 'Ramo de rosas rojas',
                descripcion: 'Ramo de 12 rosas rojas frescas con follaje',
                precio_base: 60.00,
                precio_venta: 72.00,
                stock: 25,
                ocasiones: ['aniversario', 'día de la madre', 'cumpleaños'],
                personalidades: ['romántico', 'detallista'],
                genero_destinatario: 'mujer',
                edad_min: 18,
                edad_max: 80,
                permite_mensaje: true,
                permite_empaque: false,
            },
            {
                proveedor_id: flores.id,
                categoria_id: catFlores.id,
                nombre: 'Cactus decorativo',
                descripcion: 'Cactus en maceta decorativa personalizable',
                precio_base: 35.00,
                precio_venta: 42.00,
                stock: 40,
                ocasiones: ['cumpleaños', 'amistad', 'graduación'],
                personalidades: ['aventurero', 'artístico', 'tecnológico'],
                genero_destinatario: 'cualquiera',
                edad_min: 15,
                edad_max: 50,
                permite_mensaje: true,
                permite_empaque: true,
            },
            // Tech
            {
                proveedor_id: tech.id,
                categoria_id: catTech.id,
                nombre: 'Audífonos personalizados',
                descripcion: 'Audífonos inalámbricos con grabado de nombre o frase',
                precio_base: 200.00,
                precio_venta: 240.00,
                stock: 12,
                ocasiones: ['cumpleaños', 'graduación', 'navidad'],
                personalidades: ['tecnológico', 'aventurero'],
                genero_destinatario: 'cualquiera',
                edad_min: 15,
                edad_max: 40,
                permite_mensaje: false,
                permite_empaque: true,
            },
            // Textiles
            {
                proveedor_id: artesanias.id,
                categoria_id: catTextiles.id,
                nombre: 'Taza con foto personalizada',
                descripcion: 'Taza de cerámica con foto y mensaje del cliente',
                precio_base: 40.00,
                precio_venta: 48.00,
                stock: 50,
                ocasiones: ['cumpleaños', 'día de la madre', 'día del padre', 'amistad'],
                personalidades: ['detallista', 'romántico', 'artístico'],
                genero_destinatario: 'cualquiera',
                edad_min: 18,
                edad_max: 80,
                permite_mensaje: true,
                permite_empaque: true,
            },
        ],
    })
}
