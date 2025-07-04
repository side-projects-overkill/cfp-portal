
import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcrypt'
import pool from '../../utils/db'


const invalidCredentialsError = () =>
  createError({
    statusCode: 401,
    statusMessage: 'Invalid email or password'
  })

async function getUserByEmail(email: string) {
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      'SELECT id, name, email, password, role FROM users WHERE email = $1',
      [email]
    )
    return rows[0] || null
  } finally {
    client.release()
  }
}

async function isPasswordValid(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }

  const user = await getUserByEmail(email)

  if (!user) {
    throw invalidCredentialsError()
  }

  const valid = await isPasswordValid(password, user.password)
  if (!valid) {
    throw invalidCredentialsError()
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      role: user.role
    }
  }
})
