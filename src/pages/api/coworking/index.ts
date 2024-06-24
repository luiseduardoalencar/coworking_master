import AuthService from '@/auth/auth.service'
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Extrair o token do formato "Bearer {token}"
  const token = authorizationHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  
  try {
    const tokenData = await AuthService.openSessionToken(token);
    if (!tokenData) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { name, type, seat } = req.body;
    if (!name || !type || !seat) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const result = await prisma.coworking.create({
      data: {
        name,
        type,
      },
      select: {
        id: true,
      },
    });

    const seatsData = Array.from({ length: seat }, (_, i) => ({
      coworkingId: result.id,
      seatNumber: String(i + 1),
    }));

    await prisma.seat.createMany({
      data: seatsData,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creating coworking and seats:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
