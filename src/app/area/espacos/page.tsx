"use client";
import React, { useState } from "react";
import { EspacoCard } from "@/components/espacocard/espaco-card";
import { AddButton } from "@/components/addbutton/addbutton";
import { Button } from "@/components/ui/button";
import { LoaderCircle, X } from "lucide-react";
import Link from "next/link";
import { useEspaco } from "@/context/EspacoContext";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetSpaces } from "@/http/get-spaces";
import { DeleteSpace } from "@/http/delete-space";

export default function EspacosPage() {
  const { deleteEspaco } = useEspaco();
  const [openModal, setOpenModal] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: deleteSapce } = useMutation({
    mutationFn: DeleteSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      toast.success("Espaço removido com sucesso");
    },
  });

  const handleDeleteClick = async (id: string) => {
    try {
      await deleteSapce(id);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const { data: spaces, isLoading: isSpacesLoading } = useQuery({
    queryKey: ["spaces"],
    queryFn: GetSpaces,
  });

  return (
    <div className="relative p-4">
      <h1 className="text-3xl font-semibold">Espaços</h1>
      <p>
        Esta é a página para gestão de espaços. Você pode adicionar, editar ou
        remover espaços.
      </p>
      {isSpacesLoading ? (
        <div className="flex justify-center items-center h-screen">
          <LoaderCircle size={24} className="animate-spin" />
        </div>
      ) : !spaces || spaces.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <h2>Ainda não existem espacos cadastrados</h2>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {spaces.map((item) => (
            <li
              key={item.id}
              className="p-4 border border-white rounded shadow-sm flex justify-between items-center"
            >
              <span>{item.name}</span>
              <div className="flex space-x-2">
                <Link href={`/area/espacos/${item.id}`}>
                  <Button variant="outline">Editar</Button>
                </Link>
                <Button
                  variant="link"
                  onClick={() => handleDeleteClick(item.id ? item.id : "")}
                >
                  Excluir
                </Button>
                <Link href={`/area/espacos/${item.id}`}>
                  <Button variant="link">Reservar</Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <EspacoCard openModal={openModal} setOpenModal={setOpenModal} />

      <AddButton onClick={() => setOpenModal(true)} />
    </div>
  );
}
