import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard/(.*)',
  '/profile/(.*)',
  '/analytics/(.*)',
  '/competitors/(.*)',
  '/prices/(.*)',
  '/team/(.*)',
  '/settings/(.*)',
  '/alerts/(.*)',
  '/api/(.*)'
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/pt',
  '/pt/(.*)',
  '/sign-in/(.*)',
  '/sign-up/(.*)',
  '/privacy',
  '/terms',
  '/api/public/(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) return

  // Protect all other routes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}