import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
 
interface ResponseData {
  id: string
  seatNumber: string 
  coworkingId: string 
  busy?: boolean | null
 
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData[]>
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  const  coworkingId  = req.headers['coworkingid'] as string
  console.log(coworkingId, "GET SEATS");

  if (!coworkingId) {
    return res.status(400).end()
  }

  try {
    
    const result = await prisma.seat.findMany({
      where: {
        coworkingId
      },
      select: {
        id: true,
       seatNumber: true,
        busy: true,
        coworkingId: true,
      }
    })

    result.sort((a, b) => {
      const seatA = parseInt(a.seatNumber, 10);
      const seatB = parseInt(b.seatNumber, 10);
      return seatA - seatB;
    });
    
    return res.status(201).json(result)
    
  }catch (error) {
    return res.status(500).end()
  }

}