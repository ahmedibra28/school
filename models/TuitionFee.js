import mongoose from 'mongoose'
import Class from './Class'
import Student from './Student'

const tuitionFeeScheme = mongoose.Schema(
  {
    mark: { type: Number, required: true },
    fee: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Class,
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
