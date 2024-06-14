import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  imageUrl?: string | null;
  startupName?: string | null;
  phone?: string | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
    return res.status(405).json({ message: "Método não permitido" }); 
  }

  const { id, ...data }: UpdateUserRequest = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID do usuário não fornecido" }); 
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    return res.status(200).json({ message: "Usuário atualizado com sucesso", user: updatedUser });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ message: "Erro ao atualizar usuário" }); 
  }
}
