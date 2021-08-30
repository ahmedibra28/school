import mongoose from 'mongoose'
import Subject from './Subject'
import P12School from './P12School'
import Student from './Student'
import Exam from './Exam'

const markScheme = mongoose.Schema(
  {
    mark: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Subject,
      required: true,
    },
    p12school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: P12School,
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Student,
      required: true,
    },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: Exam, required: true },
  },
  { timestamps: true }
)

const Mark = mongoose.models.Mark || mongoose.model('Mark', markScheme)
export default Mark
