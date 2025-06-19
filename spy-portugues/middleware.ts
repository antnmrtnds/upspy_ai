// import createMiddleware from 'next-intl/middleware';

// export default createMiddleware({
//   locales: ['pt'],
//   defaultLocale: 'pt',
//   localePrefix: 'always'
// });

// export const config = {
//   matcher: [
//     // Enable a redirect to a matching locale at the root
//     '/',
    
//     // Set a cookie to remember the previous locale for
//     // all requests that have a locale prefix
//     '/(pt)/:path*',
    
//     // Enable redirects that add missing locales
//     // (e.g. `/pathnames` -> `/pt/pathnames`)
//     '/((?!_next|_vercel|.*\\..*).*)'
//   ]
// }; 