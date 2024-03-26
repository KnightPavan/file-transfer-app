import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import dotenv from 'dotenv'

dotenv.config({path: "../.env"})

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.FB_APP_ID,
  measurementId: process.env.FB_MEAUSREMENT_ID
}


// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
