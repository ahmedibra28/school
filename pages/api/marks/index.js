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
    .populate('p12school')
    .populate('student')
    .populate('subject')

  res.send(obj)
})

handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, p12school, exam, className, subject, student, mark } =
    req.body

  const exist = await Mark.findOne({
    exam,
    p12school,
    className,
    subject,
    student,
  })
  if (exist) {
    return res.status(400).send('Mark already exist')
  }
  const createObj = await Mark.create({
    exam,
    p12school,
    isActive,
    className,
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
