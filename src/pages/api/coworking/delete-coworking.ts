import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

interface ResponseData {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'DELETE') {
    return res.status(405).end();
  }

  const { id } = req.body;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid coworking ID' });
  }

  try {
    // Delete associated reservations first
    await prisma.reserve.deleteMany({
      where: {
        coworkingId: id,
      },
    });

    // Delete associated seats
    await prisma.seat.deleteMany({
      where: {
        coworkingId: id,
      },
    });

    // Delete associated images
    await prisma.imageCoworking.deleteMany({
      where: {
        coworkingId: id,
      },
    });

    // Delete the coworking space
    await prisma.coworking.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: 'Coworking space deleted successfully' });
  } catch (error) {
    console.error('Error deleting coworking space:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
