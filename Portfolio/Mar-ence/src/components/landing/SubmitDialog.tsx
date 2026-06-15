import { useState } from 'react'
import { getSupabase } from '#/integrations/supabase/client'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

type SubmitDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  formType?: 'opportunity' | 'contact'
}

export function SubmitDialog({
  open,
  onOpenChange,
  formType = 'opportunity',
}: SubmitDialogProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [busy, setBusy] = useState(false)

  const title =
    formType === 'opportunity' ? 'Submit Opportunity' : "Let's Talk"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setBusy(true)
    const sb = getSupabase()

    if (sb) {
      const { error: insertError } = await sb.from('form_submissions').insert({
        id: crypto.randomUUID(),
        form_type: formType,
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || null,
        message: message.trim() || null,
        status: 'new',
      })
      if (insertError) {
        setError(insertError.message)
        setBusy(false)
        return
      }
    }

    setSuccess(true)
    setBusy(false)
    setName('')
    setEmail('')
    setCompany('')
    setMessage('')
    setTimeout(() => {
      setSuccess(false)
      onOpenChange(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {success ? (
          <p className="text-sm text-green-700 py-4">
            Thank you. We will be in touch shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                className="admin-input min-h-[100px] resize-y w-full"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? 'Sending…' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
