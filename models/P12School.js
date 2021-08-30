import mongoose from 'mongoose'
import Branch from './Branch'

const p12schoolScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Branch,
      required: true,
    },
  },
  { timestamps: true }
)

const P12School =
  mongoose.models.P12School || mongoose.model('P12School', p12schoolScheme)
export default P12School
