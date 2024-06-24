import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { seatOwnerId, coworkingId, startTime, endTime, busy, id } = req.body;

  if (!seatOwnerId || !coworkingId || !startTime || !endTime || !id || typeof busy !== "boolean") {
    return res.status(400).json({ message: "Parâmetros inválidos" });
  }

  const start = new Date(startTime).toISOString();
  const end = new Date(endTime).toISOString();

  try {
    await prisma.$transaction(async (prisma) => {
      // Verificar se o assento já está reservado no período solicitado
      const existingReservations = await prisma.reserve.findMany({
        where: {
          seatId: String(id),
          OR: [
            {
              startTime: { lte: end },
              andTime: { gte: start },
            },
          ],
        },
      });

      if (existingReservations.length > 0) {
        throw new Error("Assento já reservado neste período");
      }

      // Atualizar o estado do assento
      await prisma.seat.update({
        where: { id },
        data: { busy },
      });

      // Criar a nova reserva
      await prisma.reserve.create({
        data: {
          seatId: String(id),
          userId: String(seatOwnerId),
          startTime: start,
          andTime: end,
          coworkingId,
        },
      });
    });

    return res.status(201).json({ message: "Reserva criada com sucesso" });
  } catch (error ) {
    console.error("Erro ao atualizar o assento e criar reserva:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
