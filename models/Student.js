import mongoose from 'mongoose'
import Branch from './Branch'
import ClassRoom from './ClassRoom'
import PTwelveSchool from './PTwelveSchool'

const studentScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: Number, required: true },
    rollNo: { type: String, required: true },
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
    classRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ClassRoom,
      required: true,
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

const Student =
  mongoose.models.Student || mongoose.model('Student', studentScheme)
export default Student
