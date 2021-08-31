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

  const obj = await Document.findOne({ student: req.query.id })
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

  const obj = await Document.findOne({ student: req.query.id })

  if (obj) {
    if (document) {
      if (obj && Object.document) {
        deleteFile({
          pathName: obj.document.documentPath,
        })
      }

      const doc = await upload({
        fileName: document,
        fileType: 'file',
        pathName: 'student',
      })

      if (doc) {
        obj.student = _id
        obj.document = {
          documentName: doc.fullFileName,
          documentPath: doc.filePath,
        }
        await obj.save()
      }
    }

    if (profilePicture) {
      if (obj && Object.profilePicture) {
        deleteFile({
          pathName: obj.profilePicture.imagePath,
        })
      }

      const img = await upload({
        fileName: document,
        fileType: 'image',
        pathName: 'student',
      })

      if (img) {
        obj.student = _id
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
  const student = await Document.findById(req.query.id)
  if (student) {
    if (student.profilePicture) {
      deleteFile({
        pathName: student.profilePicture.imagePath,
      })
    }
    if (student.document) {
      deleteFile({
        pathName: student.document.documentPath,
      })
    }

    await student.deleteOne()

    res.status(201).json(student)
  } else {
    res.status(400).send('Invalid ID')
  }
})

export default handler
