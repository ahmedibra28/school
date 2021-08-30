import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import P12School from '../../../../models/P12School'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await P12School.find({}).sort({ createdAt: -1 }).populate('route')

  res.send(obj)
})

handler.use(isAuth, isAdmin)
handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, branch } = req.body
  const name = req.body.name.toLowerCase()

  const exist = await P12School.findOne({ name, branch })
  if (exist) {
    return res.status(400).send('P12School already exist')
  }
  const createObj = await P12School.create({
    name,
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
