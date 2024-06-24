"use client"
import React, { useState } from "react";
import { UserCard } from "@/components/usercard/user-card";
import { AddButton } from "@/components/addbutton/addbutton";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { DeleteButton } from "@/components/deletebutton/deletebutton";
import { EditUserModal } from "@/components/edit-user-modal/";

export default function UserPage() {
  const [showUserCard, setShowUserCard] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const { users, setUsers } = useUser();
  const [openModal, setOpenModal] = useState(false);

  const handleAddClick = () => {
    setShowUserCard(true);
  };

  const handleClose = () => {
    setShowUserCard(false);
    setSelectedUser(null);
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/delete-user?id=${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log("Usuário deletado com sucesso");
        setUsers(users.filter(user => user.id !== userId));
      } else {
        console.error('Erro ao deletar usuário');
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição de exclusão:', error);
    }
  };

   return (
    <div className="relative p-4">
      <h1 className="text-3xl font-semibold">Usuários</h1>
      <p>
        Esta é a página para gestão de usuários. Você pode adicionar, editar ou
        remover usuários.
      </p>

      <ul className="mt-4 space-y-2">
        {users.map((item) => (
          <li
            key={item.id}
            className="p-4 border border-gray-400 rounded shadow-sm flex justify-between items-center cursor-pointer"
            
          >
            <span>{item.name}</span>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setOpenModal(true)}>Editar</Button>
              <DeleteButton onClick={() => handleDeleteUser(item.id)} />
            </div>
            <EditUserModal user={item} openModal={openModal} setOpenModal={setOpenModal}  />
          </li>
        ))}
      </ul>

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