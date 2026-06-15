import { createFileRoute } from "@tanstack/react-router";

import { getDashboardOverviewData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/api/cards/")({
  server: {
    handlers: {
      GET: async () => {
        const overview = await getDashboardOverviewData();

        return Response.json(overview.cards);
      },
    },
  },
});
