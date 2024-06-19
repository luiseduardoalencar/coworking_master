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
import Image from "next/image";

interface EspacoCardProps {
  onClose: () => void;
}

const addCoworkingSpaceSchema = z.object({
  name: z.string().min(1, { message: "Nome obrigatório" }),
  type: z.string().min(1, { message: "Tipo obrigatório" }),
  seat : z.string().min(1, { message: "Assento obrigatório" }),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, { message: "Imagem deve ter no máximo 5MB" }),
});

type CoworkingSpaceSchema = z.infer<typeof addCoworkingSpaceSchema>;

export function EspacoCard({ onClose }: EspacoCardProps) {
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CoworkingSpaceSchema>({
    resolver: zodResolver(addCoworkingSpaceSchema),
  });

  const handleRegisterSpace = async (data: CoworkingSpaceSchema) => {
  
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("myImage", selectedFile);

 const init: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
    try {
      const {id}: any  = await fetchWrapper("/api/coworking", init);
    
      
      await fetchWrapper(`/api/coworking/save-image-coworking`, {
        method: "POST",
        headers: {
          id 
        },
        body: formData
      });
    } catch (error) {
      console.error("Error:", error);
    }
    onClose();
    };
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Criar novo espaço</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleRegisterSpace)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="image">Imagem</Label>
              <Input
          type="file"
          hidden
          onChange={({ target }) => {
            if (target.files) {
              const file = target.files[0];
              setSelectedImage(URL.createObjectURL(file));
              setSelectedFile(file);
              setValue("image", file);
            }
          }}
        />
              
              {errors.image && <span>{errors.image.message}</span>}
              {selectedImage && <Image src={selectedImage} width={400} height={400} alt="Preview" className="mt-2 max-h-64" />}
            </div>
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
