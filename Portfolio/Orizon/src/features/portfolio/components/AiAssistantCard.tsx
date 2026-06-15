import { Bot } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function AiAssistantCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="relative min-h-[136px] overflow-hidden border-0 p-4 transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(15,36,25,0.08)] sm:p-[22px_18px]">
        <div className="pointer-events-none absolute -right-4 top-2 size-28 rounded-full bg-[radial-gradient(circle,rgba(79,191,136,0.35),transparent_70%)] blur-sm" />
        <div className="pointer-events-none absolute right-2 top-4 size-24 rotate-12 rounded-[28px] bg-[linear-gradient(135deg,rgba(46,163,111,0.55),rgba(26,107,71,0.15))] shadow-[0_20px_40px_rgba(26,107,71,0.25)] backdrop-blur-md" />

        <p className="text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
          Question of the day
        </p>
        <h3 className="mt-1 max-w-[220px] text-base font-semibold tracking-tight text-foreground sm:text-lg">
          How are my investments doing?
        </h3>

        <Button
          variant="pillDark"
          className="relative z-10 mt-4 h-[38px] w-full max-w-none text-[13px] transition hover:scale-[1.015]"
          onClick={() =>
            toast.info('AI assistant is coming soon', {
              description: 'Portfolio insights will be available in the next release.',
            })
          }
        >
          <Bot className="size-4" strokeWidth={1.7} />
          Ask AI Assistant
        </Button>
      </Card>
    </motion.div>
  )
}
