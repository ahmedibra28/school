import mongoose from 'mongoose'

const branchScheme = mongoose.Schema(
  {
    name: { type: String, require: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Branch = mongoose.models.Branch || mongoose.model('Branch', branchScheme)
export default Branch
