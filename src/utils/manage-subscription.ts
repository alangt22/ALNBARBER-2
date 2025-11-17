

import prisma from "@/lib/prisma"
import Stripe from "stripe"
import { stripe } from '@/utils/stripe'
import { Plan } from "@prisma/client"


/**
 * 
 *  Salvar , atualizar ou deletar informações das assinaturas (subscription) no banco de
 dados, sincronizando com Stripe.
 * 
 * @async
 * @function manageSubscription
 * @param {string} subscriptionId - O ID da assinatura a ser gerenciada
 * @param {string} customerId - O ID do cliente associado  a assinatura
 * @param {boolean} createAction - Indica se um nova assinatura deve ser criada
 * @param {boolean} deleteAction - Indica se um nova assinatura deve ser deletada
 * @param {Plan} type - O plano associado a assinatura
 * @returns {Promises<Response|void>}
 */

export async function manageSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false,
    deleteAction = false,
    type?: Plan
) {
    // buscar o user pelo customerId
    // Salvar os dados da assinatura no banco

    const findUser = await prisma.user.findFirst({
        where:{
            stripe_customer_id: customerId
        }
    })

    if(!findUser){
        return Response.json({error: "Falha ao realizar assinatura"}, {status: 400})
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    const subscriptionData = {
        id: subscription.id,
        userId: findUser.id,
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
        plan: type ?? "BASIC"
    }

    if(subscriptionId && deleteAction){
        await prisma.subscription.delete({
            where:{
                id: subscriptionId
            }
        })

        return;
    }

    if(createAction){
        try {
            await prisma.subscription.create({
                data: subscriptionData
            })
        } catch (error) {
            console.log("Erro ao salvar ass no banco")
            console.log(error)
        }

        
    }else{
    

        try {
            
            const findSubscription = await prisma.subscription.findFirst({
                where: {
                    id: subscriptionId
                }
            })

            if(!findSubscription) return;

            await prisma.subscription.update({
                where:{
                    id: findSubscription.id
                },
                data:{
                    status: subscription.status,
                    priceId: subscription.items.data[0].price.id,
                }
            })

        } catch (error) {
            console.log("falha ao atualizar no banco")
        }
        
    }
}