"use client";
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { fetchWrapper } from '@/lib/fetch';

interface EspacoData {
  id: string;
  name: string;
  type: string;
  imageUrl?: string | null;
}

interface EspacoContextProps {
  espacos: EspacoData[];
  setEspacos: React.Dispatch<React.SetStateAction<EspacoData[]>>;
  deleteEspaco: (id: string) => Promise<void>;
}

const EspacoContext = createContext<EspacoContextProps | undefined>(undefined);

export const EspacoProvider = ({ children }: { children: ReactNode }) => {
  const [espacos, setEspacos] = useState<EspacoData[]>([]);

  const getEspacos = async () => {
    try {
      const response = await fetchWrapper<EspacoData[]>("/api/coworking/get-coworkings");
      setEspacos(response);
    } catch (error) {
      console.error('Erro ao buscar espaços:', error);
    }
  };

  const deleteEspaco = async (id: string) => {
    try {
      const response = await fetchWrapper<{ message: string }>("/api/coworking/delete-coworking", {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (response.message === "Coworking space deleted successfully") {
        setEspacos((prevEspacos) => prevEspacos.filter((espaco) => espaco.id !== id));
        alert("Confirmado!");
      } else {
        alert("Algo deu errado!");
      }
    } catch (error) {
      console.error("Erro ao deletar espaço:", error);
      alert("Algo deu errado!");
    }
  };

  useEffect(() => {
    getEspacos();
  }, []);

  return (
    <EspacoContext.Provider value={{ espacos, setEspacos, deleteEspaco }}>
      {children}
    </EspacoContext.Provider>
  );
};

export const useEspaco = () => {
  const context = useContext(EspacoContext);
  if (!context) {
    throw new Error('useEspaco must be used within a EspacoProvider');
  }
  return context;
};
