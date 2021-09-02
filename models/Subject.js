import mongoose from 'mongoose'
import P12School from './P12School'
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
    p12school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: P12School,
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
