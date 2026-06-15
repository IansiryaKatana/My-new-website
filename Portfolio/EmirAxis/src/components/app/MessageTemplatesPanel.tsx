import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Plus, Pencil, Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fillTemplate, openWhatsApp, sendWhatsAppCloudMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

type Template = {
  id: string;
  name: string;
  channel: string;
  category: string | null;
  body: string;
  is_active: boolean;
};

const CHANNELS = ["whatsapp", "sms", "email"] as const;

export function MessageTemplatesPanel() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Template> | null>(null);
  const [sendOpen, setSendOpen] = useState<Template | null>(null);
  const [phone, setPhone] = useState("");
  const [vars, setVars] = useState<Record<string, string>>({});

  const { data: rows } = useQuery({
    queryKey: ["message_templates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("message_templates").select("*").order("name");
      if (error) throw error;
      return data as Template[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Partial<Template>) => {
      if (p.id) {
        const { error } = await supabase.from("message_templates").update(p as never).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("message_templates").insert(p as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Template saved");
      setOpen(false);
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["message_templates"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("message_templates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["message_templates"] }),
  });

  const preview = sendOpen ? fillTemplate(sendOpen.body, vars) : "";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open || !!editing} onOpenChange={(o) => { if (!o) { setOpen(false); setEditing(null); } }}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => { setEditing({ channel: "whatsapp", is_active: true, body: "Dear {{name}}, " }); setOpen(true); }}>
              <Plus className="mr-1.5 h-4 w-4" /> New template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing?.id ? "Edit template" : "New template"}</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-3">
                <div><Label>Name</Label><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                <div className="form-grid-2">
                  <div><Label>Channel</Label>
                    <Select value={editing.channel ?? "whatsapp"} onValueChange={(v) => setEditing({ ...editing, channel: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{CHANNELS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Category</Label><Input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
                </div>
                <div><Label>Body (use {"{{name}}"} placeholders)</Label><Textarea rows={4} value={editing.body ?? ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} /></div>
                <label className="flex items-center gap-2 text-sm"><Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} /> Active</label>
              </div>
            )}
            <DialogFooter>
              <Button disabled={!editing?.name || !editing?.body || save.isPending} onClick={() => save.mutate(editing!)}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="table-shell border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {(rows ?? []).map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{t.channel}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{t.category ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setSendOpen(t); setVars({}); setPhone(""); }} title="Send"><Send className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(t); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove.mutate(t.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!sendOpen} onOpenChange={(o) => !o && setSendOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Send: {sendOpen?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Phone (E.164 or UAE local)</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971501234567" /></div>
            {["name", "date", "center", "month", "net", "type", "client", "driver", "plate", "terminal", "supervisor"].map((key) => (
              <div key={key}><Label className="capitalize">{key}</Label><Input value={vars[key] ?? ""} onChange={(e) => setVars({ ...vars, [key]: e.target.value })} /></div>
            ))}
            <div className="rounded-md border border-border/60 bg-muted/30 p-3 text-sm">{preview || "—"}</div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => phone && openWhatsApp(phone, preview)}><MessageSquare className="mr-1.5 h-4 w-4" /> Open WhatsApp</Button>
            <Button onClick={async () => {
              if (!phone) { toast.error("Phone required"); return; }
              const res = await sendWhatsAppCloudMessage(phone, preview);
              if (res.ok) toast.success("Sent via WhatsApp API or opened chat");
              else toast.error(res.error ?? "Failed");
            }}>Send API / fallback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
