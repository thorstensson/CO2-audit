export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)

  if (!config.maintenanceMode) return

  const url = getRequestURL(event)
  if (url.pathname === '/maintenance') return

  return sendRedirect(event, '/maintenance', 503)
})
