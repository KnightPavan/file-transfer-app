import express, { response } from 'express'
import multer from 'multer'
import path from 'path'
import { File } from '../models/files.js'
import { randomUUID } from 'crypto'
import emailTemplate from '../services/emailTemplate.js'
import sendMail from '../services/emailService.js'

const router = express.Router()

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => {
    console.log(file)
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

let upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 * 100 }
}).single('myfile')

router.post('/', async (req, res) => {
  upload(req, res, async err => {

    if (err) {
      return res.status(500).send({ error: err.message })
    }
    console.log(req.file)
    const file = new File({
      filename: req.file.filename,
      uuid: randomUUID(),
      path: req.file.path,
      size: req.file.size
    })

    const response = await file.save()
    return res.status(200).json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`
    })
    
  })

})

router.post('/send', async (req, res) => {

  const { uuid, emailFrom, emailTo } = req.body
  if (!uuid || !emailFrom || !emailTo) {
    return res.status(422).send({ error: 'All fields are required' })
  }

  const file = await File.findOne({ uuid: uuid })
  if (!file) {
    return res.status(404).send('Failed to send email')
  }

  if (file.sender) {
    return res.status(422).send({ error: 'Email Already sent.' })
  }
  file.sender = emailFrom
  file.receiver = emailTo

  const response = await file.save()

  await sendMail({
    from: emailFrom,
    to: emailTo,
    subject: 'File Sharing',
    text: `${emailFrom} shared a file with you.`,
    html: emailTemplate({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + 'KB',
      expires: '24 hours'
    })
  })
  res.send({ success: true })
})

export { router as files }
