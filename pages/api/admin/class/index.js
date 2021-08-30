import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Class from '../../../../models/Class'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Class.find({})
    .sort({ createdAt: -1 })
    .populate('p12school')
    .populate('subject')

  res.send(obj)
})

handler.use(isAuth, isAdmin)
handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, p12school, subject, tuitionFee } = req.body
  const name = req.body.name.toLowerCase()

  const exist = await Class.findOne({ name, p12school })
  if (exist) {
    return res.status(400).send('Class already exist')
  }
  const createObj = await Class.create({
    name,
    subject,
    p12school,
    tuitionFee,
    isActive,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
