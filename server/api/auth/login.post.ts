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
  let client
  try {
    client = await pool.connect()
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
  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email?.trim() || !password?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Both email and password are required'
      })
    }

    const user = await getUserByEmail(email)

    const isPasswordValid = await bcrypt.compare(password, user?.password || '')
    if (!user || !isPasswordValid) {
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
  } catch (error) {
    if (error.statusCode) {
      throw error 
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong while logging in.'
    })
  }
})
