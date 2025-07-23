export const saveSession = (token: string) => {
  const expiresAt = Date.now() + 60 * 60 * 1000 // 1 hour
  sessionStorage.setItem('github_token', token)
  sessionStorage.setItem('expires_at', expiresAt.toString())
}

export const isSessionValid = () => {
  const token = sessionStorage.getItem('github_token')
  const expiresAt = Number(sessionStorage.getItem('expires_at'))
  return token && Date.now() < expiresAt
}

export const getToken = () => {
  return sessionStorage.getItem('github_token')
}
