"use client";
import React, { useState } from "react";
import { EspacoCard } from "@/components/espacocard/espaco-card";
import { AddButton } from "@/components/addbutton/addbutton";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

export default function EspacosPage() {
  const [showEspacoCard, setShowEspacoCard] = useState(false);
  const [items, setItems] = useState<string[]>([]); // Lista de itens

  const handleAddClick = () => {
    setShowEspacoCard(true);
  };

  const handleClose = () => {
    setShowEspacoCard(false);
  };

  const handleCreateItem = (itemName: string) => {
    setItems([...items, itemName]);
    setShowEspacoCard(false);
  };

  return (
    <div className="relative p-4">
      <h1 className="text-3xl font-semibold">Usuários</h1>
      <p>
        Esta é a página para gestão de usuários. Você pode adicionar, editar ou
        remover espaços.
      </p>

      <ul className="mt-4 space-y-2">
        {items.map((item, index) => (
          <Link key={index} href={`espacos/${item}`}>
            <li className="p-4 border border-white rounded shadow-sm block">
              {item}
            </li>
          </Link>
        ))}
      </ul>

      {showEspacoCard && (
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
              <EspacoCard onCreate={handleCreateItem} />
            </div>
          </div>
        </div>
      )}

      <AddButton onClick={handleAddClick} />
    </div>
  );
}
