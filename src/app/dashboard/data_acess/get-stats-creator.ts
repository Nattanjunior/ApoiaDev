"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { error } from "console";

export async function getStats(userId: string, stripeAccountId: string) {
  if (!userId) {
    return {
      error: "Usuário não autenticado",
    };
  }

  try {
    const totalDonations = await prisma.donation.count({
      where: {
        userId,
        status: "PAID",
      },
    });

    const totalAmountDonated = await prisma.donation.aggregate({
      where: {
        userId,
        status: "PAID",
      },
      _sum: {
        amount: true,
      },
    });

    const balance = await stripe.balance.retrieve({
      stripeAccount: stripeAccountId,
    });


    return {
      totalqtdDonations: totalDonations,
      totalAmountResult: totalAmountDonated._sum.amount,
      balance: balance?.pending[0]?.amount ?? 0,
    };
  } catch (err) {
    return {
      error: "Falha ao buscar estatísticas",
    };
  }
}