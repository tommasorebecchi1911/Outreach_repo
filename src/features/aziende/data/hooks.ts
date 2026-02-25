import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { type Azienda } from './schema'

// ─── Query Keys ──────────────────────────────────────────────────────────────

const aziendeKeys = {
  all: ['aziende'] as const,
  list: () => [...aziendeKeys.all, 'list'] as const,
  stats: () => [...aziendeKeys.all, 'stats'] as const,
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
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('aziende')
        .select('*')
        .eq('user_id', user.id)
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
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('aziende')
        .select('status_processo, email_inviata')
        .eq('user_id', user.id)

      if (error) throw error

      const rows = data ?? []
      return {
        total: rows.length,
        pending: rows.filter((r) => r.status_processo === 'pending').length,
        processing: rows.filter((r) => r.status_processo === 'processing')
          .length,
        completed: rows.filter((r) => r.status_processo === 'completed')
          .length,
        error: rows.filter((r) => r.status_processo === 'error').length,
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
 * Uploads an Excel file to the 'upload-excel' Supabase Edge Function.
 * The file is sent as FormData.
 * Invalidates the aziende queries on success.
 */
export function useUploadExcel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      const { data, error } = await supabase.functions.invoke('upload-excel', {
        body: formData,
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aziendeKeys.all })
    },
  })
}
