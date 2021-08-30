import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import P12School from '../../../../models/P12School'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, branch } = req.body
  const name = req.body.name.toLowerCase()
  const _id = req.query.id

  const obj = await P12School.findById(_id)

  if (obj) {
    const exist = await P12School.find({ _id: { $ne: _id }, name, branch })
    if (exist.length === 0) {
      obj.name = name
      obj.branch = branch
      obj.isActive = isActive
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This ${name} P12School already exist`)
    }
  } else {
    return res.status(404).send('P12School not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await P12School.findById(_id)
  if (!obj) {
    return res.status(404).send('P12School not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
