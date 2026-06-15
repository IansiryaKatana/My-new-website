import { ArrowDownRight } from "lucide-react";
import { CircleButton } from "@/components/CircleButton";
import { FloatingServiceCard } from "@/components/FloatingServiceCard";
import { images } from "@/data/site";

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden bg-mar-paper px-3 pb-4 sm:px-5">
      <div className="relative min-h-[38rem] overflow-hidden rounded-b-[2rem] rounded-t-none bg-sky-300 sm:min-h-[42rem] lg:min-h-[85vh]">
        <img
          src={images.hero}
          alt="Smiling wellbeing member outdoors under a clear sky"
          className="hero-image absolute inset-0 h-full w-full object-cover object-[54%_center]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-black/20" />
        <div className="absolute inset-x-4 top-5 sm:inset-x-8 sm:top-8">
          <h1 className="hero-title select-none text-white">Wellbeing</h1>
        </div>

        <div className="absolute bottom-8 left-5 max-w-[14rem] text-white sm:left-8">
          <p className="label-text mb-3 text-white/75">Program Built Around What Matters</p>
          <p className="text-xl font-medium leading-[1.02] tracking-[-0.05em]">
            Care that feels personal, simple, and ready when you are.
          </p>
        </div>

        <FloatingServiceCard className="float-soft absolute right-5 top-[45%] w-44 max-sm:top-[38%] sm:right-[13%] sm:w-52" />

        <div className="absolute bottom-5 right-5 flex items-center gap-3 text-white sm:right-8">
          <span className="hidden text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-white/75 sm:inline">
            Scroll
          </span>
          <CircleButton href="#service" label="Explore services" tone="blue" />
        </div>

        <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-white/18 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md md:flex">
          <ArrowDownRight className="size-4" />
          Secure virtual care and medical programs
        </div>
      </div>
    </section>
  );
}
