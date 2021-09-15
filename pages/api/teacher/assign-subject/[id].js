import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import AssignedSubject from '../../../../models/AssignedSubject'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()

  const obj = await AssignedSubject.find({ teacher: req.query.id })
    .sort({ createdAt: -1 })
    .populate('pTwelveSchool')
    .populate('classRoom')
    .populate('subject')
    .populate('branch')
    .populate('teacher')

  res.send(obj)
})

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, pTwelveSchool, branch, classRoom, teacher } = req.body
  const sub = req.body.subject
  const subject = !Array.isArray(sub) ? sub.split(',') : sub
  const _id = req.query.id

  const obj = await AssignedSubject.findById(_id)

  if (obj) {
    const exist = await AssignedSubject.find({
      _id: { $ne: _id },
      pTwelveSchool,
      branch,
      teacher,
      classRoom,
    })

    const existOtherTeacher = await AssignedSubject.find({
      _id: { $ne: _id },
      pTwelveSchool,
      branch,
      classRoom,
    })

    const conceitedSubs = [].concat.apply(
      [],
      existOtherTeacher.map((e) => e.subject)
    )

    console.log(subject)

    if (conceitedSubs.some((sub) => subject.includes(sub.toString()))) {
      return res.status(400).send('Subject already taken by another teacher')
    }

    if (exist.length === 0) {
      obj.subject = subject
      obj.teacher = teacher
      obj.branch = branch
      obj.classRoom = classRoom
      obj.pTwelveSchool = pTwelveSchool
      obj.isActive = isActive
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This ${name} Assigned subject already exist`)
    }
  } else {
    return res.status(404).send('Assigned subject not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await AssignedSubject.findById(_id)
  if (!obj) {
    return res.status(404).send('Assigned subject not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
