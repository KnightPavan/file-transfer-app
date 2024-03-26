import express from 'express'
import multer, { memoryStorage } from 'multer'
import path from 'path'
import { File } from '../models/files.js'
import { randomUUID } from 'crypto'
import emailTemplate from '../services/emailTemplate.js'
import sendMail from '../services/emailService.js'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../config/firebase.js'

const router = express.Router()

const upload = multer({
  storage: memoryStorage(),
  limits: { fileSize: 1000000 * 100 }
})

router.post('/', upload.single('myfile'), async (req, res) => {

  const uniqueName = `${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}${path.extname(req.file.originalname)}`
  req.file.filename = uniqueName
  req.file.path = `files/${req.file.filename}`
  const storageRef = ref(storage, `files/${req.file.filename}`)

  const metadata = {
    contentType: req.file.mimetype
  }

  try {
    const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata)
    const downloadUrl = await getDownloadURL(snapshot.ref)
    console.log(downloadUrl)

    const file = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      uuid: randomUUID(),
      url: downloadUrl,
      path: req.file.path,
      size: req.file.size
    })

    const response = await file.save()
    return res.status(200).json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`
    })
  } catch (error) {
    res.send({ error: 'Something Went Wrong' })
  }
})

router.post('/send', async (req, res) => {
  // console.log(req.body)
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
