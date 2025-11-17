

export function isToday(date: Date){
    const now = new Date()


    return(
        date.getFullYear() === now.getFullYear()&&
        date.getMonth() === now.getMonth()&&
        date.getDate() === now.getDate()
    )
}


/**
 * Verificar se determinado slot ja passou
 */

export function isSlotInThePast(slotTime: string){
    const [slotHour, slotMinute] = slotTime.split(":").map(Number)

    const now  = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    if(slotHour < currentHour){
        return true
    }else if(slotHour === currentHour && slotMinute <= currentMinute){
        return true
    }

    return false
}

/**
 * Verificar se, a partir de um slot inicial existe uma sequencia de requiredSlots dissponiveis
 * ex: se um serivço tem 2 required slots e começa no time 15:00,
 * precisa garantir que 15:00 nso estejam no nosso blockedSlots
 */

export function isSlotSequenceAvailable(
    startSlot: string, // primeiro horario disponivel
    requieredSlots: number, // quantidade de slots necessarios
    allSlots: string[], // todos horarios da clinica
    blockedSlots: string[] // horarios bloqueados
){

    const startIndex = allSlots.indexOf(startSlot)

    // if(startIndex === -1) para poder marcar um serviço de duração longa no ultimo horario
    if(startIndex === -1 || startIndex + requieredSlots > allSlots.length){
        return false
    }

    for(let i = startIndex; i < startIndex + requieredSlots; i++){
        const slotTime = allSlots[i]

        if(blockedSlots.includes(slotTime)){
            return false
        }
    }


    return true
}