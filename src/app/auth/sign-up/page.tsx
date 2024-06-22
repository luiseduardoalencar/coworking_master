"use client";

import {  Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/http/api-client";
import { HTTPError } from "ky";

const schemaSignUp = z.object({
  email: z
    .string({ message: "Email obrigatorio!" })
    .email("Formato de e-mail inválido!"),
  password: z
    .string({ message: "Senha obrigatoria!" })
    .min(6, "A senha deve ter no minimo 6 caracteres"),
  name: z.string({ message: "Nome obrigatorio!" }),

  confirmPassword: z
    .string({ message: "Confirmar senha obrigatoria!" })
    .min(6, "A senha deve ter no minimo 6 caracteres"),
});

export default function SignUp() {
  const router = useRouter();

  type SchemaSignUp = z.infer<typeof schemaSignUp>;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isLoading },
  } = useForm<SchemaSignUp>({
    resolver: zodResolver(schemaSignUp),
  });

  const handleSignUp = async (data: SchemaSignUp) => {
    try {
      if (data.password !== data.confirmPassword) {
        return setError("confirmPassword", {
          message: "As senhas devem ser iguais",
        });
      }
  
      await api.post("/api/admin/create-admin", {
        method: "POST",
         json: data,
      }).json();
    } catch (error) {
      if (error instanceof HTTPError) {
        return setError("root", {
          message: error.message,
        });
      }
    }

    router.push("/auth/sign-in");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input {...register("name")} name="name" id="name" />

          {errors.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input {...register("email")} name="email" type="email" id="email" />

          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password")}
            name="password"
            type="password"
            id="password"
          />

          {errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirm your password</Label>
          <Input
            {...register("confirmPassword")}
            name="confirmPassword"
            type="password"
            id="confirmPassword"
          />

          {errors?.confirmPassword && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
          {errors.root && (
            <span className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.root?.message}
            </span>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Criar conta"
          )}
        </Button>

        <Button className="w-full" variant="link" size="sm" asChild>
          <Link href="/auth/sign-in">Ja possui uma conta?</Link>
        </Button>
      </form>
    </div>
  );
}
