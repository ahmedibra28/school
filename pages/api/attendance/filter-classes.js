import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAuth } from '../../../utils/auth'
import Student from '../../../models/Student'
import Subject from '../../../models/Subject'
import AssignedSubject from '../../../models/AssignedSubject'

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
    .populate('pTwelveSchool')
    .populate('branch')
    .populate('classRoom')
  if (obj.length === 0) {
    return res
      .status(404)
      .send('No students associated the classroom you selected')
  }
  res.send({ student: obj, subject: await Subject.findById(subject) })
})

export default handler
