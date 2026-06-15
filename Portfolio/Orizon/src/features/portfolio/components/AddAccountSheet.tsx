import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'

import { ScrollProgressPanel } from '@/components/ScrollProgressPanel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { addPortfolioAccount } from '@/features/portfolio/api/portfolio.functions'
import {
  addAccountSchema,
  type AddAccountFormValues,
} from '@/features/portfolio/schemas/portfolio.schema'
import { usePortfolioUiStore } from '@/features/portfolio/store/portfolio-ui.store'

export function AddAccountSheet() {
  const queryClient = useQueryClient()
  const { addSheetOpen, setAddSheetOpen } = usePortfolioUiStore()
  const addAccount = useServerFn(addPortfolioAccount)

  const form = useForm<AddAccountFormValues>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      accountType: 'wallet',
      provider: '',
      label: '',
      publicAddress: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (values: AddAccountFormValues) =>
      addAccount({ data: values }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      toast.success('Wallet added successfully')
      form.reset()
      setAddSheetOpen(false)
    },
    onError: (error: Error) => {
      toast.error('Failed to add account', { description: error.message })
    },
  })

  return (
    <Sheet open={addSheetOpen} onOpenChange={setAddSheetOpen}>
      <SheetContent className="flex h-full max-h-[92vh] flex-col gap-0 overflow-hidden p-0 md:max-h-none">
        <ScrollProgressPanel
          className="min-h-0 flex-1"
          bodyClassName="px-4 pb-6 md:px-6 md:pb-6"
          header={
            <div className="px-4 pt-4 md:px-6 md:pt-6">
              <SheetHeader>
                <SheetTitle>Add account</SheetTitle>
                <SheetDescription>
                  Connect a wallet, exchange, manual asset, or bank account.
                </SheetDescription>
              </SheetHeader>
            </div>
          }
        >
          <form
            className="grid gap-4 pt-4"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <div className="grid gap-2">
              <Label htmlFor="accountType">Account type</Label>
              <Controller
                name="accountType"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="accountType">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wallet">Wallet</SelectItem>
                      <SelectItem value="exchange">Exchange</SelectItem>
                      <SelectItem value="manual_asset">Manual asset</SelectItem>
                      <SelectItem value="bank">Bank account</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="provider">Provider</Label>
              <Input id="provider" placeholder="Coinbase" {...form.register('provider')} />
              {form.formState.errors.provider ? (
                <p className="text-xs text-red-500">
                  {form.formState.errors.provider.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="label">Label</Label>
              <Input id="label" placeholder="My wallet" {...form.register('label')} />
              {form.formState.errors.label ? (
                <p className="text-xs text-red-500">
                  {form.formState.errors.label.message}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="publicAddress">Public address (optional)</Label>
              <Input
                id="publicAddress"
                placeholder="0x..."
                {...form.register('publicAddress')}
              />
            </div>

            <SheetFooter className="gap-2 pt-2 sm:justify-between">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setAddSheetOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Adding...' : 'Add account'}
              </Button>
            </SheetFooter>
          </form>
        </ScrollProgressPanel>
      </SheetContent>
    </Sheet>
  )
}
