import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_FILE = path.join(__dirname, 'db.json')

// Initialize database
let db = {
  users: []
}

// Load existing data
try {
  if (fs.existsSync(DB_FILE)) {
    const data = fs.readFileSync(DB_FILE, 'utf8')
    db = JSON.parse(data)
  }
} catch (error) {
  console.log('Creating new database file')
}

// Save data to file
const saveDB = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
  } catch (error) {
    console.error('Error saving database:', error)
  }
}

// User operations
const users = {
  findByEmail: (email) => {
    return db.users.find(user => user.email.toLowerCase() === email.toLowerCase())
  },
  
  create: (userData) => {
    db.users.push(userData)
    saveDB()
    return userData
  },
  
  updatePassword: (userId, newPasswordHash) => {
    const user = db.users.find(u => u.id === userId)
    if (user) {
      user.password = newPasswordHash
      saveDB()
    }
    return user
  }
}

export default {
  users
}