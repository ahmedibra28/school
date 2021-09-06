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

  const obj = await Teacher.find({}).sort({ createdAt: -1 })

  res.send(obj)
})

handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, mobile, address, gender, name } = req.body
  const profilePicture = req.files && req.files.profilePicture

  const exist = await Teacher.findOne({ mobile })
  if (exist) {
    return res.status(400).send(`${mobile} already taken by a teacher`)
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
        isActive,
        mobile,
        address,
        gender,
        profilePicture: {
          imageName: profile.fullFileName,
          imagePath: profile.filePath,
        },
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
      isActive,
      mobile,
      address,
      gender,
    })

    if (createObj) {
      res.status(201).json({ status: 'success' })
    } else {
      return res.status(400).send('Invalid data')
    }
  }
})

export default handler
