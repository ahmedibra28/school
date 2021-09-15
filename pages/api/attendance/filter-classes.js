import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAuth } from '../../../utils/auth'
import Student from '../../../models/Student'
import Subject from '../../../models/Subject'
import AssignedSubject from '../../../models/AssignedSubject'
import Attendance from '../../../models/Attendance'
import moment from 'moment'

const handler = nc()
handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()
  const { classRoom, subject } = req.body
  const teacher = req.user.group === 'teacher' && req.user.teacher

  if (!teacher) {
    return res
      .status(400)
      .send(`${req.user.name}, your are not a teacher of this subject`)
  }

  const assigned = await AssignedSubject.find({
    teacher,
    classRoom,
    isActive: true,
  })

  const conceitedSubs = [].concat.apply(
    [],
    assigned.map((a) => a.subject)
  )

  const newConceitedSubString = conceitedSubs.map((con) => con.toString())

  if (
    conceitedSubs.length === 0 ||
    !newConceitedSubString.includes(subject.toString())
  ) {
    return res
      .status(400)
      .send(`${req.user.name}, your are not a teacher of this subject`)
  }

  const obj = await Student.find({ classRoom, isActive: true })
    .sort({ createdAt: -1 })
    .populate('pTwelveSchool', 'name')
    .populate('branch', 'name')
  if (obj.length === 0) {
    return res
      .status(404)
      .send('No students associated the classroom you selected')
  }

  if (obj.length > 0) {
    const startDate = moment(new Date()).clone().startOf('day').format()
    const endDate = moment(new Date()).clone().endOf('day').format()

    const attendances = await Attendance.find({
      classRoom,
      subject,
      createdAt: { $gte: startDate, $lt: endDate },
    })

    if (attendances.length === 0) {
      const createObj = await Attendance.create({
        isActive: true,
        classRoom,
        subject,
        branch: obj && obj[0] && obj[0].branch && obj[0].branch._id,
        pTwelveSchool:
          obj && obj[0] && obj[0].pTwelveSchool && obj[0].pTwelveSchool._id,
        student: obj.map((std) => std.isActive && std._id),
      })
      if (createObj) {
        res.status(201).json(
          await Attendance.findOne({
            classRoom,
            subject,
            createdAt: { $gte: startDate, $lt: endDate },
          })
            .populate('student')
            .populate('branch', 'name')
            .populate('subject', 'name')
            .populate('classRoom', 'name')
        )
      } else {
        return res.status(400).send('Invalid attendance generating')
      }
    } else {
      res.send(
        await Attendance.findOne({
          classRoom,
          subject,
          createdAt: { $gte: startDate, $lt: endDate },
        })
          .populate('student')
          .populate('branch', 'name')
          .populate('subject', 'name')
          .populate('classRoom', 'name')
      )
    }
  }
})

export default handler
