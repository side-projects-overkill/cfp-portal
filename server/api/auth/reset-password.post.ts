import { defineEventHandler, readBody, createError } from 'h3'
import pool from '../../utils/db'
import bcrypt from 'bcrypt'
import type { PoolClient } from 'pg'

async function hashValue(value: string): Promise<string> {
  try {
    return await bcrypt.hash(value, 10)
  } catch (error) {
    console.error('Hashing failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Hashing failed.'
    })
  }
}

async function findUserByToken(client: PoolClient, token: string) {
  const result = await client.query(`SELECT id, token, password FROM users WHERE token IS NOT NULL`)

  for (const row of result.rows) {
    const isMatch = await bcrypt.compare(token, row.token)
    if (isMatch) return row
  }

  return null
}

async function resetUserPassword(client: PoolClient, token: string, newPassword: string) {
  const user = await findUserByToken(client, token)

  if (!user) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid or expired token' })
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password)
  if (isSamePassword) {
    throw createError({ statusCode: 400, statusMessage: 'New password must be different from the old password' })
  }

  const hashedNewPassword = await hashValue(newPassword)

  await client.query(
    `UPDATE users SET password = $1, token = NULL WHERE id = $2`,
    [hashedNewPassword, user.id]
  )

  return { message: 'Password updated successfully' }
}

export default defineEventHandler(async (event) => {
  const { token, newPassword } = await readBody(event)

  if (!token?.trim() || !newPassword?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token and new password are required'
    })
  }

  let client

  try {
    client = await pool.connect()
    return await resetUserPassword(client, token, newPassword)
  } catch (error) {
    console.error('Error in password reset:', error)
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  } finally {
    if (client) client.release()
  }
})
