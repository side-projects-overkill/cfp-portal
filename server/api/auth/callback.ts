import { defineEventHandler, getQuery, sendRedirect } from 'h3'
import { $fetch } from 'ofetch'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export default defineEventHandler(async (event) => {
  const code = getQuery(event).code as string
  if (!code) return sendRedirect(event, '/')

  const tokenRes = await $fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { accept: 'application/json' },
    body: {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    },
  })

  const token = tokenRes.access_token
  if (!token) return sendRedirect(event, '/?error=token_failed')

  const ghUser = await $fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${token}` },
  })

  const emailList = await $fetch('https://api.github.com/user/emails', {
    headers: { Authorization: `Bearer ${token}` },
  })

  const email = emailList.find((e: any) => e.primary)?.email
  if (!email) return sendRedirect(event, '/?error=no_email')

  const userData = {
    email,
    username: ghUser.login,
    role: 'USER',
  }

  await supabase.from('users').upsert(userData, {
    onConflict: 'email',
  })

  const encoded = encodeURIComponent(btoa(JSON.stringify(userData)))
  return sendRedirect(event, `/dashboard?session=${encoded}`)
})
