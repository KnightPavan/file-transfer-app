import mongoose from 'mongoose'

export default async function connectdb () {
  mongoose
    .connect(process.env.MONGO_URL, {})
    .then(() => {
      console.log('Database connection successfull')
    })
    .catch(err => {
      console.log(err)
      console.log('Database connection failed')
    })

  const connection = mongoose.connection
}
