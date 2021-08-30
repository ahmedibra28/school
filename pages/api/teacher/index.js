import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Teacher from '../../../models/Teacher'
import { isAuth } from '../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Teacher.find({}).sort({ createdAt: -1 }).populate('subject')

  res.send(obj)
})

handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, subject, mobile, address, gender } = req.body
  const name = req.body.name.toLowerCase()

  const exist = await Teacher.findOne({ name, mobile })
  if (exist) {
    return res.status(400).send('Teacher already exist')
  }
  const createObj = await Teacher.create({
    name,
    subject,
    isActive,
    mobile,
    address,
    gender,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
