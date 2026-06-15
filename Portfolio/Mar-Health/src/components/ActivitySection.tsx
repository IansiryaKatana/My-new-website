import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DecorativePillCluster } from "@/components/DecorativePillCluster";
import { Reveal } from "@/components/Reveal";
import { images } from "@/data/site";

export function ActivitySection() {
  return (
    <Reveal as="section" id="activity" className="px-4 pb-14 sm:px-8" delay={180}>
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <h2 className="display-tight max-w-xl text-5xl font-medium sm:text-6xl">
          Explore <DecorativePillCluster /> flexible of activity.
        </h2>
        <div className="grid grid-cols-2 gap-3 text-right text-xs font-semibold uppercase tracking-[0.12em] text-black/45">
          <span>Happy Patients</span>
          <span>Experience</span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr_0.9fr]">
        <article className="flex min-h-80 flex-col justify-between rounded-[1.6rem] bg-mar-blue p-6 text-white">
          <p className="label-text text-white/60">Customer Story</p>
          <p className="text-3xl font-medium leading-[1.02] tracking-[-0.06em]">
            The ability to feel secure or track the connection journey gives our
            care team the rhythm it needs.
          </p>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/65">
              Active patients / remote-first
            </p>
            <Button asChild variant="ghost" size="sm">
              <a href="#footer">Tell Your Story</a>
            </Button>
          </div>
        </article>

        <article className="relative min-h-80 overflow-hidden rounded-[1.6rem]">
          <img
            src={images.wellness}
            alt="Wellness activity and mindful movement"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/55" />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="absolute left-5 top-5 bg-white/90"
          >
            <a href="#service">View More</a>
          </Button>
          <div className="absolute bottom-5 left-5 flex items-center gap-2 text-white">
            <span className="flex size-8 items-center justify-center rounded-full bg-mar-lime text-mar-black">
              <Sparkles className="size-4" />
            </span>
            <span className="text-lg font-semibold tracking-[-0.04em]">Mood Boost</span>
          </div>
        </article>

        <article className="flex min-h-80 flex-col justify-between rounded-[1.6rem] bg-white p-6">
          <p className="label-text text-black/45">Product News</p>
          <div>
            <p className="display-tight text-5xl font-medium text-black/18">Access</p>
            <p className="display-tight text-5xl font-medium">Wellness</p>
            <p className="display-tight text-5xl font-medium text-black/18">Connection</p>
            <p className="mt-4 text-sm font-semibold text-black/45">Support Community</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-black/55">
            <span className="flex size-8 items-center justify-center rounded-full bg-mar-black text-white">
              <Play className="ml-0.5 size-3.5 fill-current" />
            </span>
            Watch the profile
          </div>
        </article>
      </div>
    </Reveal>
  );
}
