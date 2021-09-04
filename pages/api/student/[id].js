import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Student from '../../../models/Student'
import { isAuth } from '../../../utils/auth'

import fileUpload from 'express-fileupload'
import { upload, deleteFile } from '../../../utils/fileManager'
export const config = { api: { bodyParser: false } }

const handler = nc()
handler.use(fileUpload())

handler.use(isAuth)

handler.put(async (req, res) => {
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
  const _id = req.query.id

  const obj = await Student.findById(_id)

  if (obj) {
    const exist = await Student.find({ _id: { $ne: _id }, name, mobile })
    if (exist.length === 0) {
      if (profilePicture) {
        if (obj && obj.profilePicture) {
          deleteFile({
            pathName: obj.profilePicture.imagePath,
          })
        }

        const profile = await upload({
          fileName: profilePicture,
          fileType: 'image',
          pathName: 'student',
        })
        obj.name = name
        obj.classRoom = classRoom
        obj.mobile = mobile
        obj.address = address
        obj.gender = gender
        obj.isActive = isActive
        obj.profilePicture = {
          imageName: profile.fullFileName,
          imagePath: profile.filePath,
        }
        obj.branch = branch
        obj.pTwelveSchool = pTwelveSchool
        await obj.save()
        res.json({ status: 'success' })
      } else {
        obj.name = name
        obj.classRoom = classRoom
        obj.mobile = mobile
        obj.address = address
        obj.gender = gender
        obj.isActive = isActive
        obj.pTwelveSchool = pTwelveSchool
        obj.branch = branch
        await obj.save()
        res.json({ status: 'success' })
      }
    } else {
      return res.status(400).send(`This ${name} student already exist`)
    }
  } else {
    return res.status(404).send('Student not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Student.findById(_id)
  if (!obj) {
    return res.status(404).send('Student not found')
  } else {
    if (obj.profilePicture) {
      deleteFile({
        pathName: obj.profilePicture.imagePath,
      })
    }
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
