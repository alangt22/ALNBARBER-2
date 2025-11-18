"use client"

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const appointmentSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("O email é obrigatório"),
    phone: z.string().min(1, "O telefone é obrigatório"),
    date: z.date(),
    serviceId: z.string().min(1, "O serviço é obrigatório"),
    barberName: z.string().min(1, "O barbeiro é obrigatório"), // novo campo
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>

export function useAppoitmentForm(){
    return useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            serviceId: "",
            date: new Date(),
            barberName: "", // novo campo
        }
    })
}
