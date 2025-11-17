"use server"

import prisma from "@/lib/prisma"
import { z } from 'zod'

// Adicione barberName no schema
const formSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("O email é obrigatório"),
    phone: z.string().min(1, "O telefone é obrigatório"),
    date: z.date(),
    serviceId: z.string().min(1, "O serviço é obrigatório"),
    time: z.string().min(1, "O horário é obrigatório"),
    clinicId: z.string().min(1, "O horário é obrigatório"),
    barberName: z.string().min(1, "O barbeiro é obrigatório"), // novo campo
})

type FormSchema = z.infer<typeof formSchema>

export async function createNewAppointment(formData: FormSchema) {
    const schema = formSchema.safeParse(formData)

    if(!schema.success){
        return{
            error: schema.error.issues[0].message
        }
    }

    try {
        const selectedDate = new Date(formData.date)
        const year = selectedDate.getFullYear()
        const month = selectedDate.getMonth()
        const day = selectedDate.getDate()

        // Define a data sem horário (UTC 00:00)
        const appointmentDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0))

        const newAppointment = await prisma.appoitments.create({
            data: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                time: formData.time,
                appointmentDate: appointmentDate,
                serviceId: formData.serviceId,
                userId: formData.clinicId,
                barberName: formData.barberName, // incluído
            }
        })

        return{
            data: newAppointment
        }
        
    } catch (error) {
        console.log(error)
        return{
            error: "Erro ao cadastrar agendamento"
        }
    }
}
