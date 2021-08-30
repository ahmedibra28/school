import mongoose from 'mongoose'
import Subject from './Subject'
import Class from './Class'
import Student from './Student'

const attendanceScheme = mongoose.Schema(
  {
    isActive: { type: Boolean, default: true },
    subject: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Subject,
          required: true,
        },
      },
    ],
    class: { type: mongoose.Schema.Types.ObjectId, ref: Class, required: true },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Student,
      required: true,
    },
  },
  { timestamps: true }
)

const Attendance =
  mongoose.models.Attendance || mongoose.model('Attendance', attendanceScheme)
export default Attendance
