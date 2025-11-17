

export type PlanDetailProps = {
    maxServices: number;
}

export type PlansProps = {
    BASIC: PlanDetailProps;
    PROFESSIONAL: PlanDetailProps;
}

export const PLANS: PlansProps = {
    BASIC: {
        maxServices: 3,
    },
    PROFESSIONAL: {
        maxServices: 50,   
    }
}

export const subscriptionPlans = [
    {
        id: "BASIC",
        name: "Basic",
        description: "Perfeito para empresas menores",
        oldPrice: "R$ 97,90",
        price: "R$ 27,90",
        features: [
            ` Até ${PLANS["BASIC"].maxServices} Serviços`,
            'Agendamentos ilimitados',
            'Suporte',
        ]

    },
    {
        id: "PROFESSIONAL",
        name: "Profissional",
        description: "Ideal para empresas grandes",
        oldPrice: "R$ 197,90",
        price: "R$ 97,90",
        features: [
            ` Até ${PLANS["PROFESSIONAL"].maxServices} Serviços`,
            'Agendamentos ilimitados',
            'Suporte prioritario',
        ]

    }
]