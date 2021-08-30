import mongoose from 'mongoose'
import Student from './Student'
import Teacher from './Teacher'

const documentScheme = mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: Teacher },
    student: { type: mongoose.Schema.Types.ObjectId, ref: Student },
    document: {
      documentName: {
        type: String,
      },
      documentPath: {
        type: String,
      },
    },
    profilePicture: {
      imageName: {
        type: String,
      },
      imagePath: {
        type: String,
      },
    },
  },
  { timestamps: true }
)

const Document =
  mongoose.models.Document || mongoose.model('Document', documentScheme)
export default Document
