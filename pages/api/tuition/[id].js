import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import TuitionFee from '../../../models/TuitionFee'
import { isAuth } from '../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, fee, classRoom, paymentDate, student } = req.body
  const _id = req.query.id

  const obj = await TuitionFee.findById(_id)

  if (obj) {
    const exist = await TuitionFee.find({
      _id: { $ne: _id },
      paymentDate,
      classRoom,
      student,
    })
    if (exist.length === 0) {
      obj.fee = fee
      obj.classRoom = classRoom
      obj.paymentDate = paymentDate
      obj.student = student
      obj.isActive = isActive
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res
        .status(400)
        .send(`This ${paymentDate} tuition fee already exist`)
    }
  } else {
    return res.status(404).send('TuitionFee not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await TuitionFee.findById(_id)
  if (!obj) {
    return res.status(404).send('TuitionFee not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
