import express from 'express'
import { createServer, getServerPort } from '@devvit/server'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.text())

const router = express.Router()

router.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Memory game server is running' })
})

app.use(router)

const port = getServerPort()

const server = createServer(app)
server.on('error', (err) => console.error(`server error: ${err.stack}`))
server.listen(port, () => console.log(`http://localhost:${port}`))