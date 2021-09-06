import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Teacher from '../../../models/Teacher'
import { isAuth } from '../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Teacher.find({}, { _id: 1, name: 1 })

  res.send(obj)
})

export default handler
