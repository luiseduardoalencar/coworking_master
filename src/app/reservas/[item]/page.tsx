"use client";

import { format, parseISO, isBefore } from 'date-fns';
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
      const now = new Date();
      const upcomingReservations = response.filter(reservation => !isBefore(parseISO(reservation.booking_date), now));
      setReservations(upcomingReservations);
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
    }
  };

useEffect(() => {
  getReserves();
}, []);
console.log(reservations);

  return (
    <div className="container mx-auto px-4">
      <h1 className='text-3xl font-bold text-center my-10'>Reservas</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {reservations.map((reservation) => (
          <div key={reservation.booking_date} className='flex flex-col border p-4 rounded shadow-md'>
            <p className='font-bold'>{reservation.user.name}</p>
            <p className='text-emerald-500'>Assento: {reservation.seat.seatNumber}</p>
            <p>{format(parseISO(reservation.booking_date), "dd/MM - HH:mm'h'")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
