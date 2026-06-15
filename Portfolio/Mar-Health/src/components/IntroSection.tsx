import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircleButton } from "@/components/CircleButton";
import { Reveal } from "@/components/Reveal";
import { images } from "@/data/site";

export function IntroSection() {
  return (
    <Reveal
      as="section"
      id="service"
      className="px-4 py-12 sm:px-8 sm:py-16"
    >
      <div className="mb-8 flex items-center justify-between text-black/55">
        <p className="label-text">Our Vision</p>
        <p className="label-text">Admission</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr]">
        <h2 className="display-tight max-w-xs text-5xl font-medium sm:text-6xl">
          Observe <br /> With Team
        </h2>
        <div>
          <p className="max-w-2xl text-3xl font-medium leading-[1.05] tracking-[-0.06em] text-black sm:text-4xl">
            Our platform connects patients with trusted medical professionals
            through secure and reliable technology. We make managing your health
            easier, whether booking consultations or joining care programs.
          </p>
        </div>
      </div>

      <div className="mt-10 grid items-end gap-5 md:grid-cols-[1fr_1.35fr_auto]">
        <div className="grid grid-cols-[1.25fr_0.9fr] gap-3">
          <article className="relative min-h-48 overflow-hidden rounded-[1.5rem] bg-white">
            <img
              src={images.consultation}
              alt="Doctor and patient reviewing care information"
              className="h-full min-h-48 w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold">
              2026
            </span>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="absolute bottom-4 left-4"
            >
              <a href="#program">View More</a>
            </Button>
          </article>
          <article className="overflow-hidden rounded-[1.5rem] bg-white p-2">
            <img
              src={images.community}
              alt="Wellness community session"
              className="h-full min-h-48 w-full rounded-[1.1rem] object-cover"
              loading="lazy"
            />
          </article>
        </div>

        <div className="max-w-md md:pb-3">
          <p className="mb-2 text-sm font-semibold text-black/50">Clinic-reviewed</p>
          <div className="mb-3 flex text-amber-400" aria-label="Rated 4.9 out of 5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="size-4 fill-current" />
            ))}
          </div>
          <p className="text-sm leading-6 text-black/60">
            Coordinated care teams, clear next steps, and calmer digital access
            for patients and families.
          </p>
        </div>

        <CircleButton href="#program" label="Open programs" className="justify-self-start md:justify-self-end" />
      </div>
    </Reveal>
  );
}
