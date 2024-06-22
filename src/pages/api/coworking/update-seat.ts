import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { addHours, subHours, parseISO } from "date-fns";

interface ResponseData {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "PUT") {
    return res.status(405).end();
  }
  const token = req.headers.authorization;
  console.log(token);
  
  const { seatOwnerId, coworkingId, startTime, endTime, busy, id } = req.body;
  try {
    // Verificar se o assento já está reservado no período solicitado
    const existingReservations = await prisma.reserve.findMany({
      where: {
        seatId: String(id),
        OR: [
          {
            startTime: {
              lte: endTime,
            },
            andTime: {
              gte: startTime,
            },
          },
        ],
      },
    });

    if (existingReservations.length > 0) {
      return res.status(400).json({ message: "Assento já reservado neste período" });
    }
    // Atualizar o estado do assento
    await prisma.seat.update({
      where: {
        id,
      },
      data: {
        busy,
      },
    });

    // Criar a nova reserva
    await prisma.reserve.create({
      data: {
        seatId: String(id),
        userId: String(seatOwnerId),
        startTime,
        andTime: endTime,
        coworkingId,
      },
    });

    return res.status(201).send({ message: "ok" });
  } catch (error) {
    console.error("Error updating seat and reserving:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
