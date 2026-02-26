import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAziendaStats } from '@/features/aziende/data/hooks'

export function Overview() {
  const { data: stats } = useAziendaStats()

  const data = [
    { name: 'Pending', count: stats?.pending ?? 0, color: '#f59e0b' },
    { name: 'Processing', count: stats?.processing ?? 0, color: '#3b82f6' },
    { name: 'Completed', count: stats?.completed ?? 0, color: '#22c55e' },
    { name: 'Error', count: stats?.error ?? 0, color: '#ef4444' },
    { name: 'Emails Sent', count: stats?.emailsSent ?? 0, color: '#0ea5e9' },
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
        <Tooltip
          cursor={{ fill: 'var(--muted)', opacity: 0.25 }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) {
              return null
            }

            const { name, count, color } = payload[0].payload as {
              name: string
              count: number
              color: string
            }

            return (
              <div className='rounded-md border border-border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md'>
                <p className='font-medium'>
                  <span
                    className='mr-2 inline-block size-2 rounded-full'
                    style={{ backgroundColor: color }}
                  />
                  {name}: <span className='tabular-nums'>{count}</span>
                </p>
              </div>
            )
          }}
        />
        <Bar
          dataKey='count'
          isAnimationActive
          animationDuration={500}
          animationEasing='ease-out'
          fill='var(--primary)'
          fillOpacity={0.75}
          radius={[4, 4, 0, 0]}
          activeBar={{ fillOpacity: 1, stroke: 'var(--ring)', strokeWidth: 1 }}
          className='cursor-pointer'
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
