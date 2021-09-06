import mongoose from 'mongoose'

const teacherScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: Number, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    isActive: { type: Boolean, default: true },
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
