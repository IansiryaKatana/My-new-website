import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { CircleButton } from "@/components/CircleButton";
import { DecorativePillCluster } from "@/components/DecorativePillCluster";
import { Reveal } from "@/components/Reveal";
import { programs } from "@/data/site";
import { cn } from "@/lib/utils";

export function ProgramShowcase() {
  const [activeId, setActiveId] = useState("specialist");
  const activeIndex = Math.max(
    programs.findIndex((program) => program.id === activeId),
    0,
  );
  const activeProgram = programs[activeIndex] ?? programs[0];

  return (
    <Reveal as="section" id="program" className="px-4 pb-12 sm:px-8" delay={160}>
      <div className="relative overflow-hidden rounded-[1.8rem] bg-mar-black p-5 text-white sm:p-8 lg:p-10">
        <div className="mb-12 flex items-start justify-between gap-6">
          <div>
            <p className="label-text mb-4 text-white/45">Featured Medical Programs</p>
            <h2 className="display-tight max-w-xl text-5xl font-medium sm:text-6xl lg:text-7xl">
              Featured medical programs Through <DecorativePillCluster /> reliable innovation.
            </h2>
          </div>
          <p className="label-text hidden text-white/50 sm:block">
            {String(activeIndex + 1).padStart(2, "0")} / {programs.length} - Program
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-2">
            {programs.map((program, index) => {
              const active = program.id === activeProgram.id;

              return (
                <button
                  key={program.id}
                  type="button"
                  onMouseEnter={() => setActiveId(program.id)}
                  onFocus={() => setActiveId(program.id)}
                  onClick={() => setActiveId(program.id)}
                  className={cn(
                    "group grid w-full grid-cols-[3.5rem_1fr_auto] items-center gap-4 rounded-[1.1rem] border border-white/10 px-4 py-4 text-left transition duration-500",
                    active
                      ? "bg-white text-mar-black"
                      : "bg-transparent text-white hover:bg-white/8",
                  )}
                >
                  <span className={cn("text-xs font-semibold", active ? "text-black/45" : "text-white/35")}>
                    {program.yearLabel}
                  </span>
                  <span>
                    <span className="block text-2xl font-medium tracking-[-0.05em]">
                      {program.title}
                    </span>
                    <span className={cn("mt-1 block text-xs", active ? "text-black/55" : "text-white/45")}>
                      {program.subtitle}
                    </span>
                    {active ? (
                      <span className="mt-3 flex flex-wrap gap-2">
                        {program.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-black/[0.06] px-3 py-1 text-[0.68rem] font-semibold text-black/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1",
                      active ? "bg-mar-black text-white" : "bg-white/8 text-white",
                    )}
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[24rem]">
            <div className="absolute inset-x-4 top-3 h-64 rotate-3 rounded-[1.7rem] border border-white/10 bg-white/5" />
            <article className="relative overflow-hidden rounded-[1.7rem] bg-white text-mar-black shadow-[0_30px_80px_rgba(0,0,0,0.35)] transition duration-500 lg:translate-y-10 lg:rotate-[-3deg]">
              <img
                key={activeProgram.image}
                src={activeProgram.image}
                alt={`${activeProgram.title} medical program`}
                className="h-72 w-full object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-mar-lime px-3 py-1 text-xs font-semibold">
                    Professional Trainer
                  </span>
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                    {activeProgram.accent}
                  </span>
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="label-text mb-2 text-black/45">Selected Path</p>
                    <h3 className="text-4xl font-medium tracking-[-0.06em]">
                      {activeProgram.title}
                    </h3>
                  </div>
                  <CircleButton href="#activity" tone="black" size="sm" label="Continue to activity" />
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
