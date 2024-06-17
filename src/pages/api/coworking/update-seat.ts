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
  const  {seatOwner, busy, id}  = req.body

console.log(seatOwner, busy, id, "PUT SEAT");

  await prisma.seat.update({
   where: {
     id
   }, data: {
    seatOwner,
    busy
   }
  })


  return res.status(201).json({message: 'Seat updated successfully'})
}