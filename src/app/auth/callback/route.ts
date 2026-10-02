import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Login sukses, redirect ke halaman utama atau halaman tujuan
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Jika gagal atau tidak ada code
  return NextResponse.redirect(`${origin}/login?error=Aktivasi email gagal. Silakan coba lagi.`)
}
