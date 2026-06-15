import { createFileRoute } from "@tanstack/react-router";

import { getDashboardOverviewData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/api/dashboard/overview")({
  server: {
    handlers: {
      GET: async () => Response.json(await getDashboardOverviewData()),
    },
  },
});
