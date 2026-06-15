import { createFileRoute } from "@tanstack/react-router";

import { DevelopmentPage } from "@/components/DevelopmentPage";

export const Route = createFileRoute("/activity")({
  component: ActivityPage,
});

function ActivityPage() {
  return <DevelopmentPage title="Activity" />;
}
