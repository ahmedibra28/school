import mongoose from 'mongoose'
import P12School from './P12School'
import Exam from './Exam'

const subjectScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    exams: [
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
  },
  { timestamps: true }
)

const Subject =
  mongoose.models.Subject || mongoose.model('Subject', subjectScheme)
export default Subject
