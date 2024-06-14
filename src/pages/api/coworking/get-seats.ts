import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
 
interface ResponseData {
  id: string
  seatOwner?: string | null
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
  const  coworkingId  = req.query
console.log(coworkingId);

  if (!coworkingId) {
    return res.status(400).end()
  }

  const result = await prisma.seat.findMany({
    where: {
      coworkingId
    },
    select: {
      id: true,
      seatOwner: true,
      busy: true,
      coworkingId: true
    }
  })


  return res.status(201).json(result)
}