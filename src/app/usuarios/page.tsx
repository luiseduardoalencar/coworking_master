"use client";
import React, { useState } from "react";
import { UserCard } from "@/components/usercard/user-card";
import { AddButton } from "@/components/addbutton/addbutton";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DeleteButton } from "@/components/deletebutton/deletebutton";
import { EditUserModal } from "@/components/edit-user-modal/";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "@/http/get-users";
import { DeleteUser } from "@/http/delete-user";
import { toast } from "sonner";

export default function UserPage() {
  const [showUserCard, setShowUserCard] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  const handleAddClick = () => {
    setShowUserCard(true);
  };

  const handleClose = () => {
    setShowUserCard(false);
    setSelectedUser(null);
    setEditingUser(null);
  };
  const queryClient = useQueryClient();

  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: DeleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usário removido com sucesso");
    },
  });

  return (
    <div className="relative p-4">
      <h1 className="text-3xl font-semibold">Usuários</h1>
      <p>
        Esta é a página para gestão de usuários. Você pode adicionar, editar ou
        remover usuários.
      </p>

      {isUsersLoading ? (
        <div className="flex justify-center items-center h-64">
          <h2>Carregando usuários...</h2>
        </div>
      ) : !users || users.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <h2>Ainda não existem usuários cadastrados</h2>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {users.map((item) => (
            <li
              key={item.id}
              className="p-4 border border-gray-400 rounded shadow-sm flex justify-between items-center cursor-pointer"
            >
              <span>{item.name}</span>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setOpenModal(true)}>
                  Editar
                </Button>
                <DeleteButton onClick={() => deleteUser(item.id)} />
              </div>
              <EditUserModal
                user={item}
                openModal={openModal}
                setOpenModal={setOpenModal}
              />
            </li>
          ))}
        </ul>
      )}

      {showUserCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative z-10 flex flex-col items-center justify-center">
            <Button
              className="mt-3 p-0 rounded-s-full absolute top-2 right-4 text-white z-20 hover:bg-transparent"
              variant="ghost"
              onClick={handleClose}
            >
              <X size={25} />
            </Button>
            <div className="w-full h-full flex items-center justify-center">
              <UserCard onClose={handleClose} />
            </div>
          </div>
        </div>
      )}

      <AddButton onClick={handleAddClick} />
    </div>
  );
}
