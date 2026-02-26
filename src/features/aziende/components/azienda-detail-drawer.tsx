import { useState } from 'react'
import {
  ExternalLink,
  Globe,
  Loader2,
  Mail,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useSendEmail } from '../data/hooks'
import { type Azienda } from '../data/schema'

type AziendaDetailDrawerProps = {
  azienda: Azienda | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusConfig: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  pending: {
    icon: Clock,
    color: 'text-yellow-600',
    label: 'Pending',
  },
  processing: {
    icon: Loader2,
    color: 'text-blue-600',
    label: 'Processing',
  },
  completed: {
    icon: CheckCircle2,
    color: 'text-green-600',
    label: 'Completed',
  },
  error: {
    icon: AlertTriangle,
    color: 'text-red-600',
    label: 'Error',
  },
}

export function AziendaDetailDrawer({
  azienda,
  open,
  onOpenChange,
}: AziendaDetailDrawerProps) {
  const [isSending, setIsSending] = useState(false)
  const sendEmail = useSendEmail(azienda?.id_azienda ?? 0)

  if (!azienda) return null

  const status = azienda.status_processo ?? 'pending'
  const statusInfo = statusConfig[status] ?? statusConfig.pending
  const StatusIcon = statusInfo.icon

  const handleSendEmail = async () => {
    if (!azienda.email_generata_corpo || !azienda.email_target) {
      toast.error('No email content or target email available')
      return
    }
    setIsSending(true)
    try {
      await sendEmail.mutateAsync()
      toast.success('Email sent successfully!')
    } catch {
      toast.error('Failed to send email')
    } finally {
      setIsSending(false)
    }
  }

  const address = [
    azienda.indirizzo,
    azienda.comune,
    azienda.cap,
    azienda.provincia,
    azienda.regione,
  ]
    .filter(Boolean)
    .join(', ')
  const websiteUrl =
    typeof azienda.website_url === 'string' ? azienda.website_url : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='overflow-y-auto sm:max-w-lg'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <Building2 className='size-5' />
            {azienda.nome_azienda}
          </SheetTitle>
          <SheetDescription>VAT: {azienda.partita_iva}</SheetDescription>
        </SheetHeader>

        <div className='space-y-6 px-4 pb-6'>
          {/* Status */}
          <div className='flex items-center gap-2'>
            <StatusIcon
              className={`size-5 ${statusInfo.color} ${status === 'processing' ? 'animate-spin' : ''}`}
            />
            <span className={`font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            {azienda.email_inviata && (
              <Badge className='ms-auto'>Email Sent</Badge>
            )}
          </div>

          <Separator />

          {/* Company Info */}
          <section className='space-y-2'>
            <h3 className='text-sm font-semibold'>Company Information</h3>
            {address && (
              <p className='text-sm text-muted-foreground'>{address}</p>
            )}
          </section>

          {/* Website */}
          {websiteUrl && (
            <>
              <Separator />
              <section className='space-y-2'>
                <h3 className='flex items-center gap-2 text-sm font-semibold'>
                  <Globe className='size-4' />
                  Website Found
                </h3>
                <a
                  href={websiteUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400'
                >
                  {websiteUrl}
                  <ExternalLink className='size-3' />
                </a>
              </section>
            </>
          )}

          {/* Contact Data */}
          {azienda.email_target && (
            <>
              <Separator />
              <section className='space-y-2'>
                <h3 className='flex items-center gap-2 text-sm font-semibold'>
                  <Mail className='size-4' />
                  Contact Email
                </h3>
                <p className='text-sm'>{azienda.email_target}</p>
              </section>
            </>
          )}

          {/* Raw Contact Data */}
          {Boolean(azienda.dati_contatto_raw) && (
            <>
              <Separator />
              <section className='space-y-2'>
                <h3 className='text-sm font-semibold'>
                  Extracted Contact Data
                </h3>
                <pre className='max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs'>
                  {String(JSON.stringify(azienda.dati_contatto_raw, null, 2))}
                </pre>
              </section>
            </>
          )}

          {/* Generated Email */}
          {azienda.email_generata_oggetto && (
            <>
              <Separator />
              <section className='space-y-3'>
                <h3 className='flex items-center gap-2 text-sm font-semibold'>
                  <Send className='size-4' />
                  Generated Email
                </h3>
                <div className='rounded-md border p-4'>
                  <p className='mb-2 text-sm font-medium'>
                    Subject: {azienda.email_generata_oggetto}
                  </p>
                  <Separator className='my-2' />
                  <div
                    className='prose prose-sm dark:prose-invert max-w-none text-sm'
                    dangerouslySetInnerHTML={{
                      __html: azienda.email_generata_corpo ?? '',
                    }}
                  />
                </div>

                {!azienda.email_inviata && azienda.email_target && (
                  <Button
                    onClick={handleSendEmail}
                    disabled={isSending}
                    className='w-full'
                  >
                    {isSending ? (
                      <Loader2 className='animate-spin' />
                    ) : (
                      <Send className='size-4' />
                    )}
                    Send Email
                  </Button>
                )}
              </section>
            </>
          )}

          {/* Error Log */}
          {azienda.log_errori && (
            <>
              <Separator />
              <section className='space-y-2'>
                <h3 className='flex items-center gap-2 text-sm font-semibold text-red-600'>
                  <AlertTriangle className='size-4' />
                  Error Log
                </h3>
                <pre className='max-h-32 overflow-auto rounded-md bg-red-50 p-3 text-xs text-red-800 dark:bg-red-950 dark:text-red-300'>
                  {azienda.log_errori}
                </pre>
              </section>
            </>
          )}

          {/* Search Query */}
          {azienda.search_query_generated && (
            <>
              <Separator />
              <section className='space-y-2'>
                <h3 className='text-sm font-semibold text-muted-foreground'>
                  AI Search Query
                </h3>
                <p className='text-sm text-muted-foreground italic'>
                  &ldquo;{azienda.search_query_generated}&rdquo;
                </p>
              </section>
            </>
          )}

          {/* Timestamp */}
          {azienda.last_processed_at && (
            <p className='text-xs text-muted-foreground'>
              Last processed:{' '}
              {new Date(azienda.last_processed_at).toLocaleString()}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
