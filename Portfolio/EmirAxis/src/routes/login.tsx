import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Mail, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useBranding } from "@/lib/branding/BrandingProvider";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — EmirAxis" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { branding } = useBranding();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/dashboard", replace: true });
  }, [isAuthenticated, navigate]);

  const handleEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const fullName = String(fd.get("full_name") ?? "").trim();
    if (!email || !password) return toast.error("Email and password are required");
    if (mode === "signup" && password.length < 8) return toast.error("Password must be at least 8 characters");

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { full_name: fullName } },
        });
        if (error) throw error;
        toast.success("Account created. Check your inbox to confirm your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link to="/" className="flex items-center text-primary-foreground">
          {(branding.logo_dark_url || branding.logo_url) ? (
            <img
              src={(branding.logo_dark_url || branding.logo_url) as string}
              alt={branding.company_name}
              className="h-12 w-auto object-contain"
            />
          ) : (
            <span className="font-semibold tracking-tight">{branding.company_name}</span>
          )}
        </Link>
        <div className="relative">
          <h2 className="font-display text-4xl leading-tight text-primary-foreground xl:text-5xl">
            The command center for UAE workforce operations.
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/75">
            Staffing, visas, payroll, compliance and deployment — one axis for every workflow, from onboarding to WPS.
          </p>
        </div>
        <div className="text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} {branding.company_name}
        </div>
        <div className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-gold/30 blur-3xl" />
      </div>

      {/* Right — form */}
      <div className="flex min-w-0 items-center justify-center bg-gradient-sand p-4 sm:p-10">
        <Card className="w-full min-w-0 max-w-md border-border/60 p-5 shadow-elegant sm:p-8">
          <div className="lg:hidden mb-6 flex items-center">
            {branding.logo_url ? (
              <img src={branding.logo_url} alt={branding.company_name} className="h-10 w-auto object-contain" />
            ) : (
              <span className="font-semibold">{branding.company_name}</span>
            )}
          </div>


          <h1 className="font-display text-2xl text-primary sm:text-3xl">Welcome</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue or create a new workspace.</p>

          <Tabs value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <EmailForm onSubmit={handleEmail} loading={loading} mode="signin" />
            </TabsContent>
            <TabsContent value="signup" className="mt-6">
              <EmailForm onSubmit={handleEmail} loading={loading} mode="signup" />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

function EmailForm({ onSubmit, loading, mode }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; loading: boolean; mode: "signin" | "signup" }) {
  const [termsAccepted, setTermsAccepted] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error("You must agree to the terms and privacy policy");
      return;
    }
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" && (
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Full name</Label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="full_name" name="full_name" required className="pl-9" placeholder="Sara Al Mansouri" />
          </div>
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="email">Work email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="email" name="email" type="email" required className="pl-9" placeholder="you@agency.ae" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <PasswordInput id="password" name="password" required minLength={mode === "signup" ? 8 : undefined} placeholder="••••••••" />
      </div>
      <div className="flex items-start gap-2.5">
        <Checkbox
          id={`terms-${mode}`}
          checked={termsAccepted}
          onCheckedChange={(v) => setTermsAccepted(v === true)}
          className="mt-0.5"
        />
        <label htmlFor={`terms-${mode}`} className="cursor-pointer text-xs leading-snug text-muted-foreground">
          I agree to the terms and privacy policy.
        </label>
      </div>
      <Button type="submit" disabled={loading || !termsAccepted} className="w-full bg-primary hover:bg-primary/90">
        {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        <ArrowRight className="ml-1.5 h-4 w-4" />
      </Button>
    </form>
  );
}
