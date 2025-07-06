/* eslint-disable @typescript-eslint/no-unused-vars */
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
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching user'
    })
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email?.trim() || !password?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Both email and password are required'
    })
  }

  const user = await getUserByEmail(email)

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw invalidCredentialsError()
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      role: user.role
    },
    message: 'Login successful!'
  }
})

