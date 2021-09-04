import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import Document from '../../../models/Document'
import { isAuth } from '../../../utils/auth'

import fileUpload from 'express-fileupload'
import { deleteFile, upload } from '../../../../utils/fileManager'
export const config = { api: { bodyParser: false } }

const handler = nc()
handler.use(fileUpload())

handler.use(isAuth)
handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Document.findOne({ teacher: req.query.id })
    .sort({ createdAt: -1 })
    .populate('teacher')
    .populate('student')

  res.send(obj)
})

handler.put(async (req, res) => {
  await dbConnect()

  const document = req.files && req.files.document
  const profilePicture = req.files && req.files.profilePicture
  const _id = req.query.id

  const obj = await Document.findOne({ teacher: req.query.id })

  if (obj) {
    if (document) {
      if (obj && obj.document) {
        deleteFile({
          pathName: obj.document.documentPath,
        })
      }

      const doc = await upload({
        fileName: document,
        fileType: 'file',
        pathName: 'teacher',
      })

      if (doc) {
        obj.teacher = _id
        obj.document = {
          documentName: doc.fullFileName,
          documentPath: doc.filePath,
        }
        await obj.save()
      }
    }

    if (profilePicture) {
      if (obj && obj.profilePicture) {
        deleteFile({
          pathName: obj.profilePicture.imagePath,
        })
      }

      const img = await upload({
        fileName: document,
        fileType: 'image',
        pathName: 'teacher',
      })

      if (img) {
        obj.teacher = _id
        obj.profilePicture = {
          imageName: img.fullFileName,
          imagePath: img.filePath,
        }
        await obj.save()
      }
    }
    res.json({ status: 'success' })
  } else {
    return res.status(404).send('Documents not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()
  const teacher = await Document.findById(req.query.id)
  if (teacher) {
    if (teacher.profilePicture) {
      deleteFile({
        pathName: teacher.profilePicture.imagePath,
      })
    }
    if (teacher.document) {
      deleteFile({
        pathName: teacher.document.documentPath,
      })
    }

    await teacher.deleteOne()

    res.status(201).json(teacher)
  } else {
    res.status(400).send('Invalid ID')
  }
})

export default handler
