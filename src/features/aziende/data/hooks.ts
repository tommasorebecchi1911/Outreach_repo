import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { type Azienda } from './schema'

// ─── Query Keys ──────────────────────────────────────────────────────────────

const aziendeKeys = {
  all: ['aziende'] as const,
  list: () => [...aziendeKeys.all, 'list'] as const,
  stats: () => [...aziendeKeys.all, 'stats'] as const,
}

type RealtimeEventType = 'INSERT' | 'UPDATE' | 'DELETE'

export interface AziendeRealtimeEvent {
  id: number | null
  type: RealtimeEventType
  at: number
}

export function useAziendeRealtime() {
  const queryClient = useQueryClient()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [lastEvent, setLastEvent] = useState<AziendeRealtimeEvent | null>(null)

  useEffect(() => {
    let isMounted = true
    let channel: ReturnType<typeof supabase.channel> | null = null

    const subscribe = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!isMounted || !user) return

      channel = supabase
        .channel(
          `aziende-live-${user.id}-${Math.random().toString(36).slice(2, 8)}`
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'aziende',
          },
          (payload) => {
            const newRecord = payload.new as Partial<Azienda>
            const oldRecord = payload.old as Partial<Azienda>
            const changedId =
              newRecord.id_azienda ?? oldRecord.id_azienda ?? null

            setLastEvent({
              id: changedId,
              type: payload.eventType as RealtimeEventType,
              at: Date.now(),
            })

            queryClient.invalidateQueries({ queryKey: aziendeKeys.list() })
            queryClient.invalidateQueries({ queryKey: aziendeKeys.stats() })
          }
        )
        .subscribe((status) => {
          if (!isMounted) return
          setIsSubscribed(status === 'SUBSCRIBED')
        })
    }

    void subscribe()

    return () => {
      isMounted = false
      setIsSubscribed(false)
      if (channel) {
        void supabase.removeChannel(channel)
      }
    }
  }, [queryClient])

  return { isSubscribed, lastEvent }
}

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * Fetches all aziende for the current authenticated user,
 * ordered by id_azienda descending.
 */
export function useAziende() {
  return useQuery<Azienda[]>({
    queryKey: aziendeKeys.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aziende')
        .select('*')
        .order('id_azienda', { ascending: false })

      if (error) throw error
      return data as Azienda[]
    },
  })
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export interface AziendaStats {
  total: number
  pending: number
  processing: number
  completed: number
  error: number
  emailsSent: number
}

/**
 * Fetches aggregate counts by status_processo, the total number of aziende,
 * and the count of emails sent for the current user.
 */
export function useAziendaStats() {
  return useQuery<AziendaStats>({
    queryKey: aziendeKeys.stats(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aziende')
        .select('status_processo, email_inviata')

      if (error) throw error

      const rows = data ?? []
      const normalizedStatuses = rows.map((row) => {
        const status = row.status_processo
        if (
          status === 'pending' ||
          status === 'processing' ||
          status === 'completed' ||
          status === 'error'
        ) {
          return status
        }

        return 'pending'
      })

      return {
        total: rows.length,
        pending: normalizedStatuses.filter((status) => status === 'pending')
          .length,
        processing: normalizedStatuses.filter(
          (status) => status === 'processing'
        ).length,
        completed: normalizedStatuses.filter((status) => status === 'completed')
          .length,
        error: normalizedStatuses.filter((status) => status === 'error').length,
        emailsSent: rows.filter((r) => r.email_inviata).length,
      }
    },
  })
}

// ─── Mutations ───────────────────────────────────────────────────────────────

/**
 * Deletes an azienda by its id_azienda.
 * Invalidates the aziende queries on success.
 */
export function useDeleteAzienda() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (idAzienda: number) => {
      const { error } = await supabase
        .from('aziende')
        .delete()
        .eq('id_azienda', idAzienda)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aziendeKeys.all })
    },
  })
}

/**
 * Calls the 'send-email' Supabase Edge Function for the given azienda.
 * Invalidates the aziende queries on success.
 */
export function useSendEmail(idAzienda: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { id_azienda: idAzienda },
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aziendeKeys.all })
    },
  })
}

/**
 * Re-queues selected aziende to retry contact email discovery.
 * Sets status back to pending and clears processing errors.
 */
export function useRetryEmailDiscovery() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (idsAzienda: number[]) => {
      if (idsAzienda.length === 0) return 0

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('aziende')
        .update({
          status_processo: 'pending',
          log_errori: null,
        })
        .in('id_azienda', idsAzienda)
        .select('id_azienda')

      if (error) throw error
      return data?.length ?? 0
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aziendeKeys.all })
    },
  })
}

/**
 * Uploads an Excel file to the 'upload-excel' Supabase Edge Function.
 * The file is sent as FormData.
 * Invalidates the aziende queries on success.
 */
export function useUploadExcel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) throw new Error('User not authenticated')

      const formData = new FormData()
      formData.append('file', file)

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string
      const response = await fetch(`${supabaseUrl}/functions/v1/upload-excel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: supabaseAnonKey,
        },
        body: formData,
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Upload failed')
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aziendeKeys.all })
    },
  })
}
