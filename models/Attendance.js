import mongoose from 'mongoose'
import Subject from './Subject'
import ClassRoom from './ClassRoom'
import Student from './Student'
import Branch from './Branch'
import PTwelveSchool from './PTwelveSchool'

const attendanceScheme = mongoose.Schema(
  {
    isActive: { type: Boolean, default: true },
    student: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Student,
          required: true,
        },
        isAttended: { type: Boolean, default: false },
      },
    ],
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Branch,
      required: true,
    },
    pTwelveSchool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: PTwelveSchool,
      required: true,
    },
    classRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ClassRoom,
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Subject,
      required: true,
    },
  },
  { timestamps: true }
)

const Attendance =
  mongoose.models.Attendance || mongoose.model('Attendance', attendanceScheme)
export default Attendance
