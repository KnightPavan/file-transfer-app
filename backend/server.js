import dotenv from 'dotenv'
import express from 'express'
import connectdb from './config/db.js'
import { files } from './routes/files.js'
import { show } from './routes/show.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { download } from './routes/download.js'
import cors from 'cors'

dotenv.config()
connectdb()

const app = express()

app.set('view engine', 'ejs')
app.set(
  'views',
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'views')
)

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
)
app.use(express.static('public'))


app.use(express.json())
app.use('/api/files', files)
app.use('/files', show)
app.use('/files/download', download)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
