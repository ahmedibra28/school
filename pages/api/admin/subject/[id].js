import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Subject from '../../../../models/Subject'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, p12school, exam } = req.body
  const name = req.body.name.toLowerCase()
  const _id = req.query.id

  const obj = await Subject.findById(_id)

  if (obj) {
    const exist = await Subject.find({ _id: { $ne: _id }, name, p12school })
    if (exist.length === 0) {
      obj.name = name
      obj.exam = exam
      obj.p12school = p12school
      obj.isActive = isActive
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This ${name} Subject already exist`)
    }
  } else {
    return res.status(404).send('Subject not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Subject.findById(_id)
  if (!obj) {
    return res.status(404).send('Subject not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
