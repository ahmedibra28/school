import mongoose from 'mongoose'
import Subject from './Subject'

const classRoomScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    tuitionFee: { type: Number, required: true },
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

const ClassRoom =
  mongoose.models.ClassRoom || mongoose.model('ClassRoom', classRoomScheme)
export default ClassRoom
