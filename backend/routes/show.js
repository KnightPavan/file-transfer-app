import express from 'express'
import { File } from '../models/files.js'
const router = express.Router()

router.get('/:uuid', async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid })
    if (!file) {
      res.render('download', { error: 'Link has been expired' })
    }

    res.render('download',{
        uuid: file.uuid,
        fileName:file.filename,
        fileSize: file.size,
        downloadLink:`${process.env.APP_BASE_URL}/files/download/${file.uuid}`
    })
  } catch (error) {
    res.render('download', { error: 'Something went wrong' })
  }
})
export { router as show }
