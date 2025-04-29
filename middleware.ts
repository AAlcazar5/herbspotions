// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function generateNonce(): string {
    const nonceArray = new Uint8Array(16);
    crypto.getRandomValues(nonceArray);
    return btoa(String.fromCharCode(...nonceArray));
}

export function middleware(request: NextRequest) {
  try {
    // console.log(`Middleware triggered for path: ${request.nextUrl.pathname}`); // Optional log
    const nonce = generateNonce();

    // CSP Directives
    const cspDirectives = [
      `default-src 'self'`,
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ""}`,      `style-src 'self' 'nonce-${nonce}'`,
      `img-src 'self' data: cdn.shopify.com`,
      `font-src 'self'`,
      `connect-src 'self' https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`,
      `frame-ancestors 'none'`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `upgrade-insecure-requests`,
    ];

    const cspHeader = cspDirectives.join('; ');
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);

    const response = NextResponse.next({
        request: { headers: requestHeaders },
    });

    response.headers.set('Content-Security-Policy', cspHeader);
    // response.headers.set('x-nonce', nonce); // Usually only needed on request headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    return response;

  } catch (error) {
    console.error('Middleware Error:', error);
    return new NextResponse('An internal error occurred in middleware', { status: 500 });
  }
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};