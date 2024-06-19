import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { addHours, subHours, parseISO } from 'date-fns';

interface ResponseData {
  message: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'PUT') {
    return res.status(405).end()
  }
  const  {seatOwnerId, coworkingId, bookingDate, busy, id}  = req.body
// console.log(seatOwnerId, bookingDate, busy, id, 'PUT SEAT');
try {
  const parsedBookingDate = parseISO(bookingDate);
  const oneHourBefore = subHours(parsedBookingDate, 1);
  const oneHourAfter = addHours(parsedBookingDate, 1);

  // Verificar se já existe uma reserva para o mesmo assento no intervalo de 1 hora
  const conflictingReservation = await prisma.reserve.findFirst({
    where: {
      seatId: String(id),
      booking_date: {
        gte: oneHourBefore.toISOString(),
        lte: oneHourAfter.toISOString(),
      }
    }
  });

  if (conflictingReservation) {
    return res.status(400).json({ status: 400, message: 'Não é possível reservar o assento neste horário devido a uma reserva existente no intervalo de 1 hora.' });
  }

  // Atualizar o estado do assento
  await prisma.seat.update({
    where: {
      id
    }, 
    data: {
      busy
    }
  });

  // Criar a nova reserva
  await prisma.reserve.create({
    data: {
      seatId: String(id),
      userId: String(seatOwnerId),
      booking_date: String(bookingDate),
      coworkingId
    }
  });

  return res.status(201).send({message: 'ok'});

} catch (error) {
  console.error('Error updating seat and reserving:', error);
  return res.status(500).json({ message: 'Internal server error' });
}
}