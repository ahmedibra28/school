import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Mark from '../../../models/Mark'
import { isAuth } from '../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Mark.find({})
    .sort({ createdAt: -1 })
    .populate('pTwelveSchool')
    .populate('student')
    .populate('subject')

  res.send(obj)
})

handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, pTwelveSchool, exam, classRoom, subject, student, mark } =
    req.body

  const exist = await Mark.findOne({
    exam,
    pTwelveSchool,
    classRoom,
    subject,
    student,
  })
  if (exist) {
    return res.status(400).send('Mark already exist')
  }
  const createObj = await Mark.create({
    exam,
    pTwelveSchool,
    isActive,
    classRoom,
    subject,
    student,
    mark,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
