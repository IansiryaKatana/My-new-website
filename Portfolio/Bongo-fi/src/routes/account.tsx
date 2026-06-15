import { createFileRoute } from "@tanstack/react-router";

import { DevelopmentPage } from "@/components/DevelopmentPage";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

function AccountPage() {
  return <DevelopmentPage title="Account" />;
}
