import { createFileRoute } from "@tanstack/react-router";

import { DevelopmentPage } from "@/components/DevelopmentPage";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  return <DevelopmentPage title="Reports" />;
}
