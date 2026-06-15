import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

type Contact = {
  id: string;
  client_id: string;
  name: string;
  role_title: string | null;
  email: string | null;
  phone: string | null;
  is_primary: boolean;
};

export function ClientContactsPanel({ clientId }: { clientId: string }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Contact> | null>(null);

  const { data: contacts } = useQuery({
    queryKey: ["client-contacts", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_contacts")
        .select("*")
        .eq("client_id", clientId)
        .order("is_primary", { ascending: false });
      if (error) throw error;
      return data as Contact[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Partial<Contact>) => {
      if (p.id) {
        const { error } = await supabase.from("client_contacts").update(p as never).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("client_contacts").insert({ ...p, client_id: clientId } as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Contact saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["client-contacts", clientId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("client_contacts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client-contacts", clientId] }),
  });

  return (
    <div className="space-y-3 border-t border-border/60 pt-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Contacts</Label>
        <Button type="button" size="sm" variant="outline" onClick={() => setEditing({ is_primary: false })}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add
        </Button>
      </div>
      {(contacts ?? []).map((c) => (
        <Card key={c.id} className="flex items-start justify-between gap-2 p-3 text-sm">
          <div>
            <div className="font-medium">{c.name}{c.is_primary && <span className="ml-2 text-[10px] text-gold">Primary</span>}</div>
            <div className="text-xs text-muted-foreground">{c.role_title ?? "—"} · {c.email ?? c.phone ?? "—"}</div>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button size="icon" variant="ghost" onClick={() => setEditing(c)}><Pencil className="h-3.5 w-3.5" /></Button>
            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove.mutate(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
          </div>
        </Card>
      ))}
      {editing && (
        <Card className="space-y-3 p-3">
          <Input placeholder="Name *" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          <Input placeholder="Role" value={editing.role_title ?? ""} onChange={(e) => setEditing({ ...editing, role_title: e.target.value })} />
          <Input type="email" placeholder="Email" value={editing.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
          <PhoneInput value={editing.phone} onChange={(v) => setEditing({ ...editing, phone: v ?? null })} />
          <label className="flex items-center gap-2 text-xs">
            <Checkbox checked={editing.is_primary ?? false} onCheckedChange={(v) => setEditing({ ...editing, is_primary: !!v })} />
            Primary contact
          </label>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="button" size="sm" disabled={!editing.name?.trim() || save.isPending} onClick={() => save.mutate(editing)}>Save</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
