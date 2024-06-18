import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
 
interface ResponseData {
  booking_date: Date
  seat: {
    seatNumber: string
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
  console.log(coworkingId, "GET SEATS");

  if (!coworkingId) {
    return res.status(400).end()
  }

  const result = await prisma.reserve.findMany({
    where: {
      coworkingId
    },
    select: {
     booking_date: true,
     seat: {
      select: {
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


  return res.status(201).json(result)
}