import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Student from '../../../models/Student'
import { isAuth } from '../../../utils/auth'

import fileUpload from 'express-fileupload'
import { upload } from '../../../utils/fileManager'
export const config = { api: { bodyParser: false } }

const handler = nc()
handler.use(fileUpload())

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Student.find({})
    .sort({ createdAt: -1 })
    .populate('classRoom')
    .populate('branch')
    .populate('pTwelveSchool')

  res.send(obj)
})

handler.post(async (req, res) => {
  await dbConnect()

  const {
    isActive,
    classRoom,
    mobile,
    address,
    gender,
    branch,
    pTwelveSchool,
    name,
  } = req.body
  const profilePicture = req.files && req.files.profilePicture
  const rollNo = `STD${(await Student.countDocuments()) + 1}`

  const exist = await Student.findOne({ mobile, branch, pTwelveSchool, name })
  if (exist) {
    return res.status(400).send('Student already exist')
  }
  if (profilePicture) {
    const profile = await upload({
      fileName: profilePicture,
      fileType: 'image',
      pathName: 'student',
    })

    if (profile) {
      const createObj = await Student.create({
        name,
        classRoom,
        rollNo,
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
    const createObj = await Student.create({
      name,
      classRoom,
      isActive,
      mobile,
      rollNo,
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
