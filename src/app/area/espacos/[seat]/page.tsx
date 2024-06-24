"use client";

import { ReserveModalSeat } from "@/components/reserve-modal-seat";
import { Button } from "@/components/ui/button";
import { fetchWrapper } from "@/lib/fetch";
import { LoaderCircle, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  params: { seat: string }
}
interface ResponseImagePath {
  imagePath: string
  id: string
}

interface ResponseSeats {
  id: string
  seatNumber: string
  coworkingId: string 
  busy: boolean
}

export default function ReservasDisponiveis({params}: Props) {
  const [seats, setSeats] = useState<ResponseSeats[]>([]);
  const [showModalSeat, setShowModalSeat] = useState(false);
  const [selectedSeatId, setSelectedSeatId] = useState<string>('');
  const [imagePath, setImagePath] = useState<ResponseImagePath>();
  const [loading, setLoading] = useState(true); 

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
      const imagePath = await fetchWrapper<ResponseImagePath>('/api/coworking/get-image-coworking', {
        headers: {
          'coworkingId': params.seat
        }
      });
      setSeats(response);
      setImagePath(imagePath);
    } catch (error) {
      console.error("Failed to fetch espacos:", error);
    } finally {
      setLoading(false); 
    }
  };
      
  useEffect(() => {
    getSeats();
  }, []);
  
  return (
    <div className="w-full text-center p-5">
      <h1 className="text-2xl font-semibold">Espaços disponíveis</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <LoaderCircle size={24} className="animate-spin"/>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-2 justify-items-center">
              {seats.map((seat) => (
                <Button onClick={() => handleAddClick(seat.id)} key={seat.id} className="bg-transparent hover:bg-transparent"> 
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full ${seat.busy ? 'bg-blue-500' : 'bg-gray-100'}`}>{seat.seatNumber}</div>
                </Button>
              ))}
            </div>
          </div>
          {imagePath && (
            <div className="flex justify-center items-center">
              <Image
                alt="Coworking space"
                src={imagePath.imagePath.startsWith("/images") ? imagePath.imagePath : `/images/${imagePath.imagePath}`}
                width={600}
                height={600}
                className="object-contain"
              />
            </div>
          )}
        </div>
      )}
      {showModalSeat && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative z-10 flex flex-col items-center justify-center">
            <Button
              className=" absolute top-4 right-2 text-white p-2 rounded-full z-20"
              variant="ghost"
              onClick={handleClose}
            >
              <X size={25} />
            </Button>
            <div className="w-full h-full flex items-center justify-center">
              <ReserveModalSeat onClose={handleClose} seatId={selectedSeatId} coworkingId={params.seat} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
