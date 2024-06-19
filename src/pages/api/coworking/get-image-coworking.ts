import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {
  id: string;
  imagePath: string | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  const coworkingId = req.headers["coworkingid"] as string;

  if (!coworkingId) {
    return res.status(400).end();
  }

  try {
    const result = await prisma.imageCoworking.findFirstOrThrow({
      where: {
        coworkingId,
      },
      select: {
        id: true,
        imagePath: true,
      },
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).end();
  }
}
