// server/api/auth/confirm.get.ts

import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string
  const next = (query.next as string) || '/'

  if (code) {
    const supabase = await serverSupabaseClient(event)
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // The session cookies are now injected directly into the response headers
      return sendRedirect(event, next)
    }
  }

  // Fallback to login if something fails
  return sendRedirect(event, '/login?error=auth-callback-failed')
})
