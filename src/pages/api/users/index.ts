import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, email, imageUrl, } = req.body
  await prisma.user.create({
    data: {
      name,
      email,
      imageUrl
    }
  })

  return res.status(201).json({ message: 'User created successfully' })
}