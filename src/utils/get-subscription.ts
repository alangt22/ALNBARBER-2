"use server"

import prisma from "@/lib/prisma"
import { sub } from "date-fns";

export async function getSubscription({userId}: {userId: string}) {
    if(!userId){
        return null;
    }

    try {
        const subscription = await prisma.subscription.findFirst({
            where:{
                userId: userId
            }
        })

        return subscription;

    } catch (error) {
        return null;
    }
}