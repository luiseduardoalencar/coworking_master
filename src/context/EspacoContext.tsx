"use client"
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface EspacoContextProps {
    espacos: string[];
    addEspaco: (espaco: string) => void;
}

const EspacoContext = createContext<EspacoContextProps | undefined>(undefined);

export const EspacoProvider = ({ children }: { children: ReactNode }) => {
    const [espacos, setEspacos] = useState<string[]>([]);

    const addEspaco = (espaco: string) => {
        setEspacos(prev => [...prev, espaco]);
    };

    return (
        <EspacoContext.Provider value={{ espacos, addEspaco }}>
            {children}
        </EspacoContext.Provider>
    );
};

export const useEspaco = () => {
    const context = useContext(EspacoContext);
    if (!context) {
        throw new Error('useEspaco must be used within an EspacoProvider');
    }
    return context;
};
