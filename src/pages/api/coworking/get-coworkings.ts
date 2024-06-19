import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
 
interface ResponseData {
  id: string
  name: string
  type: string
  imageUrl?: string | null
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData[]>
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const result = await prisma.coworking.findMany({
    select: {
      id: true,
      name: true,
      type: true,
    }
  })


  return res.status(201).json(result)
}