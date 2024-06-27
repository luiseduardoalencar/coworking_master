import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  startupName?: string | null;
  phone?: string | null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData[]>
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: false,
      startupName: true,
      phone: true,
    },
  });
  res.status(200).json(result);
}
