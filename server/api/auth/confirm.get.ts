import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const token_hash = query.token_hash as string
  const type = query.type as any
  const next = (query.next as string) || '/'

  const supabase = await serverSupabaseClient(event)

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    })

    if (!error) {
      return sendRedirect(event, next)
    }
  }

  return sendRedirect(event, '/login?error=auth-callback-failed')
})
