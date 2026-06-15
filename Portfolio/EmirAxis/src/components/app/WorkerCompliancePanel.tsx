import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import { getWorkerCompliance } from "@/lib/workflows";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

const LABELS: Record<string, string> = {
  passport: "Passport on file",
  visa: "Visa expiry",
  emirates_id: "Emirates ID",
  labor_card: "Labour card",
  medical: "Medical fitness",
  bank_iban: "Bank / WPS details",
  passport_doc: "Passport document upload",
};

export function WorkerCompliancePanel({ workerId }: { workerId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["worker-compliance", workerId],
    enabled: !!workerId,
    queryFn: () => getWorkerCompliance(workerId),
  });

  if (isLoading) return <Skeleton className="h-24 w-full" />;
  if (!data?.ok) return null;

  const missing = (data.missing as string[] | undefined) ?? [];
  const score = data.score ?? 0;

  return (
    <Card className="space-y-3 border-border/60 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck className="h-4 w-4 text-gold" />
          Compliance readiness
        </div>
        {data.complete ? (
          <Badge className="bg-success/15 text-success"><CheckCircle2 className="mr-1 h-3 w-3" /> Cleared</Badge>
        ) : (
          <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" /> Incomplete</Badge>
        )}
      </div>
      <Progress value={score} className="h-2" />
      <p className="text-xs text-muted-foreground">Score {score}/100 — required before deployment.</p>
      {missing.length > 0 && (
        <ul className="space-y-1 text-xs text-muted-foreground">
          {missing.map((m) => (
            <li key={m} className="flex items-center gap-1.5 text-warning">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              {LABELS[m] ?? m}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
