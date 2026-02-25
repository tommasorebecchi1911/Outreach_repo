import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAziendaStats } from '@/features/aziende/data/hooks'

export function Overview() {
  const { data: stats } = useAziendaStats()

  const data = [
    { name: 'Pending', count: stats?.pending ?? 0 },
    { name: 'Processing', count: stats?.processing ?? 0 },
    { name: 'Completed', count: stats?.completed ?? 0 },
    { name: 'Error', count: stats?.error ?? 0 },
    { name: 'Emails Sent', count: stats?.emailsSent ?? 0 },
  ]

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          direction='ltr'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip />
        <Bar
          dataKey='count'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
