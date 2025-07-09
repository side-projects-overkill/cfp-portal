/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcrypt'
import pool from '../../utils/db'
import { validateSignupData } from '../../utils/validation'

const userExistsError = () =>
  createError({
    statusCode: 409,
    statusMessage: 'User with this email already exists.'
  })
async function doesUserExist(email: string) {
  let client
  try {
    client = await pool.connect()
    const { rows } = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )
    return rows.length > 0
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database error: Could not check if user exists.'
    })
  }
}

async function hashPassword(password: string) {
  try {
    return await bcrypt.hash(password, 10)
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error hashing password.'
    })
  }
}
async function createUser(
  name: string,
  email: string,
  hashedPassword: string,
  role: string
) {
  let client
  try {
    client = await pool.connect()
    const { rows } = await client.query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, role
      `,
      [
        name || '',
        email,
        hashedPassword,
        role?.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER'
      ]
    )
    return rows[0]
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Database error: Could not create user.'
    })
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password, role } = body

  try {
    validateSignupData(email, password, name, role)
  } catch (error) {
  throw createError({
    statusCode: 400,
    statusMessage: error?.message || 'Invalid signup data.'
  })
  }

  if (await doesUserExist(email)) {
    throw userExistsError()
  }

  try {
    const hashedPassword = await hashPassword(password)
    const user = await createUser(name, email, hashedPassword, role)

    event.node.res.statusCode = 201

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      message: 'User registered successfully!'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error registering user.'
    })
  }
})
