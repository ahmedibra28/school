import mongoose from 'mongoose'
import Subject from './Subject'

const teacherScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: Number, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    subject: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Subject,
        required: true,
      },
    ],
  },
  { timestamps: true }
)

const Teacher =
  mongoose.models.Teacher || mongoose.model('Teacher', teacherScheme)
export default Teacher
