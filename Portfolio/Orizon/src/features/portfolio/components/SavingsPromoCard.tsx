import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

import { Card } from '@/components/ui/card'

export function SavingsPromoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="relative mt-0 min-h-[136px] overflow-hidden border-0 p-4 transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(15,36,25,0.08)] sm:mt-3 sm:p-[22px_18px]">
        <div className="pointer-events-none absolute -right-6 -bottom-8 size-32 rounded-full bg-[radial-gradient(circle,rgba(255,210,80,0.35),transparent_70%)]" />
        <div className="pointer-events-none absolute right-0 bottom-0 size-24 translate-x-4 translate-y-4 rounded-full bg-[linear-gradient(180deg,#ffd86b,#ffb703)] shadow-[0_18px_30px_rgba(255,183,3,0.35)]" />
        <div className="pointer-events-none absolute right-10 bottom-2 size-16 rounded-full bg-[linear-gradient(180deg,#ffe08a,#ffc947)] opacity-90" />

        <h3 className="max-w-[210px] text-base font-semibold tracking-tight text-foreground sm:text-lg">
          High interest is in your interest
        </h3>
        <button
          type="button"
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.08em] text-primary uppercase"
        >
          Start saving
          <ChevronRight className="size-3.5" strokeWidth={1.7} />
        </button>
      </Card>
    </motion.div>
  )
}
