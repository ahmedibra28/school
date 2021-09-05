import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Teacher from '../../../models/Teacher'
import { isAuth } from '../../../utils/auth'

import fileUpload from 'express-fileupload'
import { upload } from '../../../utils/fileManager'
export const config = { api: { bodyParser: false } }

const handler = nc()
handler.use(fileUpload())

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Teacher.find({})
    .sort({ createdAt: -1 })
    .populate('subject')
    .populate('branch')
    .populate('pTwelveSchool')

  res.send(obj)
})

handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, mobile, address, gender, branch, pTwelveSchool, name } =
    req.body
  const profilePicture = req.files && req.files.profilePicture
  const subject =
    !Array.isArray(req.body.subject) && req.body.subject.split(',')

  const exist = await Teacher.find({ branch, pTwelveSchool })
  if (exist) {
    if (exist.map((m) => Number(m.mobile)).includes(Number(mobile)))
      return res.status(400).send(`${mobile} already taken by a teacher`)

    const conceitedSubs = [].concat.apply(
      [],
      exist.map((e) => e.subject)
    )

    if (conceitedSubs.some((sub) => subject.includes(sub.toString()))) {
      return res.status(400).send('Subject already taken by another teacher')
    }
  }
  if (profilePicture) {
    const profile = await upload({
      fileName: profilePicture,
      fileType: 'image',
      pathName: 'teacher',
    })

    if (profile) {
      const createObj = await Teacher.create({
        name,
        subject,
        isActive,
        mobile,
        address,
        gender,
        profilePicture: {
          imageName: profile.fullFileName,
          imagePath: profile.filePath,
        },
        branch,
        pTwelveSchool,
      })

      if (createObj) {
        res.status(201).json({ status: 'success' })
      } else {
        return res.status(400).send('Invalid data')
      }
    }
  } else {
    const createObj = await Teacher.create({
      name,
      subject,
      isActive,
      mobile,
      address,
      gender,
      branch,
      pTwelveSchool,
    })

    if (createObj) {
      res.status(201).json({ status: 'success' })
    } else {
      return res.status(400).send('Invalid data')
    }
  }
})

export default handler
