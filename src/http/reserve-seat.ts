import { api } from "./api-client";

interface reserveSeatRequest {
  seatOwnerId: string;
  busy: boolean;
  bookingDate: string;
  id: string;
  coworkingId: string;
}


export async function reserveSeat({ seatOwnerId, busy, bookingDate, id, coworkingId }: reserveSeatRequest) {
  const response = await api.post('/api/coworking/update-seat', {
    json: {
      seatOwnerId,
      busy,
      bookingDate,
      id,
      coworkingId
    }
  })
  return response
}