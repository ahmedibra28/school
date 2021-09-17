import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Attendance from '../../../models/Attendance'
import { isAuth } from '../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.put(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const entries = Object.entries(req.body)

  const obj = await Attendance.findById(_id)

  if (obj && entries.length > 0) {
    if (!obj.isActive)
      return res.status(404).send('Todays attendance has already been taken')

    let elements = []

    for (let i = 0; i < entries.length; i++) {
      elements.push({ student: entries[i][0], isAttended: entries[i][1] })
    }

    obj.student = elements
    obj.isActive = false
    const create = await obj.save()
    create && res.json({ status: 'success' })
  } else {
    return res.status(404).send('Attendance not found')
  }
})

export default handler
