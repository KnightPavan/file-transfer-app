import express from 'express'
import { File } from '../models/files.js'
import path from "path"
import { fileURLToPath } from "url";

const router = express.Router()

router.get('/:uuid', async(req, res) => {
  const file = await File.findOne({ uuid: req.params.uuid })

  if (!file) {
    res.render('download', { error: 'Link has been expired' })
    return
  }

const fileName = fileURLToPath(import.meta.url)
const filePath = path.join(path.dirname(fileName), '..', file.path);

  res.download(`${path.dirname(fileName)}/../${file.path}`)
})

export { router as download }
