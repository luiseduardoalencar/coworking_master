"use client"

import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { fetchWrapper } from '@/lib/fetch';

interface ResponseData {
  id: string;
  name: string;
  email: string;
  startupName?: string;
  phone?: string ;
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

interface UserContextProps {
  users: ResponseData[];
  setUsers: React.Dispatch<React.SetStateAction<ResponseData[]>>;
  reservations: ReservationsData[];
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<ResponseData[]>([]);
  const [reservations, setReservations] = useState<ReservationsData[]>([]);
  const getUsers = async () => {
    try {
      const response = await fetchWrapper<ResponseData[]>("/api/users/get-users");
      setUsers(response);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

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
    getUsers();
    getReserves();
  }, []);

  return (
    <UserContext.Provider value={{ users, setUsers, reservations }}>
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
