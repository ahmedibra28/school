import mongoose from 'mongoose'

const examScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Exam = mongoose.models.Exam || mongoose.model('Exam', examScheme)
export default Exam
