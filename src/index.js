import express from 'express'
import { PORT } from './config/config.js'
import authRouts from './routs/authentication.routs.js'

const app = express()

app.use(express.json())

app.use('/api/auth', authRouts)

app.listen(PORT,() => console.log(`Server running on http://localhost:${PORT} `) )