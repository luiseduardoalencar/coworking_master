import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { UserAlreadyExistsError } from '@/pages/erros/UserAlreadyExistsError'

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

  const { name, email, password } = req.body


  try {
    
    const emailExists = await prisma.userAdmin.findFirst({
      where: {
        email,
      },
    })
    if (emailExists) {
     return res.status(400).json({message: 'Usuario ja castado!'})
    }
    
    const saltRounds = 10; 
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
     await prisma.userAdmin.create({
      data: {
        name,
        email,
        password: passwordHash,   
      },
    })
    return res.status(201).json({message: 'Admin criado com sucesso'})
  } catch (error) {
    console.error('Erro ao criar admin:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
    
  }
}

