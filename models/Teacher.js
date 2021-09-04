import mongoose from 'mongoose'
import Branch from './Branch'
import PTwelveSchool from './PTwelveSchool'
import Subject from './Subject'

const teacherScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: Number, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    isActive: { type: Boolean, default: true },
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
    subject: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Subject,
        required: true,
      },
    ],
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

const Teacher =
  mongoose.models.Teacher || mongoose.model('Teacher', teacherScheme)
export default Teacher
