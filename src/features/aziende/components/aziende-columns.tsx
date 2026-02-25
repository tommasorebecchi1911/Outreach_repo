import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Azienda } from '../data/schema'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

export const aziendeColumns: ColumnDef<Azienda>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'nome_azienda',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Company Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48 ps-3 font-medium'>
        {row.getValue('nome_azienda')}
      </LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'partita_iva',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='VAT Number' />
    ),
    cell: ({ row }) => (
      <div className='text-nowrap font-mono text-sm'>
        {row.getValue('partita_iva')}
      </div>
    ),
  },
  {
    accessorKey: 'comune',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='City' />
    ),
    cell: ({ row }) => (
      <div className='text-sm'>{row.getValue('comune') ?? '—'}</div>
    ),
  },
  {
    accessorKey: 'provincia',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Province' />
    ),
    cell: ({ row }) => (
      <div className='text-sm'>{row.getValue('provincia') ?? '—'}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'regione',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Region' />
    ),
    cell: ({ row }) => (
      <div className='text-sm'>{row.getValue('regione') ?? '—'}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'status_processo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = (row.getValue('status_processo') as string) ?? 'pending'
      return (
        <Badge
          variant='outline'
          className={cn('capitalize', statusColors[status])}
        >
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'website_url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Website' />
    ),
    cell: ({ row }) => {
      const url = row.getValue('website_url') as string | null
      if (!url) return <span className='text-muted-foreground'>—</span>
      return (
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='max-w-40 truncate text-sm text-blue-600 underline hover:text-blue-800 dark:text-blue-400'
        >
          {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </a>
      )
    },
  },
  {
    accessorKey: 'email_target',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email Found' />
    ),
    cell: ({ row }) => {
      const email = row.getValue('email_target') as string | null
      return (
        <div className='text-sm'>
          {email ?? <span className='text-muted-foreground'>—</span>}
        </div>
      )
    },
  },
  {
    accessorKey: 'email_inviata',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email Sent' />
    ),
    cell: ({ row }) => {
      const sent = row.getValue('email_inviata') as boolean
      return (
        <Badge variant={sent ? 'default' : 'outline'}>
          {sent ? 'Sent' : 'Not sent'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(String(row.getValue(id)))
    },
    enableSorting: false,
  },
]
