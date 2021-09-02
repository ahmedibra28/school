import mongoose from 'mongoose'
import Subject from './Subject'
import PTwelveSchool from './PTwelveSchool'
import Student from './Student'
import Exam from './Exam'
import ClassRoom from './ClassRoom'

const markScheme = mongoose.Schema(
  {
    mark: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Subject,
      required: true,
    },
    pTwelveSchool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: PTwelveSchool,
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Student,
      required: true,
    },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: Exam, required: true },
    classRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ClassRoom,
      required: true,
    },
  },
  { timestamps: true }
)

const Mark = mongoose.models.Mark || mongoose.model('Mark', markScheme)
export default Mark
