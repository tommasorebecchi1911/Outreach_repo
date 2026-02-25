import { createFileRoute } from '@tanstack/react-router'
import { Aziende } from '@/features/aziende'

export const Route = createFileRoute('/_authenticated/aziende/')(
  {
    component: Aziende,
  }
)
