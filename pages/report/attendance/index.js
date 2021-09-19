import { useState } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import Message from '../../../components/Message'
import Loader from 'react-loader-spinner'
import dynamic from 'next/dynamic'
import withAuth from '../../../HOC/withAuth'
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css'
import { getClassRooms } from '../../../api/classRoom'
import { useMutation, useQuery } from 'react-query'
import { useForm } from 'react-hook-form'
import { getPTwelveSchools } from '../../../api/pTwelveSchool'
import { getBranches } from '../../../api/branch'
import { dynamicInputSelect } from '../../../utils/dynamicForm'
import { getAttendances } from '../../../api/report'
import {
  FaPlus,
  FaMinus,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa'
import moment from 'moment'

const Attendance = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [toggle, setToggle] = useState(true)

  const handleSelect = (ranges) => {
    setStartDate(ranges.selection.startDate)
    setEndDate(ranges.selection.endDate)
  }
  const selectionRange = { startDate, endDate, key: 'selection' }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const { data: classRoomData } = useQuery(
    'classRooms',
    () => getClassRooms(),
    {
      retry: 0,
    }
  )

  const { data: p12SchoolData } = useQuery(
    'pTwelveSchools',
    () => getPTwelveSchools(),
    {
      retry: 0,
    }
  )

  const { data: branchData } = useQuery('branches', () => getBranches(), {
    retry: 0,
  })

  const subjectData =
    classRoomData && classRoomData.filter((cl) => cl._id === watch().classRoom)

  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    error: errorPost,
    isSuccess: isSuccessPost,
    mutateAsync: postMutateAsync,
    data: attendanceData,
  } = useMutation(getAttendances, {
    retry: 0,
    onSuccess: () => {},
  })

  const submitHandler = (attendance) => {
    postMutateAsync({
      classRoom: attendance.classRoom,
      subject: attendance.subject,
      branch: attendance.branch,
      pTwelveSchool: attendance.pTwelveSchool,
      sDate: startDate,
      eDate: endDate,
    })
  }

  const filteredAttendance = (student, data) => {
    return (
      <tr key={student._id}>
        <td>
          <Image
            width='27'
            height='27'
            priority
            className='img-fluid rounded-pill'
            src={
              student.student &&
              student.student &&
              student.student.profilePicture &&
              student.student &&
              student.student &&
              student.student.profilePicture.imagePath
            }
            alt={
              student.student &&
              student.student &&
              student.student.profilePicture &&
              student.student &&
              student.student &&
              student.student.profilePicture.imageName
            }
          />
        </td>
        <td>{student.student && student.student.rollNo}</td>
        <td>{student.student && student.student.name}</td>
        <td>{data.classRoom && data.classRoom.name}</td>
        <td>{data.subject && data.subject.name}</td>
        <td>
          {student.isAttended ? (
            <FaCheckCircle className='text-success mb-1' />
          ) : (
            <FaTimesCircle className='text-danger mb-1' />
          )}
        </td>
        <td>{moment(data.createdAt).format('lll')}</td>
      </tr>
    )
  }

  return (
    <div className='container'>
      <Head>
        <title>Attendance Report</title>
        <meta property='og:title' content='Attendance Report' key='title' />
      </Head>
      {isSuccessPost && (
        <Message variant='success'>
          Attendance has been fetched successfully.
        </Message>
      )}
      {isErrorPost && <Message variant='danger'>{errorPost}</Message>}
      <button
        onClick={() => setToggle(!toggle)}
        className='btn btn-primary btn-sm rounded-pill float-end mt-1'
      >
        {toggle ? <FaMinus className='mb-1' /> : <FaPlus className='mb-1' />}
      </button>
      {toggle && (
        <>
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className='row'>
              <div className='col-md-5'>
                <DateRange
                  className='w-auto'
                  ranges={[selectionRange]}
                  onChange={handleSelect}
                />
              </div>
              <div className='col-md-7'>
                <div className='row'>
                  <div className='col-12'>
                    {dynamicInputSelect({
                      register,
                      label: 'Branch',
                      errors,
                      name: 'branch',
                      data: branchData && branchData,
                    })}
                  </div>

                  <div className='col-12'>
                    {watch().branch &&
                      dynamicInputSelect({
                        register,
                        label: 'P12 School',
                        errors,
                        name: 'pTwelveSchool',
                        data:
                          p12SchoolData &&
                          p12SchoolData.filter(
                            (p) => p.branch._id === watch().branch
                          ),
                      })}
                  </div>

                  <div className='col-12'>
                    {watch().pTwelveSchool &&
                      dynamicInputSelect({
                        register,
                        label: 'Class Room',
                        errors,
                        name: 'classRoom',
                        data:
                          classRoomData &&
                          classRoomData.filter(
                            (s) => s.pTwelveSchool._id === watch().pTwelveSchool
                          ),
                      })}
                  </div>

                  <div className='col-md-10 col-6'>
                    {watch().classRoom &&
                      dynamicInputSelect({
                        register,
                        label: 'Subject',
                        errors,
                        name: 'subject',
                        data:
                          subjectData &&
                          subjectData[0] &&
                          subjectData[0].subject &&
                          subjectData[0].subject,
                      })}
                  </div>
                  <div className='col-md-2 col-6 my-auto'>
                    <button
                      type='submit'
                      className='btn btn-primary btn-lg mt-2 form-control shadow rounded-3'
                      disabled={isLoadingPost}
                    >
                      {isLoadingPost ? (
                        <span className='spinner-border spinner-border-sm' />
                      ) : (
                        <FaSearch className='mb-1' />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <hr />
        </>
      )}

      {isLoadingPost ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isErrorPost ? (
        <Message variant='danger'>{errorPost}</Message>
      ) : (
        <>
          {attendanceData && (
            <div className='table-responsive '>
              <table className='table table-sm hover bordered striped caption-top '>
                <thead>
                  <tr>
                    <th>PHOTO</th>
                    <th>SID</th>
                    <th>NAME</th>
                    <th>SEMESTER</th>
                    <th>SUBJECT</th>
                    <th>ATTENDED?</th>
                    <th>ATTENDED DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData &&
                    attendanceData.map((data) =>
                      data.student.map((student) =>
                        filteredAttendance(student, data)
                      )
                    )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Attendance)), {
  ssr: false,
})
