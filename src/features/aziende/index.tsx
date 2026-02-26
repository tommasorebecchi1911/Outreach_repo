import { useEffect, useState } from 'react'
import { Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AziendaDetailDrawer } from './components/azienda-detail-drawer'
import { AziendeTable } from './components/aziende-table'
import { RetryEmailDiscoveryDropdown } from './components/retry-email-discovery-dropdown'
import { UploadDialog } from './components/upload-dialog'
import { useAziende, useAziendeRealtime } from './data/hooks'
import { type Azienda } from './data/schema'

export function Aziende() {
  const { data: aziende, isLoading } = useAziende()
  const { isSubscribed, lastEvent } = useAziendeRealtime()
  const [selectedAziendaId, setSelectedAziendaId] = useState<number | null>(
    null
  )
  const [detailOpen, setDetailOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null)

  const selectedAzienda =
    (aziende ?? []).find(
      (azienda) => azienda.id_azienda === selectedAziendaId
    ) ?? null
  const retryCandidates = (aziende ?? [])
    .filter((azienda) => {
      const email = azienda.email_target?.trim() ?? ''
      return email.length === 0
    })
    .map((azienda) => ({
      id_azienda: azienda.id_azienda,
      nome_azienda: azienda.nome_azienda,
    }))

  useEffect(() => {
    if (lastEvent?.id == null) return

    setHighlightedRowId(lastEvent.id)
    const timeoutId = window.setTimeout(() => {
      setHighlightedRowId(null)
    }, 1800)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [lastEvent?.at, lastEvent?.id])

  const handleRowClick = (azienda: Azienda) => {
    setSelectedAziendaId(azienda.id_azienda)
    setDetailOpen(true)
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

      <Main fixed>
        <div className='mb-4 flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Companies</h2>
            <p className='text-muted-foreground'>
              Manage your imported companies and track AI enrichment progress.
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
          <div className='flex flex-wrap items-center gap-2'>
            <RetryEmailDiscoveryDropdown companies={retryCandidates} />
            <Button onClick={() => setUploadOpen(true)}>
              <Upload className='size-4' />
              Upload Excel
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className='flex flex-1 items-center justify-center'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <AziendeTable
            data={aziende ?? []}
            highlightedRowId={highlightedRowId}
            onRowClick={handleRowClick}
          />
        )}
      </Main>

      <AziendaDetailDrawer
        azienda={selectedAzienda}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </>
  )
}
