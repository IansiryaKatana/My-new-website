import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageBack({ to, label = "Back" }: { to: string; label?: string }) {
  return (
    <div className="mb-4 flex justify-end">
      <Button variant="outline" size="sm" asChild>
        <Link to={to}>
          <ArrowLeft className="mr-2 h-3.5 w-3.5" />
          {label}
        </Link>
      </Button>
    </div>
  );
}
