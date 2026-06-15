import { createFileRoute } from "@tanstack/react-router";

import { getDashboardOverviewData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/api/analytics/income/")({
  server: {
    handlers: {
      GET: async () => {
        const overview = await getDashboardOverviewData();

        return Response.json(overview.incomeChart);
      },
    },
  },
});
