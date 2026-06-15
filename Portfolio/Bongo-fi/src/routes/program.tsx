import { createFileRoute } from "@tanstack/react-router";

import { DevelopmentPage } from "@/components/DevelopmentPage";

export const Route = createFileRoute("/program")({
  component: ProgramPage,
});

function ProgramPage() {
  return <DevelopmentPage title="Program" />;
}
