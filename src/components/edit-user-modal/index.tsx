import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { fetchWrapper } from "@/lib/fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUser, UsersRequestData } from "@/http/update-user";

const userSchemaBody = z.object({
  id: z.string().optional().nullable(),
  name: z.string(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Email inválido" }),
  imageUrl: z.string().optional(),
  startupName: z.string().optional(),
});

type UserSchema = z.infer<typeof userSchemaBody>;

interface EditAddressModalProps {
  setOpenModal: (value: boolean) => void;
  openModal: boolean;
  user: UserSchema;
}

export const EditUserModal = ({
  user,
  setOpenModal,
  openModal,
}: EditAddressModalProps) => {

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchema>({
    resolver: zodResolver(userSchemaBody),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      email: user.email,
      imageUrl: user.imageUrl,
      startupName: user.startupName,
    },
  });

  const queryClient = useQueryClient();
  const { mutateAsync: updateUser } = useMutation({
    mutationFn: UpdateUser,
    async onSuccess(_, data) {
      queryClient.setQueryData<UsersRequestData[]>(["users"], (oldData:any) => {
        if (!oldData) return [];
        return oldData.map((userData:any) =>
          userData.id === user.id
            ? { ...userData, name: data.name }
            : userData
        );
      });
    },
  });

  const handleEditUserForm = async (data: UserSchema) => {
    try {
      await updateUser({
        name: data.name,
        phone: data.phone,
        email: data.email,
        imageUrl: data.imageUrl,
        startupName: data.startupName,
        id: user.id
      });
      setOpenModal(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <>
      <Dialog.Root open={openModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed w-screen h-screen inset-0 bg-black/50" />
          <Dialog.Content className="w-[400px] rounded py-5 flex flex-col items-center bg-card fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <Dialog.Close
              onClick={() => setOpenModal(false)}
              className="absolute bg-transparent border-spacing-0 top-5 right-5 text-gray-300 line-through "
            >
              <X size={24} color="#f2f2f2" />
            </Dialog.Close>
            <Dialog.Title className="text-gray-600 font-semibold text-xl">
              Editar Usuário
            </Dialog.Title>
            <form
              onSubmit={handleSubmit(handleEditUserForm)}
              className="w-10/12 flex flex-col items-start gap-3 justify-start  mx-5"
            >
              <Label className="text-gray-100">Nome</Label>
              <Input
                className="w-full rounded-2xl text-gray-300 placeholder:text-gray-400"
                placeholder="Nome completo"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
              <Label className="text-gray-200">Email</Label>
              <Input
                className="w-full rounded-2xl text-gray-300 placeholder:text-gray-400"
                placeholder="Email"
                {...register("email")}
              />
              <Label className="text-gray-200">Telefone</Label>
              <Input
                className="w-full rounded-2xl text-gray-300 placeholder:text-gray-400"
                placeholder="Telefone"
                {...register("phone")}
              />
              <Label className="text-gray-200">Nome da Startup</Label>
              <Input
                className="w-full rounded-2xl text-gray-300 placeholder:text-gray-400"
                placeholder="Nome da Startup"
                {...register("startupName")}
              />
              <Label className="text-gray-200">Imagem</Label>
              <Input
                className="w-full rounded-2xl text-gray-300 placeholder:text-gray-400"
                placeholder="https://..."
                {...register("imageUrl")}
              />
              <Button
                onClick={() => setOpenModal(true)}
                className="w-full bg-blue-500 "
                type="submit"
              >
                {" "}
                Salvar
              </Button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
