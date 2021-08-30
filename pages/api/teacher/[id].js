import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Teacher from '../../../../models/Teacher'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, subject, mobile, address, gender } = req.body
  const name = req.body.name.toLowerCase()
  const _id = req.query.id

  const obj = await Teacher.findById(_id)

  if (obj) {
    const exist = await Teacher.find({ _id: { $ne: _id }, name, mobile })
    if (exist.length === 0) {
      obj.name = name
      obj.subject = subject
      obj.mobile = mobile
      obj.address = address
      obj.gender = gender
      obj.isActive = isActive
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This ${name} Teacher already exist`)
    }
  } else {
    return res.status(404).send('Teacher not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Teacher.findById(_id)
  if (!obj) {
    return res.status(404).send('Teacher not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
