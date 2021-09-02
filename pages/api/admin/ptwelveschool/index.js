import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import PTwelveSchool from '../../../../models/PTwelveSchool'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await PTwelveSchool.find({})
    .sort({ createdAt: -1 })
    .populate('branch')

  res.send(obj)
})

handler.use(isAuth, isAdmin)
handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, branch } = req.body
  const name = req.body.name.toLowerCase()

  const exist = await PTwelveSchool.findOne({ name, branch })
  if (exist) {
    return res.status(400).send('PTwelveSchool already exist')
  }
  const createObj = await PTwelveSchool.create({
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
