import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Student from '../../../models/Student'
import { isAuth } from '../../../utils/auth'

const handler = nc()

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Student.find({}, { _id: 1, rollNo: 1 })

  res.send(obj)
})

export default handler
