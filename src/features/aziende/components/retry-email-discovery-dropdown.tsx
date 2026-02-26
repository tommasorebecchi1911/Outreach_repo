import { useEffect, useMemo, useState } from 'react'
import { CheckIcon } from '@radix-ui/react-icons'
import { ChevronDown, Loader2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useRetryEmailDiscovery } from '../data/hooks'

type RetryCompany = {
  id_azienda: number
  nome_azienda: string
}

type RetryEmailDiscoveryDropdownProps = {
  companies: RetryCompany[]
}

export function RetryEmailDiscoveryDropdown({
  companies,
}: RetryEmailDiscoveryDropdownProps) {
  const retryEmailDiscovery = useRetryEmailDiscovery()
  const [open, setOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])

  useEffect(() => {
    const availableIds = new Set(companies.map((company) => company.id_azienda))
    setSelectedIds((current) =>
      current.filter((idAzienda) => availableIds.has(idAzienda))
    )
  }, [companies])

  const toggleCompany = (idAzienda: number) => {
    setSelectedIds((current) => {
      if (current.includes(idAzienda)) {
        return current.filter((id) => id !== idAzienda)
      }

      return [...current, idAzienda]
    })
  }

  const handleSelectAll = () => {
    setSelectedIds(companies.map((company) => company.id_azienda))
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  const handleRetry = async () => {
    if (selectedIds.length === 0) return

    try {
      const queuedCount = await retryEmailDiscovery.mutateAsync(selectedIds)
      toast.success(
        `Queued ${queuedCount} compan${queuedCount === 1 ? 'y' : 'ies'} for email rediscovery.`
      )
      setSelectedIds([])
      setOpen(false)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to queue companies for retry.'
      toast.error(message)
    }
  }

  const disabled = companies.length === 0
  const hasSelection = selectedIds.length > 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' disabled={disabled}>
          <RotateCcw className='size-4' />
          Retry Missing Emails
          {selectedIds.length > 0 && (
            <span className='rounded bg-muted px-1.5 py-0.5 text-xs'>
              {selectedIds.length}
            </span>
          )}
          <ChevronDown className='size-4 opacity-60' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[340px] p-0' align='end'>
        <div className='flex items-center justify-between border-b px-3 py-2'>
          <p className='text-xs font-medium text-muted-foreground'>
            Select companies to recheck email discovery
          </p>
          <Button
            variant='ghost'
            size='sm'
            className='h-7 px-2 text-xs'
            disabled={disabled}
            onClick={hasSelection ? handleClearSelection : handleSelectAll}
          >
            {hasSelection ? 'Clear' : 'Select all'}
          </Button>
        </div>

        <Command>
          <CommandInput placeholder='Search company...' />
          <CommandList className='max-h-[260px] overscroll-contain'>
            <CommandEmpty>No company found.</CommandEmpty>
            <CommandGroup>
              {companies.map((company) => {
                const isSelected = selectedSet.has(company.id_azienda)

                return (
                  <CommandItem
                    key={company.id_azienda}
                    value={`${company.nome_azienda} ${company.id_azienda}`}
                    onSelect={() => toggleCompany(company.id_azienda)}
                  >
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className='size-4' />
                    </div>
                    <span className='truncate'>{company.nome_azienda}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            <CommandSeparator />
            <div className='flex items-center justify-end p-2'>
              <Button
                size='sm'
                className='h-8'
                disabled={
                  selectedIds.length === 0 || retryEmailDiscovery.isPending
                }
                onClick={handleRetry}
              >
                {retryEmailDiscovery.isPending ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  <RotateCcw className='size-4' />
                )}
                Retry selected
              </Button>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
