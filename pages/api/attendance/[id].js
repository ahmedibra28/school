import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Attendance from '../../../models/Attendance'
import { isAuth } from '../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, className, subject, student } = req.body
  const _id = req.query.id

  const obj = await Attendance.findById(_id)

  if (obj) {
    const exist = await Attendance.find({
      _id: { $ne: _id },
      className,
      subject,
      student,
      createdAt: Date.now(),
    })
    if (exist.length === 0) {
      obj.class = className
      obj.subject = subject
      obj.student = student
      obj.isActive = isActive
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This ${subject} Attendance already exist`)
    }
  } else {
    return res.status(404).send('Attendance not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Attendance.findById(_id)
  if (!obj) {
    return res.status(404).send('Attendance not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
