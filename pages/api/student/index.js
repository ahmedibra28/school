import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Student from '../../../models/Student'
import { isAuth } from '../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Student.find({}).sort({ createdAt: -1 }).populate('class')

  res.send(obj)
})

handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, className, mobile, address, gender } = req.body
  const name = req.body.name.toLowerCase()

  const exist = await Student.findOne({ name, mobile })
  if (exist) {
    return res.status(400).send('Student already exist')
  }
  const createObj = await Student.create({
    name,
    class: className,
    isActive,
    rollNo: `STD${(await Student.countDocuments()) + 1}`,
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
