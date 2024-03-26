/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https'
import logger from 'firebase-functions/logger'
import express from 'express'
import cors from 'cors'
import { File } from './files.js'
import { storage } from './config/firebase.js'
import { ref, deleteObject } from 'firebase/storage'
import dotenv from 'dotenv'
import connectdb from './config/db.js'

dotenv.config()
connectdb()

const app = express()

app.use(cors())

app.get('/api/trigger', async (req, res) => {
  fetchData().then(msg => {
    res.send(msg)
  })
})

async function fetchData () {
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const files = await File.find({ createdAt: { $lt: pastDate } })

  if (files.length) {
    for (let file of files) {
      const url = file.url
      const storageRef = ref(storage, file.path)
      try {
        await deleteObject(storageRef)
        console.log('Deleted storage')
        await file.deleteOne()
        console.log('Deleted document')
      } catch (error) {
        console.log(error)
      }
    }
    return 'All files Removed'
  } else {
    return 'No Files Found'
  }
}

export const scheduleTrigger = onRequest(app)
