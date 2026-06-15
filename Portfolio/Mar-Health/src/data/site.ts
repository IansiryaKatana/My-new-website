export type Program = {
  id: string;
  yearLabel: string;
  title: string;
  subtitle: string;
  tags: string[];
  image: string;
  accent: string;
};

const unsplash = (id: string, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const images = {
  hero: "/hero.png",
  consultation: unsplash("photo-1576091160550-2173dba999ef", 1200),
  therapy: unsplash("photo-1584515933487-779824d29309", 1200),
  diagnosis: unsplash("photo-1579684385127-1ef15d508118", 1000),
  wellness: unsplash("photo-1544367567-0f2fcb009e0b", 1000),
  community: unsplash("photo-1529156069898-49953e39b3ac", 900),
  footer: unsplash("photo-1506126613408-eca07ce68773", 900),
};

export const programs: Program[] = [
  {
    id: "nutrition",
    yearLabel: "2011",
    title: "Nutrition",
    subtitle: "Smart meal guidance for everyday patient energy.",
    tags: ["Meal Plan", "Patient"],
    image: unsplash("photo-1490645935967-10de6ba17061", 900),
    accent: "Preventive care",
  },
  {
    id: "specialist",
    yearLabel: "2021",
    title: "Specialist",
    subtitle: "Best facilities with professional doctors on demand.",
    tags: ["Best Facilities", "Professional Doctor"],
    image: unsplash("photo-1559757148-5c350d0d3c56", 900),
    accent: "Mexican Health",
  },
  {
    id: "recovery",
    yearLabel: "2023",
    title: "Recovery",
    subtitle: "Guided support after treatment, surgery, or diagnosis.",
    tags: ["Remote Care", "Progress"],
    image: unsplash("photo-1519823551278-64ac92734fb1", 900),
    accent: "Care Journey",
  },
  {
    id: "mindcare",
    yearLabel: "2024",
    title: "Mindcare",
    subtitle: "Mental wellbeing sessions with calm clinical structure.",
    tags: ["Therapy", "Balance"],
    image: unsplash("photo-1493836512294-502baa1986e2", 900),
    accent: "Emotional Health",
  },
  {
    id: "educare",
    yearLabel: "2026",
    title: "Educare",
    subtitle: "Simple education plans for families and care teams.",
    tags: ["Resources", "Family"],
    image: unsplash("photo-1581056771107-24ca5f033842", 900),
    accent: "Health Literacy",
  },
];

export const navItems = ["Service", "Program", "Resource", "About"];
