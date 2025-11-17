"use server"
import prisma from "@/lib/prisma"
import { Subscription } from "@prisma/client"
import { Session } from "next-auth"
import { getPlan } from "./get-plans"
import { PLANS } from "../plans"
import { checkSubscriptionExpired } from "./checkSubscriptionExpired"
import { ResultPermissionProps } from "./canPermission"

export async function canCreateService(subscription: Subscription | null, session: Session): Promise<ResultPermissionProps> {
    try {
        const serviceCount = await prisma.services.count({
            where: {
                userId: session?.user?.id,
                status: true
            }
        })

        if(subscription && subscription.status === "active"){
            const plan = subscription.plan;
            const planLimit = await getPlan(plan);

            console.log("limites do plano", planLimit)

            return{
                hasPermission: planLimit.maxServices === null || serviceCount < planLimit.maxServices,
                planId: subscription.plan,
                expired: false,
                plan: PLANS[subscription.plan]
            }
        }

        const checkTestLimit = await checkSubscriptionExpired(session)

        return checkTestLimit


    } catch (error) {
        return{
            hasPermission: false,
            planId: "EXPIRED",
            expired: false,
            plan: null
        }
    }
}