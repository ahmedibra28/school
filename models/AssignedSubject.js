import mongoose from 'mongoose'
import Branch from './Branch'
import PTwelveSchool from './PTwelveSchool'
import Subject from './Subject'
import Teacher from './Teacher'
import ClassRoom from './ClassRoom'

const assignedSubjectScheme = mongoose.Schema(
  {
    isActive: { type: Boolean, default: true },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Branch,
      required: true,
    },
    pTwelveSchool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: PTwelveSchool,
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Teacher,
      required: true,
    },
    classRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ClassRoom,
      required: true,
    },
    subject: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Subject,
        required: true,
      },
    ],
  },
  { timestamps: true }
)

const AssignedSubject =
  mongoose.models.AssignedSubject ||
  mongoose.model('AssignedSubject', assignedSubjectScheme)
export default AssignedSubject
