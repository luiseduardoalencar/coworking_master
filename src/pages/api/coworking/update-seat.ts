import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
 
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
const existingReservation = await prisma.reserve.findFirst({
  where: {
    seatId: String(id),
    booking_date: String(bookingDate),
  }
});

if (existingReservation) {
  return res.status(400).json({ message: 'A reserva já existe para esta data e espaço' });
}
  await prisma.seat.update({
   where: {
     id
   }, data: {
    busy
   }
  })

  await prisma.reserve.create({
    data:{
      seatId: String(id),
      userId: String(seatOwnerId),
      booking_date: String(bookingDate),
      coworkingId
    }
  })


  return res.status(201).json({message: 'Seat updated successfully'})
}