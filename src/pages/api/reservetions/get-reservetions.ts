import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
 
interface ResponseData {
  andTime: Date
  startTime: Date
  seat: {
    seatNumber: string
    id: string
  }
  user: {
    name: string
  }

}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData[]>
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }
  const  coworkingId  = req.headers['coworkingid'] as string
 
  if (!coworkingId) {
    return res.status(400).end()
  }

  const result = await prisma.reserve.findMany({
    where: {
      coworkingId
    },
    select: {
     andTime: true,
     startTime: true,
     seat: {
      select: {
        id: true,
        seatNumber: true
      }
     },
     user: {
      select: {
        name: true
      }
     }
    }
  })
console.log(result);

  return res.status(201).json(result)
}
