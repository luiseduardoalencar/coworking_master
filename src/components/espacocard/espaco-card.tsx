import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  CardFooter,
} from "@/components/ui/card";
import * as Dialog from "@radix-ui/react-dialog";
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
import { toast } from "sonner";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateSpace } from "@/http/create-space";
import { SpaceResponseData } from "@/http/get-spaces";

interface CreateSpaceModalProps {
  setOpenModal: (value: boolean) => void;
  openModal: boolean;
}

const addCoworkingSpaceSchema = z.object({
  name: z.string().min(1, { message: "Nome obrigatório" }),
  type: z.string().min(1, { message: "Tipo obrigatório" }),
  seat: z.string().min(1, { message: "Assento obrigatório" }),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Imagem deve ter no máximo 5MB",
    }),
});

type CoworkingSpaceSchema = z.infer<typeof addCoworkingSpaceSchema>;

export function EspacoCard({ openModal, setOpenModal }: CreateSpaceModalProps) {
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
  const queryClient = useQueryClient();
  const { mutateAsync: createSpace } = useMutation({
    mutationFn: CreateSpace,
    async onSuccess (_, data) {
      const cashed = queryClient.getQueryData<SpaceResponseData[]>(["spaces"]);
      if (cashed) {
        queryClient.setQueryData<SpaceResponseData[]>(
          ["spaces"],
          [...cashed, data]
        );
      }
      setOpenModal(false);
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Erro ao criar espaço");
    },
  
  });

  const handleRegisterSpace = async (data: CoworkingSpaceSchema) => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("myImage", selectedFile);
    try {
      const { id } = await createSpace(data);
      await fetchWrapper(`/api/coworking/save-image-coworking`, {
        method: "POST",
        headers: {
          id,
        },
        body: formData,
      });
      toast.success("Espaço criado com sucesso");
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
            <div className="flex justify-between my-5">
              <Dialog.Close
                onClick={() => setOpenModal(false)}
                className="absolute bg-transparent border-spacing-0 top-5 right-5 text-gray-300 line-through "
              >
                <X size={24} color="#f2f2f2" />
              </Dialog.Close>
              <Dialog.Title className="text-gray-300 font-semibold text-xl">
                Criar Espaço
              </Dialog.Title>
            </div>
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
                    {selectedImage && (
                      <Image
                        src={selectedImage}
                        width={350}
                        height={350}
                        alt="Preview"
                        className="mt-2 max-h-64"
                      />
                    )}
                  </div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    {...register("name")}
                    id="name"
                    placeholder="Nome do espaço"
                    type="text"
                  />
                  {errors.name && <span className="text-red-500">{errors.name.message}</span>}
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
                  {errors.seat && <span className="text-red-500">{errors.seat.message}</span>}
                </div>
                <CardFooter className="flex items-center justify-items-center mt-4">
                  <Button type="submit" className="w-full">
                    Criar
                  </Button>
                </CardFooter>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
