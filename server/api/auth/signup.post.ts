import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcrypt'
import pool from '../../utils/db'

const userExistsError = () =>
  createError({
    statusCode: 409,
    statusMessage: 'User with this email already exists.'
  })

function validateSignupData(email: string, password: string) {
  if (!email?.trim() || !password?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required.'
    })
  }
}

async function doesUserExist(email: string) {
  const client = await pool.connect()
  const { rows } = await client.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  )
  return rows.length > 0
}

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

async function createUser(name: string, email: string, hashedPassword: string, role: string) {
  const client = await pool.connect()
  const { rows } = await client.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, role`,
    [
      name || '',
      email,
      hashedPassword,
      role === 'ADMIN' ? 'ADMIN' : 'USER'
    ]
  )
  return rows[0]
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password, role } = body

  validateSignupData(email, password)

  if (await doesUserExist(email)) {
    throw userExistsError()
  }

  const hashedPassword = await hashPassword(password)
  const user = await createUser(name, email, hashedPassword, role)

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    },
    message: 'User registered successfully!'
  }
})
