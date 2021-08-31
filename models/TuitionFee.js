import mongoose from 'mongoose'
import ClassRoom from './ClassRoom'
import Student from './Student'

const tuitionFeeScheme = mongoose.Schema(
  {
    fee: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    classRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ClassRoom,
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Student,
      required: true,
    },
  },
  { timestamps: true }
)

const TuitionFee =
  mongoose.models.TuitionFee || mongoose.model('TuitionFee', tuitionFeeScheme)
export default TuitionFee
