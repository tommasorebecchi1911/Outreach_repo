import { createFileRoute } from '@tanstack/react-router'
import { Emails } from '@/features/emails'

export const Route = createFileRoute('/_authenticated/emails/')({
  component: Emails,
})
