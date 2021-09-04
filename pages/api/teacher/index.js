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

  const {
    isActive,
    subject,
    mobile,
    address,
    gender,
    branch,
    pTwelveSchool,
    name,
  } = req.body
  const profilePicture = req.files && req.files.profilePicture

  const exist = await Teacher.findOne({ mobile, branch, pTwelveSchool })
  if (exist) {
    return res.status(400).send('Teacher already exist')
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
      subject: !Array.isArray(subject) && subject.split(','),
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
