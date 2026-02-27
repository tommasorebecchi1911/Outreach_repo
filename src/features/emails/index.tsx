import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, ExternalLink, Loader2, Mail, Send } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { AnimatedNumber } from '@/components/animated-number'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  useAziende,
  useAziendeRealtime,
  useSendEmail,
  useUpdateGeneratedEmail,
} from '@/features/aziende/data/hooks'
import { type Azienda } from '@/features/aziende/data/schema'

export function Emails() {
  const { data: aziende, isLoading } = useAziende()
  const { isSubscribed, lastEvent } = useAziendeRealtime()
  const [highlightedEmailId, setHighlightedEmailId] = useState<number | null>(
    null
  )
  const [sentSearch, setSentSearch] = useState('')
  const [sentDrawerOpen, setSentDrawerOpen] = useState(false)
  const [sentDrawerCompanyId, setSentDrawerCompanyId] = useState<number | null>(
    null
  )
  const sentCardRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  useEffect(() => {
    if (lastEvent?.id == null) return

    setHighlightedEmailId(lastEvent.id)
    const timeoutId = window.setTimeout(() => {
      setHighlightedEmailId(null)
    }, 1800)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [lastEvent?.at, lastEvent?.id])

  const companiesWithEmails = (aziende ?? []).filter((azienda) => {
    const targetEmail = azienda.email_target?.trim() ?? ''
    return targetEmail.length > 0
  })

  const sent = companiesWithEmails.filter((a) => a.email_inviata)
  const notSent = companiesWithEmails.filter((a) => !a.email_inviata)

  const filteredSent = useMemo(() => {
    const query = sentSearch.trim().toLowerCase()
    if (!query) return sent

    return sent.filter((azienda) => {
      const name = azienda.nome_azienda.toLowerCase()
      const target = (azienda.email_target ?? '').toLowerCase()
      const subject = (azienda.email_generata_oggetto ?? '').toLowerCase()
      return (
        name.includes(query) ||
        target.includes(query) ||
        subject.includes(query)
      )
    })
  }, [sent, sentSearch])

  const sentForSelectedCompany = useMemo(() => {
    if (sentDrawerCompanyId == null) return sent

    return sent.filter((azienda) => azienda.id_azienda === sentDrawerCompanyId)
  }, [sent, sentDrawerCompanyId])

  const selectedSentCompany = useMemo(() => {
    if (sentDrawerCompanyId == null) return null

    return companiesWithEmails.find(
      (azienda) => azienda.id_azienda === sentDrawerCompanyId
    )
  }, [companiesWithEmails, sentDrawerCompanyId])

  const jumpToSentEmail = (idAzienda: number) => {
    setSentSearch('')
    setSentDrawerOpen(false)
    setSentDrawerCompanyId(null)

    window.setTimeout(() => {
      const node = sentCardRefs.current.get(idAzienda)
      if (!node) return

      node.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setHighlightedEmailId(idAzienda)
      window.setTimeout(() => setHighlightedEmailId(null), 1800)
    }, 180)
  }

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
          <div className='mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground'>
            <span
              className={`size-2 rounded-full ${isSubscribed ? 'animate-pulse bg-emerald-500' : 'bg-amber-500'}`}
            />
            {isSubscribed
              ? 'Live updates enabled'
              : 'Connecting to live updates...'}
          </div>
        </div>

        <div className='mb-6 grid gap-4 sm:grid-cols-3'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatedNumber
                value={companiesWithEmails.length}
                className='block text-2xl font-bold'
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatedNumber
                value={sent.length}
                className='block text-2xl font-bold text-green-600'
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>
                Ready to Send
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatedNumber
                value={notSent.length}
                className='block text-2xl font-bold text-blue-600'
              />
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
            <section>
              <h3 className='mb-3 text-lg font-semibold'>Ready to Send</h3>
              <div className='space-y-3'>
                {companiesWithEmails.map((azienda) => (
                  <EmailCard
                    key={`ready-${azienda.id_azienda}`}
                    azienda={azienda}
                    editable
                    isHighlighted={highlightedEmailId === azienda.id_azienda}
                    onOpenSentDrawer={() => {
                      setSentDrawerCompanyId(azienda.id_azienda)
                      setSentDrawerOpen(true)
                    }}
                  />
                ))}
              </div>
            </section>

            {sent.length > 0 && (
              <section>
                <h3 className='mb-3 text-lg font-semibold'>Sent</h3>
                <div className='mb-3'>
                  <Input
                    value={sentSearch}
                    onChange={(event) => setSentSearch(event.target.value)}
                    placeholder='Search in sent emails...'
                  />
                </div>

                {filteredSent.length === 0 ? (
                  <Card>
                    <CardContent className='py-8 text-sm text-muted-foreground'>
                      No sent emails match your search.
                    </CardContent>
                  </Card>
                ) : (
                  <div className='space-y-3'>
                    {filteredSent.map((azienda) => (
                      <div
                        key={`sent-${azienda.id_azienda}`}
                        ref={(node) => {
                          if (node) {
                            sentCardRefs.current.set(azienda.id_azienda, node)
                          } else {
                            sentCardRefs.current.delete(azienda.id_azienda)
                          }
                        }}
                      >
                        <EmailCard
                          azienda={azienda}
                          isHighlighted={
                            highlightedEmailId === azienda.id_azienda
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </Main>

      <Sheet
        open={sentDrawerOpen}
        onOpenChange={(open) => {
          setSentDrawerOpen(open)
          if (!open) {
            setSentDrawerCompanyId(null)
          }
        }}
      >
        <SheetContent className='overflow-y-auto sm:max-w-md'>
          <SheetHeader>
            <SheetTitle>
              {selectedSentCompany
                ? `Sent Emails - ${selectedSentCompany.nome_azienda} (${sentForSelectedCompany.length})`
                : `Sent Emails (${sent.length})`}
            </SheetTitle>
            <SheetDescription>
              Click one item to jump to its card in the Sent section.
            </SheetDescription>
          </SheetHeader>

          {sentForSelectedCompany.length === 0 ? (
            <div className='px-4 text-sm text-muted-foreground'>
              No sent emails yet.
            </div>
          ) : (
            <div className='space-y-2 px-4 pb-4'>
              {sentForSelectedCompany.map((azienda) => (
                <Button
                  key={`sent-jump-${azienda.id_azienda}`}
                  variant='outline'
                  className='h-auto w-full justify-start py-2 text-start'
                  onClick={() => jumpToSentEmail(azienda.id_azienda)}
                >
                  <div className='min-w-0'>
                    <p className='truncate font-medium'>
                      {azienda.nome_azienda}
                    </p>
                    <p className='truncate text-xs text-muted-foreground'>
                      {azienda.email_target}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

function EmailCard({
  azienda,
  isHighlighted,
  editable = false,
  onOpenSentDrawer,
}: {
  azienda: Azienda
  isHighlighted?: boolean
  editable?: boolean
  onOpenSentDrawer?: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [subjectDraft, setSubjectDraft] = useState(
    azienda.email_generata_oggetto ?? ''
  )
  const [bodyDraft, setBodyDraft] = useState(azienda.email_generata_corpo ?? '')
  const [editingSubject, setEditingSubject] = useState(false)
  const [editingBody, setEditingBody] = useState(false)

  const sendEmail = useSendEmail(azienda.id_azienda)
  const updateEmail = useUpdateGeneratedEmail(azienda.id_azienda)

  useEffect(() => {
    setSubjectDraft(azienda.email_generata_oggetto ?? '')
    setBodyDraft(azienda.email_generata_corpo ?? '')
  }, [azienda.email_generata_corpo, azienda.email_generata_oggetto])

  const handleSend = async () => {
    try {
      await sendEmail.mutateAsync()
      toast.success(`Email sent to ${azienda.email_target}`)
    } catch {
      toast.error('Failed to send email')
    }
  }

  const saveEdits = async () => {
    const cleanSubject = subjectDraft.trim()
    const cleanBody = bodyDraft.trim()

    if (!cleanSubject || !cleanBody) {
      toast.error('Subject and body are required')
      return
    }

    try {
      await updateEmail.mutateAsync({
        subject: cleanSubject,
        body: cleanBody,
      })
      setEditingSubject(false)
      setEditingBody(false)
      toast.success('Email content updated')
    } catch {
      toast.error('Failed to update email content')
    }
  }

  const sentForCompany = azienda.email_inviata ? 1 : 0

  return (
    <Card
      className={cn(
        'animate-in transition-all duration-500 fade-in-0 slide-in-from-bottom-2',
        isHighlighted &&
          'shadow-md ring-2 ring-emerald-300 dark:ring-emerald-700'
      )}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-4'>
          <div className='min-w-0 flex-1'>
            <CardTitle className='text-base'>{azienda.nome_azienda}</CardTitle>
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
            {editable ? (
              <>
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

                {azienda.email_inviata && (
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={onOpenSentDrawer}
                    disabled={!onOpenSentDrawer}
                  >
                    Sent ({sentForCompany})
                  </Button>
                )}
              </>
            ) : (
              azienda.email_inviata && (
                <Badge className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'>
                  <CheckCircle2 className='me-1 size-3' />
                  Sent
                </Badge>
              )
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {editingSubject ? (
          <div className='mb-2 space-y-2'>
            <Input
              value={subjectDraft}
              onChange={(event) => setSubjectDraft(event.target.value)}
              placeholder='Email subject'
            />
            <div className='flex items-center gap-2'>
              <Button
                size='sm'
                onClick={saveEdits}
                disabled={updateEmail.isPending}
              >
                {updateEmail.isPending && <Loader2 className='animate-spin' />}
                Save subject
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  setSubjectDraft(azienda.email_generata_oggetto ?? '')
                  setEditingSubject(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            type='button'
            className={cn(
              'mb-2 block w-full text-left text-sm font-medium',
              editable && 'cursor-pointer hover:text-primary'
            )}
            onClick={() => editable && setEditingSubject(true)}
          >
            Subject: {subjectDraft || 'No subject'}
          </button>
        )}

        {expanded ? (
          <>
            <Separator className='my-2' />
            {editingBody ? (
              <div className='space-y-2'>
                <Textarea
                  value={bodyDraft}
                  onChange={(event) => setBodyDraft(event.target.value)}
                  rows={12}
                />
                <div className='flex items-center gap-2'>
                  <Button
                    size='sm'
                    onClick={saveEdits}
                    disabled={updateEmail.isPending}
                  >
                    {updateEmail.isPending && (
                      <Loader2 className='animate-spin' />
                    )}
                    Save body
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      setBodyDraft(azienda.email_generata_corpo ?? '')
                      setEditingBody(false)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type='button'
                className={cn(
                  'block w-full text-left',
                  editable &&
                    'cursor-pointer rounded-md transition-colors hover:bg-muted/40'
                )}
                onClick={() => editable && setEditingBody(true)}
              >
                <div
                  className='prose prose-sm dark:prose-invert max-w-none text-sm'
                  dangerouslySetInnerHTML={{
                    __html: bodyDraft || '<p>No body</p>',
                  }}
                />
              </button>
            )}

            <Button
              variant='ghost'
              size='sm'
              className='mt-2'
              onClick={() => {
                setExpanded(false)
                setEditingBody(false)
              }}
            >
              Show less
            </Button>
          </>
        ) : (
          <Button variant='ghost' size='sm' onClick={() => setExpanded(true)}>
            Show email body
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
