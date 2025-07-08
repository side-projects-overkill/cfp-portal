import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcrypt'
import pool from '../../utils/db'


const rules = {
  name: /^[A-Za-z\s]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
  role: /^(user|admin)$/i
}

const userExistsError = () =>
  createError({
    statusCode: 409,
    statusMessage: 'User with this email already exists.'
  })

function validateSignupData(email: string, password: string, name?: string, role?: string) {
  if (!email?.trim() || !password?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required.'
    })
  }
  if (!rules.email.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email format.'
    })
  }
  if (!rules.password.test(password)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 6 chars, with letters & numbers.'
    })
  }
  if (name && !rules.name.test(name)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name can only contain letters and spaces.'
    })
  }
  if (role && !rules.role.test(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Role must be user or admin.'
    })
  }
}

async function doesUserExist(email: string) {
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )
    return rows.length > 0
  } catch (error) {
    console.error('Error checking user existence in db:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error checking if user exists.'
    })
  }
}

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

async function createUser(name: string, email: string, hashedPassword: string, role: string) {
  const client = await pool.connect()
  try {
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
  } catch (error) {
    console.error('Error creating user:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating user.'
    })
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password, role } = body


  validateSignupData(email, password, name, role)

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
