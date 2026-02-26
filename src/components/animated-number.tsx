import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type AnimatedNumberProps = {
  value: number
  className?: string
}

export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const previousValue = useRef(value)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    if (previousValue.current === value) return

    previousValue.current = value
    setIsChanging(true)

    const timeoutId = window.setTimeout(() => {
      setIsChanging(false)
    }, 400)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [value])

  return (
    <span
      className={cn(
        'inline-block tabular-nums transition-transform duration-300',
        isChanging && 'scale-110',
        className
      )}
    >
      {value}
    </span>
  )
}
