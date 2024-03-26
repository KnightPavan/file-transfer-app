import { File } from '../models/files.js'
import { storage } from '../config/firebase.js'
import { ref, deleteObject } from 'firebase/storage'
import connectdb from '../config/db.js'
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

async function fetchData () {
  const pastDate = new Date(Date.now() - 0.1 * 60 * 60 * 1000)
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

connectdb().then(() => {
  fetchData().then((msg) => {
    console.log(msg);
    process.exit()
  })
})
