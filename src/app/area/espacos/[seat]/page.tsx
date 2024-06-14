"use client";

import { Button } from "@/components/ui/button";
import { fetchWrapper } from "@/lib/fetch";
import { useEffect, useState } from "react";

interface Props {
  params: { seat: string }
}

interface ResponseSeats {
    id: string
    seatOwner?: string | null
    coworkingId: string 
    busy: boolean
  }

export default function ReservasDisponiveis({params}: Props) {
    const [seats, setSeats] = useState<ResponseSeats[]>([]);
    const getSeats = async () => {
        try {
          const response = await fetchWrapper<ResponseSeats[]>(`/api/coworking/get-seats`, {
            headers: {
              'coworkingId': params.seat
            }
          }); 
          setSeats(response);
        } catch (error) {
          console.error("Failed to fetch espacos:", error);
          
        }
      }  
      console.log(seats);
      
useEffect(() => {
    getSeats();
}, [])

const handleRegisterSeat = async () => {

}

    return (
        <div className="w-full text-center p-5">
        <h1>Espaços disponíveis</h1>
        <div className="  mt-16 grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2 justify-items-center">
           {seats.map((seat) => (
               <Button key={seat.id} onClick={handleRegisterSeat} className="bg-transparent hover:bg-transparent"> 
                    <div className={`w-7 h-7 rounded-full ${seat.busy ? 'bg-blue-500' : 'bg-gray-100'}`}/>
               </Button>
           ))}
        </div>
    </div>
    );
}
