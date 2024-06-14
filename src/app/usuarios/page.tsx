"use client"
import React, { useState } from "react";
import { UserCard } from "@/components/usercard/user-card";
import { AddButton } from "@/components/addbutton/addbutton";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { DeleteButton } from "@/components/deletebutton/deletebutton";

export default function UserPage() {
  const [showUserCard, setShowUserCard] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const { users, setUsers } = useUser();

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

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleEditClick = (user) => {
    setSelectedUser(null);
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`/api/users/update-user?id=${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });
      if (response.ok) {
        console.log("Usuário atualizado com sucesso");

        const updatedUsers = users.map(user =>
          user.id === editingUser.id ? editingUser : user
        );
        setUsers(updatedUsers);
        handleClose();
      } else {
        console.error('Erro ao atualizar usuário');
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição de atualização:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };
  
  const UserEditForm = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="relative z-10 bg-slate-800 p-4 rounded shadow-lg max-w-md w-full">
        <Button
          className="h-7 w-7 p-0 absolute top-2 right-2 text-black p-2 rounded-full z-20"
          variant="ghost"
          onClick={handleClose}
        >
          <X size={15} />
        </Button>
        <h2 className="text-xl font-semibold mb-4 text-white">Editar Usuário</h2>
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-white">
              Nome:
              <input
                type="text"
                name="name"
                value={editingUser.name}
                onChange={handleChange}
                className="bg-slate-900 text-white border border-white rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </label>
            <label className="text-white">
              Email:
              <input
                type="email"
                name="email"
                value={editingUser.email}
                onChange={handleChange}
                className="bg-slate-900 text-white border border-white rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </label>
            <label className="text-white">
              Imagem URL:
              <input
                type="text"
                name="imageUrl"
                value={editingUser.imageUrl || ''}
                onChange={handleChange}
                className="bg-slate-900 text-white border border-white rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
              />
            </label>
            <label className="text-white">
              Nome da Startup:
              <input
                type="text"
                name="startupName"
                value={editingUser.startupName || ''}
                onChange={handleChange}
                className="bg-slate-900 text-white border border-white rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
              />
            </label>
            <label className="text-white">
              Telefone:
              <input
                type="text"
                name="phone"
                value={editingUser.phone || ''}
                onChange={handleChange}
                className="bg-slate-900 text-white border border-white rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
              />
            </label>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="solid" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

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
            className="p-4 border border-white rounded shadow-sm block flex justify-between items-center cursor-pointer"
            onClick={() => handleUserClick(item)}
          >
            <span>{item.name}</span>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => handleEditClick(item)}>Editar</Button>
              <DeleteButton onClick={() => handleDeleteUser(item.id)} />
            </div>
          </li>
        ))}
      </ul>

      {showUserCard && (
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
              <UserCard onClose={handleClose} />
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative bg-slate-700 p-4 rounded shadow-lg max-w-md w-full">
            <Button
              className="h-7 w-7 p-0 absolute top-2 right-2 text-black p-2 rounded-full z-20"
              variant="ghost"
              onClick={handleClose}
            >
              <X size={15} />
            </Button>
            <h2 className="text-xl  font-semibold mb-4">Detalhes do Usuário</h2>
            <p><strong>ID:</strong> {selectedUser.id}</p>
            <p><strong>Nome:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            {selectedUser.imageUrl && (
              <p><strong>Imagem:</strong> <img src={selectedUser.imageUrl} alt={selectedUser.name} /></p>
            )}
            {selectedUser.startupName && (
              <p><strong>Nome da Startup:</strong> {selectedUser.startupName}</p>
            )}
            {selectedUser.phone && (
              <p><strong>Telefone:</strong> {selectedUser.phone}</p>
            )}
          </div>
        </div>
      )}

      {editingUser && <UserEditForm />}

      <AddButton onClick={handleAddClick} />
    </div>
  );
}