import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const authHeader = req.headers.authorization
  console.log(authHeader, "AUTHOR");
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido ou inválido' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret')
    const userId = (decoded as { userId: string }).userId

    const profile = await prisma.userAdmin.findFirst({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        id: true,
        role: true
      },
    })

    if (!profile) {
      return res.status(404).json({ message: 'Perfil não encontrado' })
    }

    return res.status(200).json(profile)
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado' })
  }
}