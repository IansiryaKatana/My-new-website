import { Play } from "lucide-react";
import { CircleButton } from "@/components/CircleButton";
import { FloatingServiceCard } from "@/components/FloatingServiceCard";
import { Reveal } from "@/components/Reveal";
import { images } from "@/data/site";

export function ServiceSessionSection() {
  return (
    <Reveal
      as="section"
      className="grid gap-5 px-4 pb-12 sm:px-8 lg:grid-cols-[1fr_0.95fr]"
      delay={120}
    >
      <article className="relative min-h-[28rem] overflow-hidden rounded-[1.7rem] bg-zinc-200">
        <img
          src={images.therapy}
          alt="Medical wellbeing treatment session"
          className="absolute inset-0 h-full w-full object-cover blur-[1px] scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/50" />
        <div className="relative flex h-full min-h-[28rem] flex-col justify-between p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-black">
              Assurance
            </span>
            <span className="label-text text-white/75">Oct - Nov 2026</span>
          </div>
          <FloatingServiceCard tone="dark" className="mx-auto w-56 rotate-[-2deg]" />
          <p className="label-text">Family Healthy Cover</p>
        </div>
      </article>

      <article className="relative flex min-h-[28rem] flex-col justify-between rounded-[1.7rem] bg-white p-6 sm:p-8">
        <div>
          <div className="mb-10 flex flex-wrap gap-2">
            <span className="rounded-full bg-black/[0.04] px-3 py-1 text-xs font-semibold">
              Professional Doctor
            </span>
            <span className="rounded-full bg-black/[0.04] px-3 py-1 text-xs font-semibold">
              Consultation
            </span>
          </div>
          <p className="label-text mb-3 text-black/45">Care Session</p>
          <h2 className="display-tight text-6xl font-medium sm:text-7xl">
            Single Session
          </h2>
          <p className="mt-4 max-w-sm text-lg font-medium leading-[1.1] tracking-[-0.04em] text-black/55">
            Trauma Processing Therapy (TPT) - Public
          </p>
          <span className="mt-7 inline-flex rounded-full bg-mar-black px-4 py-2 text-sm font-semibold text-white">
            $99 / Session
          </span>
        </div>

        <div className="mt-12 flex items-end justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-black/55">
            <span className="flex size-8 items-center justify-center rounded-full bg-black text-white">
              <Play className="ml-0.5 size-3.5 fill-current" />
            </span>
            See live / Schedule
          </div>
          <CircleButton href="#footer" label="Book single session" />
        </div>
      </article>
    </Reveal>
  );
}
