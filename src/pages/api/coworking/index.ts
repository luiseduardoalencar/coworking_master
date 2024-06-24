import AuthService from '@/auth/auth.service'
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authorizationHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const tokenData = await AuthService.openSessionToken(token);
    if (!tokenData.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const { name, type, seat } = req.body;
    if (!name || !type || !seat ) { 
      return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
    }

    // Usar uma transação Prisma para garantir a atomicidade
    const result = await prisma.$transaction(async (prisma) => {
      const coworking = await prisma.coworking.create({
        data: {
          name,
          type,
        },
        select: {
          id: true,
        },
      });

      const seatsData = Array.from({ length: seat }, (_, i) => ({
        coworkingId: coworking.id,
        seatNumber: String(i + 1),
      }));

      await prisma.seat.createMany({
        data: seatsData,
      });

      return coworking;
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Erro ao criar espaço de coworking e assentos:", error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}