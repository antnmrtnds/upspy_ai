import '@testing-library/jest-dom'
import 'whatwg-fetch'
import { NextResponse } from 'next/server'

// Polyfill static Response.json for NextResponse.json support
if (!(Response as any).json) {
  (Response as any).json = (body: any, init?: ResponseInit) => new Response(JSON.stringify(body), init)
}

// Always override NextResponse.json to use our static Response.json
(NextResponse as any).json = (body: any, init?: ResponseInit) => Response.json(body, init)
