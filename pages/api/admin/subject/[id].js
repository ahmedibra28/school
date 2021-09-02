import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Subject from '../../../../models/Subject'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, pTwelveSchool, exam, branch } = req.body

  const name = req.body.name.toLowerCase()
  const _id = req.query.id

  const obj = await Subject.findById(_id)

  if (obj) {
    const exist = await Subject.find({
      _id: { $ne: _id },
      name,
      pTwelveSchool,
      branch,
    })
    if (exist.length === 0) {
      obj.name = name
      obj.exam = exam
      obj.branch = branch
      obj.pTwelveSchool = pTwelveSchool
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
