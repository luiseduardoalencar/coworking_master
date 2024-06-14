"use client";
import { fetchWrapper } from "@/lib/fetch";
import { get } from "http";
import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

interface ResponseData {
  id: string;
  name: string;
  type: string;
  imageUrl?: string | null;
}



interface EspacoContextProps {
  espacos: ResponseData[];
}

const EspacoContext = createContext<EspacoContextProps | undefined>(undefined);

export const EspacoProvider = ({ children }: { children: ReactNode }) => {
  const [espacos, setEspacos] = useState<ResponseData[]>([]);
  const getEspaco = async () => {
    try {
      const response = await fetchWrapper<ResponseData[]>("/api/coworking/get-coworkings");
      setEspacos(response); // Concatenar arrays corretamente
    } catch (error) {
      console.error("Failed to fetch espacos:", error);
    }
  };

  

  useEffect(() => {
    getEspaco();
  }, [])
  //api/coworking/get-coworkings
  return (
    <EspacoContext.Provider value={{ espacos }}>
      {children}
    </EspacoContext.Provider>
  );
};

export const useEspaco = () => {
  const context = useContext(EspacoContext);
  if (!context) {
    throw new Error("useEspaco must be used within an EspacoProvider");
  }
  return context;
};
