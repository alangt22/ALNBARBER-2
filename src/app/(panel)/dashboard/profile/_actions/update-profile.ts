"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from 'zod'

const formSchema = z.object({
    name: z.string().min(1, {message: "O nome é obrigatório"}),
    adress: z.string().optional(),
    phone: z.string().optional(),
    status: z.boolean(),
    timeZone: z.string(),
    times: z.array(z.string()),
    barbers: z.array(z.string()),
    workingDays: z.array(z.string())
})

type FormSchema = z.infer<typeof formSchema>


export async function updateProfile(formData: FormSchema) {

    const session = await auth()

    if(!session?.user?.id){
        return{
            error: "Usuário não encontrado"
        }
    }

    const schema = formSchema.safeParse(formData)   

    if(!schema.success){
        return{
            error: "Preencha todos os campos",
        }
    }

    try {
        await prisma.user.update({
            where:{
                id: session?.user?.id
            },
            data:{
                name: formData.name,
                adress: formData.adress,
                phone: formData.phone,
                status: formData.status,
                timeZone: formData.timeZone,
                times: formData.times || [],
                barbers: formData.barbers,
                workingDays: formData.workingDays
            }
        })

        revalidatePath("/dashboard/profile")


        return{
            data: "Barbearia atualizada com sucesso"
        }

    } catch (error) {
        
        return{
            error: "Falha ao atualizar Barbearia",
        }
    }
}