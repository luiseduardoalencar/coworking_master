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




export default function FormSignIn() {
  const router = useRouter()
  const schemaSignIn = z.object({
    email: z
      .string({message: 'Email obrigatorio!'})
      .email('Formato de e-mail inválido!'),
    password: z
      .string({message: 'Senha obrigatoria!'})
      .min(6, 'A senha deve ter no minimo 6 caracteres'),
  })

 type SchemaSignIn = z.infer<typeof schemaSignIn>
 const {
  register,
  handleSubmit,
  setError,
  formState: { errors },
} = useForm<SchemaSignIn>({
  resolver: zodResolver(schemaSignIn),
})
  const handleSignIn = async (data: SchemaSignIn) => {
   
    await api.post('/api/admin/auth-admin', {
      method: "POST",
      json: data,
     }).json();
    
   
   router.push('/')
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit(handleSignIn)} className="flex flex-col gap-4">
       
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input {...register('email')} name="email" type="email" id="email" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input {...register('password')} name="password" type="password" id="password" />
        </div>
        {errors.root && (
            <span className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.root?.message}
            </span>
          )}
        <Button className="w-full mt-5" type="submit" >
          Entrar
        </Button>
        <Button className="w-full" variant="link" size="sm" asChild>
          <Link href="/auth/sign-up">Create new account</Link>
        </Button>
      </form>
    </div>
  )
}