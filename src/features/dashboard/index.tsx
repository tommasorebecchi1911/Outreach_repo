import { Building2, CheckCircle2, Clock, Loader2, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedNumber } from '@/components/animated-number'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  useAziendaStats,
  useAziendeRealtime,
} from '@/features/aziende/data/hooks'
import { Overview } from './components/overview'

export function Dashboard() {
  const { data: stats, isLoading } = useAziendaStats()
  const { isSubscribed } = useAziendeRealtime()
  const totalCompanies = stats?.total ?? 0
  const pendingCompanies = stats?.pending ?? 0
  const processingCompanies = stats?.processing ?? 0
  const completedCompanies = stats?.completed ?? 0
  const errorCompanies = stats?.error ?? 0
  const emailsSent = stats?.emailsSent ?? 0
  const processingQueue = pendingCompanies + processingCompanies

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
          <div className='mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground'>
            <span
              className={`size-2 rounded-full ${isSubscribed ? 'animate-pulse bg-emerald-500' : 'bg-amber-500'}`}
            />
            {isSubscribed
              ? 'Live updates enabled'
              : 'Connecting to live updates...'}
          </div>
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
                  <AnimatedNumber
                    value={totalCompanies}
                    className='block text-2xl font-bold'
                  />
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
                  <AnimatedNumber
                    value={processingQueue}
                    className='block text-2xl font-bold'
                  />
                  <p className='text-xs text-muted-foreground'>
                    {pendingCompanies} pending, {processingCompanies} processing
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
                  <AnimatedNumber
                    value={completedCompanies}
                    className='block text-2xl font-bold text-green-600'
                  />
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
                  <AnimatedNumber
                    value={emailsSent}
                    className='block text-2xl font-bold text-blue-600'
                  />
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
                      value={pendingCompanies}
                      total={Math.max(totalCompanies, 1)}
                      color='bg-yellow-500'
                      textColor='text-yellow-700 dark:text-yellow-400'
                    />
                    <StatusBar
                      label='Processing'
                      value={processingCompanies}
                      total={Math.max(totalCompanies, 1)}
                      color='bg-blue-500'
                      textColor='text-blue-700 dark:text-blue-400'
                    />
                    <StatusBar
                      label='Completed'
                      value={completedCompanies}
                      total={Math.max(totalCompanies, 1)}
                      color='bg-green-500'
                      textColor='text-green-700 dark:text-green-400'
                    />
                    <StatusBar
                      label='Error'
                      value={errorCompanies}
                      total={Math.max(totalCompanies, 1)}
                      color='bg-red-500'
                      textColor='text-red-700 dark:text-red-400'
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
  textColor,
}: {
  label: string
  value: number
  total: number
  color: string
  textColor: string
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0
  const clampedPercentage = Math.min(100, Math.max(0, percentage))
  const percentageLabel = Number.isInteger(clampedPercentage)
    ? clampedPercentage.toString()
    : clampedPercentage.toFixed(1)

  return (
    <div className='space-y-1'>
      <div className='flex items-center justify-between text-sm'>
        <span className={`font-medium ${textColor}`}>{label}</span>
        <span className={`font-medium tabular-nums ${textColor}`}>
          <AnimatedNumber value={value} /> ({percentageLabel}%)
        </span>
      </div>
      <div className='h-2 w-full rounded-full bg-muted'>
        <div
          className={`h-2 rounded-full transition-[width] duration-500 ease-out ${color}`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  )
}
