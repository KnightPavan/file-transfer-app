import mongoose from 'mongoose'

const filesSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    uuid: { type: String, required: true },
    originalname: { type: String, required: true },
    url: { type: String, required: true },
    sender: { type: String },
    receiver: { type: String }
  },
  { timestamps: true }
)

const File = mongoose.model('files', filesSchema)

export { File }
