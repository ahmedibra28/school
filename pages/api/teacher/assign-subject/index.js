import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import AssignedSubject from '../../../../models/AssignedSubject'
import { isAuth } from '../../../../utils/auth'

const handler = nc()

handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, pTwelveSchool, branch, classRoom, teacher } = req.body
  const sub = req.body.subject
  const subject = !Array.isArray(sub) ? sub.split(',') : sub

  const exist = await AssignedSubject.findOne({
    teacher,
    pTwelveSchool,
    branch,
    classRoom,
  })

  const existAnotherTeacher = await AssignedSubject.find({
    pTwelveSchool,
    branch,
    classRoom,
  })

  const conceitedSubs = [].concat.apply(
    [],
    existAnotherTeacher.map((e) => e.subject)
  )

  if (conceitedSubs.some((sub) => subject.includes(sub.toString()))) {
    return res.status(400).send('Subject already taken by another teacher')
  }

  if (exist) {
    return res.status(400).send('Subject already assigned to a teacher')
  }
  const createObj = await AssignedSubject.create({
    isActive,
    pTwelveSchool,
    branch,
    subject,
    classRoom,
    teacher,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
