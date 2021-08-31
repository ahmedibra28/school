import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import TuitionFee from '../../../models/TuitionFee'
import { isAuth } from '../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await TuitionFee.find({})
    .sort({ createdAt: -1 })
    .populate('p12school')
    .populate('exam')

  res.send(obj)
})

handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, fee, className, paymentDate, student } = req.body

  const exist = await TuitionFee.findOne({
    className,
    paymentDate,
    student,
  })
  if (exist) {
    return res.status(400).send('Tuition fee already exist')
  }
  const createObj = await TuitionFee.create({
    fee,
    isActive,
    className,
    paymentDate,
    student,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
