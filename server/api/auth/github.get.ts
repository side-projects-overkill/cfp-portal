import { defineEventHandler, sendRedirect } from 'h3'
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const clientId = config.githubClientId
  const redirectUri = 'http://localhost:3000/api/auth/github/callback'

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`

  return sendRedirect(event, githubAuthUrl)
})
