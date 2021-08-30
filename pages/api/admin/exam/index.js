import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Exam from '../../../../models/Exam'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Exam.find({}).sort({ createdAt: -1 })

  res.send(obj)
})

handler.use(isAuth, isAdmin)
handler.post(async (req, res) => {
  await dbConnect()

  const { isActive } = req.body
  const name = req.body.name.toLowerCase()

  const exist = await Exam.findOne({ name })
  if (exist) {
    return res.status(400).send('Exam already exist')
  }
  const createObj = await Exam.create({
    name,
    isActive,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
