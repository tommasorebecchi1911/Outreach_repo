import { useState } from 'react'
import { Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { type Azienda } from './data/schema'
import { useAziende } from './data/hooks'
import { AziendeTable } from './components/aziende-table'
import { AziendaDetailDrawer } from './components/azienda-detail-drawer'
import { UploadDialog } from './components/upload-dialog'

export function Aziende() {
  const { data: aziende, isLoading } = useAziende()
  const [selectedAzienda, setSelectedAzienda] = useState<Azienda | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)

  const handleRowClick = (azienda: Azienda) => {
    setSelectedAzienda(azienda)
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
          </div>
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className='size-4' />
            Upload Excel
          </Button>
        </div>

        {isLoading ? (
          <div className='flex flex-1 items-center justify-center'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <AziendeTable
            data={aziende ?? []}
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
