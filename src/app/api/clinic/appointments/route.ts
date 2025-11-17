import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";



export const GET = auth(async function GET(request) {
    if(!request.auth){
        return NextResponse.json({
            error: "Acesso não autorizado!"
        }, {status: 401})
    }

    const searchParams =  request.nextUrl.searchParams
    const dateString = searchParams.get('date') as string
    const clinicId = request.auth?.user?.id

    if(!dateString){
        return NextResponse.json({
            error: "Data não informada"
        }, {status: 400})
    }
    
    if(!clinicId){
        return NextResponse.json({
            error: "Usuario não encontrado"
        }, {status: 400})
    }

    try {
        // criar uma data formatada
        const [year, month, day] =  dateString.split("-").map(Number)

        const startDate = new Date(Date.UTC(year, month -1, day, 0, 0, 0, 0))
        const endDate = new Date(Date.UTC(year, month -1, day, 23, 59, 59, 999))

        console.log("page agendamento:", startDate)
        console.log("page agendamento:", endDate)

        const appointments = await prisma.appoitments.findMany({
            where: {
                userId: clinicId,
                appointmentDate:{
                    gte: startDate,
                    lte: endDate
                }
            },
            include:{
                service: true
            }
        })


        return NextResponse.json(appointments)

    } catch (error) {
        return NextResponse.json({
            error: "Falha ao buscar agendamento"
        }, {status: 400})
    }

    
}) as any ;