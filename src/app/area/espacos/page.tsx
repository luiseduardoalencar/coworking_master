"use client";
import React, { useState } from "react";
import { EspacoCard } from "@/components/espacocard/espaco-card";
import { AddButton } from "@/components/addbutton/addbutton";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { useEspaco } from "@/context/EspacoContext";

export default function EspacosPage() {
  const [showEspacoCard, setShowEspacoCard] = useState(false);
  const { espacos, deleteEspaco } = useEspaco();

  const handleAddClick = () => {
    setShowEspacoCard(true);
  };

  const handleClose = () => {
    setShowEspacoCard(false);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await deleteEspaco(id);
    } catch (error) {
      alert("Algo deu errado!");
    }
  };

  return (
    <div className="relative p-4">
      <h1 className="text-3xl font-semibold">Espaços</h1>
      <p>
        Esta é a página para gestão de espaços. Você pode adicionar, editar ou
        remover espaços.
      </p>

      {espacos.length === 0 ? (
        <div className='flex justify-center items-center h-64'>
          <p className='text-lg text-gray-500'>Nenhum espaço encontrado</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {espacos.map((item) => (
            <li
              key={item.id}
              className="p-4 border border-white rounded shadow-sm flex justify-between items-center"
            >
              <span>{item.name}</span>
              <div className="flex space-x-2">
                <Link href={`/area/espacos/${item.id}`}>
                  <Button variant="outline">Editar</Button>
                </Link>
                <Button variant="link" onClick={() => handleDeleteClick(item.id)}>Excluir</Button>
                <Link href={`/area/espacos/${item.id}`}>
                  <Button variant="link">Reservar</Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showEspacoCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative z-10 flex flex-col items-center justify-center">
            <Button
              className="h-7 w-7 p-0 absolute top-2 right-2 text-white rounded-full z-20"
              variant="ghost"
              onClick={handleClose}
            >
              <X size={15} />
            </Button>
            <div className="w-full h-full flex items-center justify-center">
              <EspacoCard onClose={handleClose} />
            </div>
          </div>
        </div>
      )}

      <AddButton onClick={handleAddClick} />
    </div>
  );
}
