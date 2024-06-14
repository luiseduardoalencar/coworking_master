import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { fetchWrapper } from "@/lib/fetch";

interface EspacoCardProps {
  onClose: () => void;
}

const addCoworkingSpaceSchema = z.object({
  name: z.string().min(1, { message: "Nome obrigatório" }),
  type: z.string().min(1, { message: "Tipo obrigatório" }),
  seat : z.string().min(1, { message: "Assento obrigatório" }),
});

type CoworkingSpaceSchema = z.infer<typeof addCoworkingSpaceSchema>;

export function EspacoCard({ onClose }: EspacoCardProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CoworkingSpaceSchema>({
    resolver: zodResolver(addCoworkingSpaceSchema),
  });

  const handleRegisterSpace = async (data: CoworkingSpaceSchema) => {
    const init : RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
    try {
        await fetchWrapper("/api/coworking", init);
    } catch (error) {   
        console.error("Error:", error);
    }
    onClose();
    };

  // const handleCreate = () => {
  //     if (itemName.trim() !== '') {
  //         onCreate(itemName);
  //         setItemName('');
  //     }
  // };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Criar novo espaço</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleRegisterSpace)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input
                {...register("name")}
                id="name"
                placeholder="Nome do espaço"
                type="text"
              />
               {errors.name && <span>{errors.name.message}</span>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="espaco">Tipo de Espaço</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="espaco">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="coworking">Coworking</SelectItem>
                      <SelectItem value="confroom">
                        Sala de Conferência (indisp.)
                      </SelectItem>
                      <SelectItem value="estacionamento">
                        Estacionamento (indisp.)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <span>{errors.type.message}</span>}
              
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="seat">Assentos</Label>
              <Input
                {...register("seat")}
                id="seat"
                placeholder="Numero de assentos"
                type="number"
               
              />
               {errors.seat && <span>{errors.seat.message}</span>}
            </div>
        <CardFooter className="flex items-center justify-items-center mt-4">
            <Button type="submit"  className="w-full">Criar</Button>
        </CardFooter>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
