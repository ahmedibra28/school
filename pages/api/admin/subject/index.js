import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Subject from '../../../../models/Subject'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Subject.find({})
    .sort({ createdAt: -1 })
    .populate('pTwelveSchool')
    .populate('exam')
    .populate('branch')

  res.send(obj)
})

handler.use(isAuth, isAdmin)
handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, pTwelveSchool, exam, branch } = req.body
  const name = req.body.name.toLowerCase()

  const exist = await Subject.findOne({ name, pTwelveSchool, branch })
  if (exist) {
    return res.status(400).send('Subject already exist')
  }
  const createObj = await Subject.create({
    name,
    exam,
    pTwelveSchool,
    branch,
    isActive,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
