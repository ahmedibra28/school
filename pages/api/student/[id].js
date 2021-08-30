import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Student from '../../../../models/Student'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, className, mobile, address, gender } = req.body
  const name = req.body.name.toLowerCase()
  const _id = req.query.id

  const obj = await Student.findById(_id)

  if (obj) {
    const exist = await Student.find({ _id: { $ne: _id }, name, mobile })
    if (exist.length === 0) {
      obj.name = name
      obj.class = className
      obj.mobile = mobile
      obj.address = address
      obj.gender = gender
      obj.isActive = isActive
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This ${name} Student already exist`)
    }
  } else {
    return res.status(404).send('Student not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Student.findById(_id)
  if (!obj) {
    return res.status(404).send('Student not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
