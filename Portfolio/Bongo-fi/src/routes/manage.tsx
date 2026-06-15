import { createFileRoute } from "@tanstack/react-router";

import { DevelopmentPage } from "@/components/DevelopmentPage";

export const Route = createFileRoute("/manage")({
  component: ManagePage,
});

function ManagePage() {
  return <DevelopmentPage title="Manage" />;
}
