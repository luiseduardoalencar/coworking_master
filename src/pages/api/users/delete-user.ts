import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const userId = req.query.id as string;

  if (!userId) {
    return res.status(400).json({ message: 'ID do usuário é necessário' });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro interno ao deletar usuário' });
  }
}
