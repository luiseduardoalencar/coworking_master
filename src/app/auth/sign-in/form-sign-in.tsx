'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/http/api-client'
import { HTTPError } from 'ky'
import { useMutation } from '@tanstack/react-query'
import { signIn } from '@/http/sign-in'

const schemaSignIn = z.object({
  email: z
    .string({message: 'Email obrigatorio!'})
    .email('Formato de e-mail inválido!'),
  password: z
    .string({message: 'Senha obrigatoria!'})
    .min(6, 'A senha deve ter no minimo 6 caracteres'),
})

export default function FormSignIn() {
  const router = useRouter()

 type SchemaSignIn = z.infer<typeof schemaSignIn>
 const {
  register,
  handleSubmit,
  setError,
  formState: { errors },
} = useForm<SchemaSignIn>({
  resolver: zodResolver(schemaSignIn),
})
const {mutateAsync: authenticate} = useMutation({
  mutationFn: signIn,
})
  const handleSignIn = async (data: SchemaSignIn) => {
    try {
      await authenticate(data)
      router.push('/')
   } catch (error) {
      if (error instanceof HTTPError) {
        const response = await error.response.json();
        setError('root', {
          message: response.message || 'Erro desconhecido'
        })
      } else {
        setError('root', {
          message: 'Erro ao tentar autenticar. Por favor, tente novamente mais tarde.'
        })
      }
   }
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit(handleSignIn)} className="flex flex-col gap-4">
       
        <div className="space-y-1">
          <Label >E-mail</Label>
          <Input {...register('email')} />
        </div>
        {errors.email && (
            <span className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email.message}
            </span>
          )}
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input {...register('password')} name="password" type="password" id="password" />
        </div>
        {errors.password && (
            <span className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password.message}
            </span>
          )}
        {errors.root && (
            <span className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.root.message}
            </span>
          )}
        <Button className="w-full mt-5" type="submit" >
          Entrar
        </Button>
        <Button className="w-full" variant="link" size="sm" asChild>
          <Link href="/auth/sign-up">Criar conta</Link>
        </Button>
      </form>
    </div>
  )
}