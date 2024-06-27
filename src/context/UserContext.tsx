"use client"

import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { fetchWrapper } from '@/lib/fetch';



interface ReservationsData {
  booking_date: string;
  seat: {
    seatNumber: string;
  };
  user: {
    name: string;
  };
}

interface UserContextProps {
  reservations: ReservationsData[];
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  
  const [reservations, setReservations] = useState<ReservationsData[]>([]);


  const getReserves = async () => {
    try {
      const response = await fetchWrapper<ReservationsData[]>("/api/reservations/get-reservations", {
        headers: {
          'coworkingId': '1'
        }
      });
      setReservations(response);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
    }
  };

  useEffect(() => {
    getReserves();
  }, []);

  return (
    <UserContext.Provider value={{ reservations }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
