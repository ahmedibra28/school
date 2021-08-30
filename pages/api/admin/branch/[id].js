import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Branch from '../../../../models/Branch'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await dbConnect()

  const isActive = req.body.isActive
  const name = req.body.name.toLowerCase()
  const _id = req.query.id

  const obj = await Branch.findById(_id)

  if (obj) {
    const exist = await Branch.find({ _id: { $ne: _id }, name })
    if (exist.length === 0) {
      obj.name = name

      obj.isActive = isActive
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This ${name} Branch already exist`)
    }
  } else {
    return res.status(404).send('Branch not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Branch.findById(_id)
  if (!obj) {
    return res.status(404).send('Branch not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
