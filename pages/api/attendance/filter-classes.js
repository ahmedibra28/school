import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAuth } from '../../../utils/auth'
import Student from '../../../models/Student'
import Subject from '../../../models/Subject'

const handler = nc()
handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()
  const { classRoom, subject } = req.body
  const teacher = req.user.group === 'teacher' && req.user.teacher
  console.log(req.body)

  //   if (!teacher) {
  //     return res.status(400).send(`${req.user.name}, your are not a teacher`)
  //   }

  const obj = await Student.find({ classRoom })
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
