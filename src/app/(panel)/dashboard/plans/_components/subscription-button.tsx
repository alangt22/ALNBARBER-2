"use client";

import { Button } from "@/components/ui/button";
import { Plan } from "@prisma/client";
import { createSubscription } from "../_actions/create-subscription";
import { toast } from "sonner";
import { getStripeJs } from "@/utils/stripe-js";
import { Loader } from "lucide-react";
import { useState } from "react";

interface SubscriptionButtonProps {
  type: Plan;
}

export function SubscriptionButton({ type }: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateBilling() {
    setIsLoading(true);
    const { sessionId, error } = await createSubscription({ type: type });

    if (error) {
      toast.error(error);
      return;
    }

    const stripe = await getStripeJs();

    if (stripe) {
      await stripe.redirectToCheckout({ sessionId: sessionId });
    }
    setIsLoading(false);
  }

  return (
    <Button
      className={`w-full ${
        type === "PROFESSIONAL" && "bg-emerald-500 hover:bg-emerald-400"
      }`}
      onClick={handleCreateBilling}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="w-24 flex items-center justify-center">
          <Loader className="animate-spin" />
        </span>
      ) : (
        "Ativar assinatura"
      )}
    </Button>
  );
}
