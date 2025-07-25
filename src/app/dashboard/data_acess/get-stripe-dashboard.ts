"use server"

import { stripe } from "@/lib/stripe"

export async function getStripeDashboard(accountId: string | undefined) {
  if (!accountId) {
    return null;
  }

  try {
    const loginLink = await stripe.accounts.createLoginLink(accountId);
    console.log(loginLink);
    return loginLink.url;
  } catch (err) {
    return null;
  }
}