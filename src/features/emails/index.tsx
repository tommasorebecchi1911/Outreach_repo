import { useState } from 'react'
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  Send,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAziende, useSendEmail } from '@/features/aziende/data/hooks'
import { type Azienda } from '@/features/aziende/data/schema'

export function Emails() {
  const { data: aziende, isLoading, refetch } = useAziende()

  const companiesWithEmails = (aziende ?? []).filter(
    (a) => a.email_generata_oggetto && a.email_generata_corpo
  )

  const sent = companiesWithEmails.filter((a) => a.email_inviata)
  const notSent = companiesWithEmails.filter((a) => !a.email_inviata)

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold tracking-tight'>Emails</h2>
          <p className='text-muted-foreground'>
            View AI-generated emails and send them to company contacts.
          </p>
        </div>

        <div className='mb-6 grid gap-4 sm:grid-cols-3'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {companiesWithEmails.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                {sent.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Ready to Send
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-blue-600'>
                {notSent.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : companiesWithEmails.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <Mail className='mb-4 size-12 text-muted-foreground' />
              <p className='text-lg font-medium'>No emails generated yet</p>
              <p className='text-sm text-muted-foreground'>
                Emails will appear here once the AI enrichment pipeline
                processes your companies.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {notSent.length > 0 && (
              <section>
                <h3 className='mb-3 text-lg font-semibold'>Ready to Send</h3>
                <div className='space-y-3'>
                  {notSent.map((azienda) => (
                    <EmailCard
                      key={azienda.id_azienda}
                      azienda={azienda}
                      onSent={() => refetch()}
                    />
                  ))}
                </div>
              </section>
            )}

            {sent.length > 0 && (
              <section>
                <h3 className='mb-3 text-lg font-semibold'>Sent</h3>
                <div className='space-y-3'>
                  {sent.map((azienda) => (
                    <EmailCard
                      key={azienda.id_azienda}
                      azienda={azienda}
                      onSent={() => refetch()}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </Main>
    </>
  )
}

function EmailCard({
  azienda,
  onSent,
}: {
  azienda: Azienda
  onSent: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const sendEmail = useSendEmail(azienda.id_azienda)

  const handleSend = async () => {
    try {
      await sendEmail.mutateAsync()
      toast.success(`Email sent to ${azienda.email_target}`)
      onSent()
    } catch {
      toast.error('Failed to send email')
    }
  }

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0 flex-1'>
            <CardTitle className='text-base'>
              {azienda.nome_azienda}
            </CardTitle>
            <CardDescription className='flex items-center gap-2'>
              <span>To: {azienda.email_target ?? 'N/A'}</span>
              {azienda.website_url && (
                <a
                  href={azienda.website_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400'
                >
                  <ExternalLink className='size-3' />
                </a>
              )}
            </CardDescription>
          </div>
          <div className='flex items-center gap-2'>
            {azienda.email_inviata ? (
              <Badge className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'>
                <CheckCircle2 className='me-1 size-3' />
                Sent
              </Badge>
            ) : (
              <Button
                size='sm'
                onClick={handleSend}
                disabled={sendEmail.isPending || !azienda.email_target}
              >
                {sendEmail.isPending ? (
                  <Loader2 className='animate-spin' />
                ) : (
                  <Send className='size-4' />
                )}
                Send
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className='mb-2 text-sm font-medium'>
          Subject: {azienda.email_generata_oggetto}
        </p>
        {expanded ? (
          <>
            <Separator className='my-2' />
            <div
              className='prose prose-sm dark:prose-invert max-w-none text-sm'
              dangerouslySetInnerHTML={{
                __html: azienda.email_generata_corpo ?? '',
              }}
            />
            <Button
              variant='ghost'
              size='sm'
              className='mt-2'
              onClick={() => setExpanded(false)}
            >
              Show less
            </Button>
          </>
        ) : (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setExpanded(true)}
          >
            Show email body
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
