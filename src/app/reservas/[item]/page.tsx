"use client";

import { format, parseISO } from 'date-fns';
import { fetchWrapper } from "@/lib/fetch";
import { useEffect, useState } from "react";

interface ParamsProps {
  params: {
    item: string;
  };
}
interface ReservationsData {
  booking_date: string;
  seat: {
    seatNumber: string;
  };
  user: {
    name: string;
  };
}
export default function ReservaPage({params}: ParamsProps) {
  const [reservations, setReservations] = useState<ReservationsData[]>([]);
  const getReserves = async () => {
    try {
      const response = await fetchWrapper<ReservationsData[]>(
        "/api/reservetions/get-reservetions",
        {
          headers: {
            coworkingId: params.item,
          },
        }
      );
      setReservations(response);
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
    }
  };

useEffect(() => {
  getReserves();
}, []);
console.log(reservations);

  return (
    <div className='flex items-center justify-center gap-2'>
      {reservations.map((reservation) => (
        <div  key={reservation.booking_date} className='flex flex-col border p-2 rounded'>
          <p className='font-bold'>{reservation.user.name}</p>
          <p className='text-emerald-500'>Assento: {reservation.seat.seatNumber}</p>
          <p>{format(parseISO(reservation.booking_date), "dd/MM - HH:mm'h'")}</p>
        </div>
      ))}
 
 </div>
  );
}
