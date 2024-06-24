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
import { fetchWrapper } from "@/lib/fetch";
import { getCookie } from "cookies-next";

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
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationSchema>({
    resolver: zodResolver(registrationSchema),
  });

  const handleRegisterUser = async (data: RegistrationSchema) => {
    console.log(data);
    
    const init: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(data),
    }
    try {
        await fetchWrapper("/api/users", init);
    } catch (error) {
      console.error("Error:", error);
    }
    onClose();
  };

  return (
    <Card className="w-[400px] rounded border-none">
      <CardHeader>
        <CardTitle className="text-center text-gray-300 text-xl">Registrar Nova Startup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleRegisterUser)} >
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
              <Button type="submit" className="w-full">Registrar</Button>
            </CardFooter>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
