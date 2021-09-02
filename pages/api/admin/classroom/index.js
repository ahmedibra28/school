import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import ClassRoom from '../../../../models/ClassRoom'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await ClassRoom.find({})
    .sort({ createdAt: -1 })
    .populate('pTwelveSchool')
    .populate('subject')

  res.send(obj)
})

handler.use(isAuth, isAdmin)
handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, pTwelveSchool, branch, subject, tuitionFee } = req.body
  const name = req.body.name.toLowerCase()

  const exist = await ClassRoom.findOne({ name, pTwelveSchool, branch })
  if (exist) {
    return res.status(400).send('Classroom already exist')
  }
  const createObj = await ClassRoom.create({
    name,
    subject,
    pTwelveSchool,
    branch,
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
