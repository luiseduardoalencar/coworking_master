"use client"

import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { fetchWrapper } from '@/lib/fetch';

interface ResponseData {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  startupName?: string | null;
  phone?: string | null;
}

interface UserContextProps {
  users: ResponseData[];
  setUsers: React.Dispatch<React.SetStateAction<ResponseData[]>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<ResponseData[]>([]);

  const getUsers = async () => {
    try {
      const response = await fetchWrapper<ResponseData[]>("/api/users/get-users");
      setUsers(response);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, setUsers }}>
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
