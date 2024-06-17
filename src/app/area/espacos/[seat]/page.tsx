"use client";

import { ReserveModalSeat } from "@/components/reserve-modal-seat";
import { Button } from "@/components/ui/button";
import { fetchWrapper } from "@/lib/fetch";
import { X } from "lucide-react";
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
    const [showModalSeat, setShowModalSeat] = useState(false);
    const [selectedSeatId, setSelectedSeatId] = useState<string >('');


    const handleAddClick = (id: string) => {
        setSelectedSeatId(id);
      setShowModalSeat(true);
      };
    
      const handleClose = () => {
        setShowModalSeat(false);
      };

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
      
useEffect(() => {
    getSeats();
}, [])

    return (
        <div className="w-full text-center p-5">
        <h1>Espaços disponíveis</h1>
        <div className="  mt-16 grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2 justify-items-center">
           {seats.map((seat, index) => (
               <Button onClick={() => handleAddClick(seat.id)} key={seat.id}  className="bg-transparent hover:bg-transparent"> 
                    <div className={`w-7 h-7 flex items-center justify-center rounded-full ${seat.busy ? 'bg-blue-500' : 'bg-gray-100'}`}>{index}</div>
               </Button>
           ))}
        </div>
        { showModalSeat && (
           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
           <div className="relative z-10 flex flex-col items-center justify-center">
             <Button
               className="h-7 w-7 p-0 absolute top-2 right-2 text-white p-2 rounded-full z-20"
               variant="ghost"
               onClick={handleClose}
             >
               <X size={15} />
             </Button>
             <div className="w-full h-full flex items-center justify-center">
               <ReserveModalSeat onClose={handleClose} seatId={selectedSeatId}  />
             </div>
           </div>
         </div>
        )}
        
    </div>
    );
}
