import { createFileRoute } from "@tanstack/react-router";

import { getDashboardOverviewData } from "@/lib/dashboard-data";

export const Route = createFileRoute("/api/transactions/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const overview = await getDashboardOverviewData();
        const url = new URL(request.url);
        const query = url.searchParams.get("search")?.toLowerCase().trim();
        const status = url.searchParams.get("status");

        const transactions = overview.transactions.filter((transaction) => {
          const matchesQuery =
            !query ||
            [transaction.orderId, transaction.activity, transaction.status, transaction.date]
              .join(" ")
              .toLowerCase()
              .includes(query);
          const matchesStatus =
            !status || status === "all" || transaction.status === status;

          return matchesQuery && matchesStatus;
        });

        return Response.json(transactions);
      },
    },
  },
});
