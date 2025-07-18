import { DonationTable } from "./_components/donates";
import { Stats } from "./_components/analytics";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GetcreateLoginOnboardAccount } from "./data_acess/create-onboard-account";
import { CreateAccountButton } from "./_components/create-account-button";
import { getAllDonates } from "./data_acess/get-donates";
import { getStripeDashboard } from "./data_acess/get-stripe-dashboard";


export default async function Dashboard() {

  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const UrlStripeDashboard = await getStripeDashboard(session?.user.connectedStripeAccountId);
  // const donates = await getAllDonates(session.user.id);

  return (
    <div className="p-4">
      <section className="flex items-center justify-between mb-4">
        <div className="w-full flex items-center gap-2 justify-between">
          <h1 className="text-2xl font-semibold">Minha conta</h1>

          {UrlStripeDashboard && (
            <a
              href={UrlStripeDashboard}
              target="_blank"
              className="bg-zinc-900 px-4 py-1 rounded-md text-white cursor-pointer">
              Ajustar conta
            </a>
          )}
        </div>
      </section>

      {!session.user.connectedStripeAccountId && (
        <CreateAccountButton />
      )}

      {session.user.connectedStripeAccountId && (
        <>
          <Stats userId={session.user.id} stripeAccountId={session.user.connectedStripeAccountId ?? ""} />

          <h2 className="text-2xl font-semibold mb-2">Últimas doações</h2>

          <DonationTable  />
        </>
      )}

    </div>
  );
}