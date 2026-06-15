import { ArrowUpRight } from "lucide-react";
import { CircleButton } from "@/components/CircleButton";
import { DecorativePillCluster } from "@/components/DecorativePillCluster";
import { Reveal } from "@/components/Reveal";
import { images, navItems } from "@/data/site";

export function FooterCTA() {
  return (
    <Reveal
      as="footer"
      id="footer"
      className="px-4 pb-4 sm:px-8 sm:pb-8"
      delay={220}
    >
      <div className="relative overflow-hidden rounded-[1.8rem] bg-white p-5 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_15rem]">
          <div>
            <p className="label-text mb-5 text-black/45">Mar-Health</p>
            <h2 className="display-tight max-w-2xl text-5xl font-medium sm:text-6xl lg:text-7xl">
              Transforming the future of healthcare <DecorativePillCluster /> with solutions.
            </h2>
            <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {["About Us", ...navItems, "Testimonial"].map((item) => (
                <a
                  key={item}
                  href={item === "About Us" ? "#top" : `#${item.toLowerCase()}`}
                  className="text-xs font-bold uppercase tracking-[0.13em] text-black/48 transition hover:text-black"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <a
            href="#top"
            className="group relative min-h-48 overflow-hidden rounded-[1.4rem] bg-mar-black text-white"
          >
            <img
              src={images.footer}
              alt="Peaceful wellbeing treatment room"
              className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/58" />
            <span className="absolute bottom-4 left-4 text-2xl font-medium leading-none tracking-[-0.05em]">
              Explore <br /> Now
            </span>
            <span className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white text-black transition group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowUpRight className="size-4" />
            </span>
          </a>
        </div>

        <div className="mt-12 grid items-end gap-6 border-t border-black/8 pt-6 md:grid-cols-[auto_1fr_auto]">
          <CircleButton href="#top" tone="lime" size="lg" label="Back to top" />
          <div className="grid gap-2 text-xs font-semibold leading-5 text-black/45 sm:grid-cols-3">
            <p>Mar-Health Studio, 24 Care Avenue, Rabat MA</p>
            <a href="mailto:care@mar-health.example" className="transition hover:text-black">
              care@mar-health.example
            </a>
            <p>Designed for calm medical access</p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-[0.12em] text-black/45 md:justify-end">
            <a href="#top" className="transition hover:text-black">
              Privacy Policy
            </a>
            <a href="#top" className="transition hover:text-black">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
