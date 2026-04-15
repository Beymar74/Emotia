import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    // Solo procesamos eventos de usuario
    if (type !== 'user.created' && type !== 'user.updated') {
      return NextResponse.json({ ok: true })
    }

    const email = data.primary_email
    const displayName = data.display_name || ''
    const stackId = data.id

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    const partes = displayName.split(' ')
    const nombre = partes[0] || 'Usuario'
    const apellido = partes.slice(1).join(' ') || null

    await prisma.usuarios.upsert({
      where: { email },
      update: {
        nombre,
        apellido,
        updated_at: new Date(),
      },
      create: {
        nombre,
        apellido,
        email,
        google_id: stackId,
        tipo: 'usuario',
        plan: 'basico',
        puntos: 0,
        activo: true,
      }
    })

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('Error en webhook Stack:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}