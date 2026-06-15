import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { BongoFiDashboard } from "@/components/BongoFiDashboard";
import { getDashboardOverviewData } from "@/lib/dashboard-data";

const getDashboardOverview = createServerFn({ method: "GET" }).handler(async () =>
  getDashboardOverviewData(),
);

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => getDashboardOverview(),
});

function Home() {
  const overview = Route.useLoaderData();

  return <BongoFiDashboard overview={overview} />;
}
