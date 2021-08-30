import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Branch from '../../../../models/Branch'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Branch.find({}).sort({ createdAt: -1 }).populate('route')

  res.send(obj)
})

handler.use(isAuth, isAdmin)
handler.post(async (req, res) => {
  await dbConnect()

  const { isActive } = req.body
  const name = req.body.name.toLowerCase()

  const exist = await Branch.findOne({ name })
  if (exist) {
    return res.status(400).send('Branch already exist')
  }
  const createObj = await Branch.create({
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
