import express from 'express'
import { File } from '../models/files.js'

const router = express.Router()

router.get('/:uuid', async (req, res) => {
  const file = await File.findOne({ uuid: req.params.uuid })

  if (!file) {
    res.render('download', { error: 'Link has been expired' })
    return
  }
  fetch(file.url)
    .then(response => {
      return response.arrayBuffer()
    })
    .then(response => {
      res.setHeader(
        'Content-disposition',
        `attachment; filename=${file.originalname}`
      )
      const buffer = Buffer.from(response)
      res.send(buffer)
    })
})

export { router as download }
