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

  const token = req.headers.authorization
  console.log(token), "AUTHOR";
  
  const { name, email, imageUrl, startupName, phone } = req.body


  const result = await prisma.user.create({

    data: {
      name,
      email,
      imageUrl,
      startupName, 
      phone       
    },
    select:{
      id:true,
    }
  })
  return res.status(201).json(result)
}
