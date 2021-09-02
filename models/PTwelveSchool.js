import mongoose from 'mongoose'
import Branch from './Branch'

const pTwelveSchoolScheme = mongoose.Schema(
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

const PTwelveSchool =
  mongoose.models.PTwelveSchool ||
  mongoose.model('PTwelveSchool', pTwelveSchoolScheme)
export default PTwelveSchool
