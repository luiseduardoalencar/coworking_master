import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  id: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, type, imageUrl, seat } = req.body
  console.log(seat);
  
  const result = await prisma.coworking.create({
    data: {
      name,
      type,
      imageUrl     
    },
     select: {
      id: true,
    }
  })

  for (let i = 1; i <= seat; i++) {
    await prisma.seat.create({
      data: {
        coworkingId: result.id
      }
    })
  }

  return res.status(201).json(result)
}