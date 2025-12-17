import bcrypt from 'bcryptjs'
import validator from 'validator'
import db from '../local-db.js'

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' })
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format.' })
    }

    if (db.users.findByEmail(email)) {
      return res.status(400).json({ success: false, message: 'Email already registered.' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    db.users.create({
      id: Date.now(),
      name,
      email,
      password: passwordHash,
      created_at: new Date().toISOString()
    })

    return res.status(201).json({ success: true, message: 'Registration successful.' })
  } catch (error) {
    console.error('Register Error:', error)
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = db.users.findByEmail(email)
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' })
    }

    return res.json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Login Error:', error)
    return res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// ================= RESET PASSWORD (DEMO) =================
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format.' })
    }

    const user = db.users.findByEmail(email)
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found.' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    db.users.updatePassword(user.id, passwordHash)

    return res.status(200).json({ success: true, message: 'Password updated successfully.' })
  } catch (error) {
    console.error('Reset Error:', error)
    return res.status(500).json({ success: false, message: 'Server error during reset.' })
  }
}
