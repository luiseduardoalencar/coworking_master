import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getCookie } from "cookies-next";
import { api } from "@/http/api-client";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { CreateUser } from "@/http/create-user";
import { queryClient } from "@/lib/react-query";
import { UsersResponseData } from "@/http/get-users";

interface UserCardProps {
  onClose: () => void;
}

const registrationSchema = z.object({
  name: z.string().min(1, { message: "Nome obrigatório" }),
  startupName: z.string().min(1, { message: "Nome da Startup obrigatório" }),
  phone: z.string().min(1, { message: "Telefone obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  imageUrl: z.string().optional(),
});

type RegistrationSchema = z.infer<typeof registrationSchema>;

export function UserCard({ onClose }: UserCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationSchema>({
    resolver: zodResolver(registrationSchema),
  });
  const { mutateAsync: createUser } = useMutation({
    mutationFn: CreateUser,
    onSuccess(_, data) {
      const cashed = queryClient.getQueryData<UsersResponseData[]>(["users"]);
      if (cashed) {
        queryClient.setQueryData<any[]>(
          ["users"],
          [...cashed, data]
        );
      }
    },
  });

  const handleRegisterUser = async (data: RegistrationSchema) => {
    try {
      await createUser(data);
      toast.success("Usário criado com sucesso");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao criar o usuário");
    }
    onClose();
  };

  return (
    <Card className="w-[400px] rounded border-none">
      <CardHeader>
        <CardTitle className="text-center text-gray-300 text-xl">
          Registrar Nova Startup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleRegisterUser)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input
                {...register("name")}
                id="name"
                placeholder="Nome completo"
                type="text"
              />
              {errors.name && <span>{errors.name.message}</span>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="startupName">Nome da Startup</Label>
              <Input
                {...register("startupName")}
                id="startupName"
                placeholder="Nome da Startup"
                type="text"
              />
              {errors.startupName && <span>{errors.startupName.message}</span>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                {...register("phone")}
                id="phone"
                placeholder="Telefone com DDD"
                type="text"
              />
              {errors.phone && <span>{errors.phone.message}</span>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email")}
                id="email"
                placeholder="Email"
                type="email"
              />
              {errors.email && <span>{errors.email.message}</span>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                {...register("imageUrl")}
                id="imageUrl"
                placeholder="URL da imagem"
                type="url"
              />
              {errors.imageUrl && <span>{errors.imageUrl.message}</span>}
            </div>
            <CardFooter className="max-w-full">
              <Button type="submit" className="w-full">
                Registrar
              </Button>
            </CardFooter>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
