import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Attendance from '../../../models/Attendance'
import { isAuth } from '../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Attendance.find({})
    .sort({ createdAt: -1 })
    .populate('subject')

  res.send(obj)
})

handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, classRoom, subject, student } = req.body

  const exist = await Attendance.findOne({
    classRoom,
    subject,
    student,
    createdAt: Date.now(),
  })
  if (exist) {
    return res.status(400).send('Attendance already exist')
  }
  const createObj = await Attendance.create({
    isActive,
    classRoom,
    subject,
    student,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
