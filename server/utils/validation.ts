export const rules = {
  name: /^[A-Za-z\s]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
  role: /^(user|admin)$/i
}
export const errorMessages = {
    name: 'Name should be letters only — no digits or special characters',
    email: 'Email should contain "@" and "."',
    password: 'Password should be at least 6 characters, include letters and numbers',
    role: 'Role must be either user or admin'
}
export function validateSignupData(email: string, password: string, name?: string, role?: string) {
  if (!email?.trim() || !password?.trim()) {
    throw new Error('Email and password are required.')
  }
  if (!rules.email.test(email)) {
    throw new Error('Invalid email format.')
  }
  if (!rules.password.test(password)) {
    throw new Error('Password must be at least 6 characters, with letters & numbers.')
  }
  if (name && !rules.name.test(name)) {
    throw new Error('Name can only contain letters and spaces.')
  }
  if (role && !rules.role.test(role)) {
    throw new Error('Role must be user or admin.')
  }
}
