import { Link } from "@tanstack/react-router";
import { ArrowLeft, Construction, Sparkles } from "lucide-react";

import {
  DashboardMobileNav,
  DashboardSidebar,
  DashboardTopbar,
} from "@/components/BongoFiDashboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const developmentUser = {
  id: "usr_joseph_bongo",
  name: "Joseph Bongo",
  email: "Josephbongo@yahoo.com",
  avatarUrl: "",
};

export function DevelopmentPage({ title }: { title: string }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#E9EAEC] p-3 text-[#111111] sm:p-6 lg:h-screen lg:overflow-hidden lg:p-10">
      <section className="dashboard-shell mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-none flex-col overflow-x-hidden rounded-[28px] bg-[#F5F5F3] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] sm:min-h-[calc(100vh-3rem)] sm:p-6 lg:h-[calc(100vh-5rem)] lg:min-h-0 lg:overflow-hidden">
        <DashboardTopbar user={developmentUser} />

        <div className="flex min-h-0 flex-1 gap-4 pt-6 lg:gap-5">
          <DashboardSidebar />

          <section className="grid min-w-0 flex-1 place-items-center pb-20 lg:overflow-y-auto lg:pb-0">
            <Card className="card-reveal w-full max-w-3xl overflow-hidden p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#101010] text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                  <Construction className="size-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-[#B6FF2E]/30 px-3 py-1 text-xs font-semibold text-[#17451f]">
                    <Sparkles className="size-3.5" />
                    In development
                  </div>
                  <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.05em] sm:text-[42px]">
                    {title}
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#6f6f6f]">
                    This Bongo-Fi module is wired into navigation and ready for its
                    next build phase. The overview dashboard remains available
                    while this page is being completed.
                  </p>

                  <Button asChild className="mt-6" type="button" variant="dark">
                    <Link to="/">
                      <ArrowLeft className="size-4" />
                      Back to overview
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        </div>

        <DashboardMobileNav />
      </section>
    </main>
  );
}
