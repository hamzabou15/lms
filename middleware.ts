import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// MatcherRoute for Unprotected Routes
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)' , "/api/uploadthing"])

// logic for publicRoutes
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
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

// export async function middleware(request: NextRequest) {
//   if (request.nextUrl.pathname.startsWith("/api/uploadthing")) {
//     return;
//   }

//   // return await update(request);
// }