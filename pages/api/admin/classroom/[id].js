import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import ClassRoom from '../../../../models/ClassRoom'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, p12school, subject, tuitionFee } = req.body
  const name = req.body.name.toLowerCase()
  const _id = req.query.id

  const obj = await ClassRoom.findById(_id)

  if (obj) {
    const exist = await ClassRoom.find({ _id: { $ne: _id }, name, p12school })
    if (exist.length === 0) {
      obj.name = name
      obj.subject = subject
      obj.tuitionFee = tuitionFee
      obj.p12school = p12school
      obj.isActive = isActive
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This ${name} Classroom already exist`)
    }
  } else {
    return res.status(404).send('Classroom not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await ClassRoom.findById(_id)
  if (!obj) {
    return res.status(404).send('Classroom not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
