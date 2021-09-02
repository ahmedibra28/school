import mongoose from 'mongoose'
import PTwelveSchool from './PTwelveSchool'
import Exam from './Exam'
import Branch from './Branch'

const subjectScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    exam: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Exam,
        required: true,
      },
    ],
    pTwelveSchool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: PTwelveSchool,
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Branch,
      required: true,
    },
  },
  { timestamps: true }
)

const Subject =
  mongoose.models.Subject || mongoose.model('Subject', subjectScheme)
export default Subject
