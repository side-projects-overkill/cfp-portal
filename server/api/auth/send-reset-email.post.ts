import { defineEventHandler, readBody, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import pool from '~/server/utils/db'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'

const config = useRuntimeConfig()

async function getUserByEmail(email: string) {
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      'SELECT id, name, email FROM users WHERE email = $1',
      [email]
    )
    return rows[0]
  }
  catch (error) {
    console.error('Error fetching user by email:', error)
    throw createError({ statusCode: 500, statusMessage: 'Database query failed' })
  }
}

async function hashToken(token: string) {
  return await bcrypt.hash(token, 10)
}


export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  if (!email?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Email is required' })
  }

  const user = await getUserByEmail(email)
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const jwtSecret = process.env.JWT_SECRET || config.JWT_SECRET
  if (!jwtSecret) {
    throw createError({ statusCode: 500, statusMessage: 'JWT secret is missing' })
  }

  const token = jwt.sign({ email: user.email }, jwtSecret, { expiresIn: '1h' })
  const hashedToken = await hashToken(token)
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  const client = await pool.connect()
  try {
    await client.query(
      'UPDATE users SET token = $1, token_expires_at = $2 WHERE email = $3',
      [hashedToken, expiresAt, user.email]
    )
  } catch (dbError) {
    console.error('Error updating user with reset token:', dbError)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to store reset token in database'
    })
  }

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: parseInt(process.env.MAILTRAP_PORT || '2525'),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    },
    secure: false,
    tls: { rejectUnauthorized: false }
  })

  const resetLink = `${config.public.API_BASE_URL}/reset-password?token=${token}`

  const mailOptions = {
    from: '"Your App" <no-reply@yourapp.com>',
    to: user.email,
    subject: 'Reset Your Password',
    html: `
      <p>Hello ${user.name},</p>
      <p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (mailErr) {
    console.error('Error sending email:', mailErr)
    throw createError({ statusCode: 500, statusMessage: 'Failed to send email' })
  }

  return { success: true }
})