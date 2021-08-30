import mongoose from 'mongoose'
import Class from './Class'

const studentScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: Number, required: true },
    rollNo: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Class,
      required: true,
    },
  },
  { timestamps: true }
)

const Student =
  mongoose.models.Student || mongoose.model('Student', studentScheme)
export default Student
