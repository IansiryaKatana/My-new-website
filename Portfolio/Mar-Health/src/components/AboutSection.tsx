import { Activity, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecorativePillCluster } from "@/components/DecorativePillCluster";
import { Reveal } from "@/components/Reveal";
import { images } from "@/data/site";

export function AboutSection() {
  return (
    <Reveal as="section" className="px-4 pb-10 sm:px-8 sm:pb-14" delay={80}>
      <div className="mb-5 flex items-center justify-between text-black/55">
        <p className="label-text">For Patients</p>
        <p className="label-text">01 / Healthcare</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_1.1fr_0.62fr]">
        <article className="flex min-h-80 flex-col justify-between rounded-[1.6rem] bg-mar-paper p-1">
          <div>
            <h2 className="display-tight text-5xl font-medium sm:text-6xl">
              Because every <DecorativePillCluster /> patient matters
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-black/58">
              Built around clinical clarity and human support, Mar-Health keeps
              consultations, programs, and progress connected in one calm
              digital experience.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <Button asChild className="min-w-52 justify-between">
              <a href="#activity">
                Start assessment
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
            <span className="text-[0.64rem] font-bold uppercase tracking-[0.13em] text-black/45">
              With GPT 5.0
            </span>
          </div>
        </article>

        <article className="relative min-h-96 overflow-hidden rounded-[1.6rem] bg-mar-black text-white">
          <img
            src={images.diagnosis}
            alt="Diagnostic scan interface used by medical teams"
            className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/72" />
          <div className="relative flex h-full flex-col justify-between p-5">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="flex size-9 items-center justify-center rounded-full bg-white/12 backdrop-blur">
                  <ShieldCheck className="size-4" />
                </span>
                <span className="flex size-9 items-center justify-center rounded-full bg-white/12 backdrop-blur">
                  <Activity className="size-4" />
                </span>
              </div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                Verified
              </span>
            </div>
            <div>
              <p className="label-text mb-2 text-white/60">Condition scan</p>
              <h3 className="text-3xl font-medium tracking-[-0.05em]">Osteoporosis</h3>
            </div>
          </div>
        </article>

        <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[1.35rem] bg-white p-5">
            <p className="label-text text-black/45">Empowerment</p>
            <p className="mt-12 text-sm leading-5 text-black/55">
              Every action in the journey is designed to help patients know what
              comes next.
            </p>
          </div>
          <div className="rounded-[1.35rem] bg-mar-lime p-5">
            <p className="label-text text-black/55">Scan Cardiology</p>
            <p className="mt-12 text-5xl font-medium tracking-[-0.08em]">1,276</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/55">
              monitored insights
            </p>
          </div>
        </aside>
      </div>
    </Reveal>
  );
}
