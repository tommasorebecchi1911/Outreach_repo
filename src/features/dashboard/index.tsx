import {
  Building2,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAziendaStats } from '@/features/aziende/data/hooks'
import { Overview } from './components/overview'

export function Dashboard() {
  const { data: stats, isLoading } = useAziendaStats()

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-4'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Overview of your company enrichment pipeline.
          </p>
        </div>

        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Companies
                  </CardTitle>
                  <Building2 className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats?.total ?? 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    imported from Excel files
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Processing Queue
                  </CardTitle>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {(stats?.pending ?? 0) + (stats?.processing ?? 0)}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {stats?.pending ?? 0} pending, {stats?.processing ?? 0}{' '}
                    processing
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Completed
                  </CardTitle>
                  <CheckCircle2 className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-green-600'>
                    {stats?.completed ?? 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    enriched with AI data
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Emails Sent
                  </CardTitle>
                  <Mail className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-blue-600'>
                    {stats?.emailsSent ?? 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    delivered via Resend
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Processing Overview</CardTitle>
                </CardHeader>
                <CardContent className='ps-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Pipeline Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <StatusBar
                      label='Pending'
                      value={stats?.pending ?? 0}
                      total={stats?.total ?? 1}
                      color='bg-yellow-500'
                    />
                    <StatusBar
                      label='Processing'
                      value={stats?.processing ?? 0}
                      total={stats?.total ?? 1}
                      color='bg-blue-500'
                    />
                    <StatusBar
                      label='Completed'
                      value={stats?.completed ?? 0}
                      total={stats?.total ?? 1}
                      color='bg-green-500'
                    />
                    <StatusBar
                      label='Error'
                      value={stats?.error ?? 0}
                      total={stats?.total ?? 1}
                      color='bg-red-500'
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Main>
    </>
  )
}

function StatusBar({
  label,
  value,
  total,
  color,
}: {
  label: string
  value: number
  total: number
  color: string
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className='space-y-1'>
      <div className='flex items-center justify-between text-sm'>
        <span className='text-muted-foreground'>{label}</span>
        <span className='font-medium tabular-nums'>
          {value} ({percentage}%)
        </span>
      </div>
      <div className='h-2 w-full rounded-full bg-muted'>
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
