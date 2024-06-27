import { prisma } from "@/lib/prisma";
import { UserAlreadyExistsError } from "../../erros/UserAlreadyExistsError";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  id?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, email, imageUrl, startupName, phone } = req.body;

  try {
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError({message: "User already exists", statusCode: 400});
    }

    const result = await prisma.user.create({
      data: {
        name,
        email,
        imageUrl,
        startupName,
        phone,
      },
      select: {
        id: true,
      },
    });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
