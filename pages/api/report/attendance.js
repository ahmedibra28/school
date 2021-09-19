import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import { isAuth } from '../../../utils/auth'
import Attendance from '../../../models/Attendance'
import moment from 'moment'

const handler = nc()
handler.use(isAuth)

handler.post(async (req, res) => {
  await dbConnect()
  const { classRoom, subject, branch, pTwelveSchool, sDate, eDate } = req.body

  const startDate = moment(sDate).clone().startOf('day').format()
  const endDate = moment(eDate).clone().endOf('day').format()

  const attendances = await Attendance.find({
    classRoom,
    subject,
    branch,
    pTwelveSchool,
    createdAt: { $gte: startDate, $lt: endDate },
  })
    .sort({ createdAt: -1 })
    .populate('pTwelveSchool', 'name')
    .populate('subject', 'name')
    .populate('student.student')
    .populate('branch', 'name')
    .populate('classRoom', 'name')

  if (attendances.length > 0) {
    res.status(201).json(attendances)
  } else {
    return res
      .status(404)
      .send(`Between ${startDate} - ${endDate} were not found any attendances`)
  }
})

export default handler
