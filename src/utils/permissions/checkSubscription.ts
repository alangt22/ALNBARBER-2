"use server"

import prisma from "@/lib/prisma"
import { addDays, differenceInDays, isAfter } from "date-fns"
import { TRIAL_DAYS } from "@/utils/permissions/trial-limit"

export async function checkSubscription(userId: string) {
    const user = await prisma.user.findFirst({
        where:{
            id: userId
        },
        include:{
            subscription: true
        }
    })

    if(!user){
        throw new Error("Usuario não encontrado")
    }

    if(user.subscription && user.subscription.status === "active"){
        return{
            subscriptionStatus: "active",
            message: "Assibatura ativa",
            planId: user.subscription.plan
        }
    }

    const trialEndDate = addDays(user.createdAt, TRIAL_DAYS)

    if(isAfter(new Date(), trialEndDate)){
        return{
            subscriptionStatus: "EXPIRED",
            message: "Seu periodo de teste expirou.",
            planId: "TRIAL"
        }
    }

    const daysRemaining = differenceInDays(trialEndDate, new Date())

    return{
        subscriptionStatus: "TRIAL",
        message: `Você esta no periodo de teste gratuito. Fatam ${daysRemaining} dia(s)`,
        planId: "TRIAL"
    }

}