import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import PTwelveSchool from '../../../../models/PTwelveSchool'
import { isAdmin, isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, branch } = req.body
  const name = req.body.name.toLowerCase()
  const _id = req.query.id

  const obj = await PTwelveSchool.findById(_id)

  if (obj) {
    const exist = await PTwelveSchool.find({ _id: { $ne: _id }, name, branch })
    if (exist.length === 0) {
      obj.name = name
      obj.branch = branch
      obj.isActive = isActive
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This ${name} PTwelveSchool already exist`)
    }
  } else {
    return res.status(404).send('PTwelveSchool not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await PTwelveSchool.findById(_id)
  if (!obj) {
    return res.status(404).send('PTwelveSchool not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
