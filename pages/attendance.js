import React, { useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../HOC/withAuth'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import {
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'

import { getClassRooms } from '../api/classRoom'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'
import { getPTwelveSchools } from '../api/pTwelveSchool'
import { getBranches } from '../api/branch'
import { getSubjects } from '../api/subject'
import {
  dynamicInputSelect,
  inputCheckBox,
  inputMultipleCheckBox,
  inputNumber,
  inputText,
} from '../utils/dynamicForm'
import { getFilteredClasses } from '../api/attendance'

const Attendance = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const queryClient = useQueryClient()

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

  const {
    isLoading: isLoadingClassRoomFilter,
    isError: isErrorClassRoomFilter,
    error: errorClassRoomFilter,
    isSuccess: isSuccessClassRoomFilter,
    mutateAsync: classRoomFilterMutateAsync,
    data,
  } = useMutation(getFilteredClasses, {
    retry: 0,
    onSuccess: () => {},
  })

  const studentData = data && data.student
  const subjectName = data && data.subject

  // console.log(data && data)

  const subjectData =
    classRoomData && classRoomData.filter((cl) => cl._id === watch().classRoom)

  const submitHandler = (data) => {
    classRoomFilterMutateAsync({
      classRoom: data.classRoom,
      pTwelveSchool: data.pTwelveSchool,
      branch: data.branch,
      subject: data.subject,
    })
  }

  return (
    <div className='container'>
      <Head>
        <title>Class Room</title>
        <meta property='og:title' content='Class Room' key='title' />
      </Head>
      {isSuccessClassRoomFilter && (
        <Message variant='success'>
          Student has been fetched successfully.
        </Message>
      )}
      {isErrorClassRoomFilter && (
        <Message variant='danger'>{errorClassRoomFilter}</Message>
      )}

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row'>
          <div className='col-md-3 col-6'>
            {dynamicInputSelect({
              register,
              label: 'Branch',
              errors,
              name: 'branch',
              data: branchData && branchData,
            })}
          </div>
          <div className='col-md-3 col-6'>
            {watch().branch &&
              dynamicInputSelect({
                register,
                label: 'P12 School',
                errors,
                name: 'pTwelveSchool',
                data:
                  p12SchoolData &&
                  p12SchoolData.filter((p) => p.branch._id === watch().branch),
              })}
          </div>
          <div className='col-md-2 col-4'>
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
          <div className='col-md-3 col-4'>
            {watch().classRoom &&
              dynamicInputSelect({
                register,
                label: 'Subject',
                errors,
                name: 'subject',
                data: subjectData && subjectData.map((sub) => sub.subject[0]),
              })}
          </div>

          <div className='col-md-2 col-4 my-auto'>
            <button
              type='submit'
              className='btn btn-primary btn-lg mt-2 form-control shadow'
              disabled={isLoadingClassRoomFilter}
            >
              {isLoadingClassRoomFilter ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>
      </form>

      {isLoadingClassRoomFilter ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isErrorClassRoomFilter ? (
        <Message variant='danger'>{errorClassRoomFilter}</Message>
      ) : (
        <>
          <div className='table-responsive '>
            <table className='table table-sm hover bordered striped caption-top '>
              <caption>
                {studentData && studentData.length} records were found
              </caption>
              <thead>
                <tr>
                  <th>ROLL NO. </th>
                  <th>STUDENT</th>
                  <th>BRANCH</th>
                  <th>P12 SCHOOL</th>
                  <th>SUBJECT</th>
                </tr>
              </thead>
              <tbody>
                {studentData &&
                  subjectName &&
                  studentData.map((student) => (
                    <tr key={student._id}>
                      <td>{student.rollNo}</td>
                      <td>
                        {student.name.charAt(0).toUpperCase() +
                          student.name.slice(1)}
                      </td>
                      <td>
                        {student.branch.name.charAt(0).toUpperCase() +
                          student.branch.name.slice(1)}
                      </td>
                      <td>
                        {student.pTwelveSchool.name.charAt(0).toUpperCase() +
                          student.pTwelveSchool.name.slice(1)}
                      </td>
                      <td>
                        {subjectName.name.charAt(0).toUpperCase() +
                          subjectName.name.slice(1)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(withAuth(Attendance)), {
  ssr: false,
})
