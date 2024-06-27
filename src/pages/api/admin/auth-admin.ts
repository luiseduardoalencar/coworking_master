import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import AuthService from '@/auth/auth.service';
import { UserAlreadyExistsError } from '@/pages/erros/UserAlreadyExistsError';

type ResponseData = {
  message?: string;
  token?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, password } = req.body;

  try {
    const user = await prisma.userAdmin.findFirst({
      where: {
        email,
      },
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválido' });
    }
    
    const passwordHash = await bcrypt.compare(password, user.password);
    
    if (!passwordHash) {
      return res.status(401).json({ message: 'Email ou senha inválido' });
    }

    
    await AuthService.createSessionToken({ userId: user.id, role: user.role }, req, res);

    return res.status(200).json({ message: 'Autenticado com sucesso' });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
