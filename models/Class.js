import mongoose from 'mongoose'
import Subject from './Subject'

const classScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    subject: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Subject,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
)

const Class = mongoose.models.Class || mongoose.model('Class', classScheme)
export default Class
