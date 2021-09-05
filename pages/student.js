import React, { useState } from 'react'
import Image from 'next/image'
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

import {
  getStudents,
  updateStudent,
  deleteStudent,
  addStudent,
} from '../api/student'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'
import { getPTwelveSchools } from '../api/pTwelveSchool'
import { getClassRooms } from '../api/classRoom'
import {
  dynamicInputSelect,
  inputCheckBox,
  inputFile,
  inputNumber,
  inputText,
  staticInputSelect,
} from '../utils/dynamicForm'
import { getBranches } from '../api/branch'

const Student = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
    },
  })

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'students',
    () => getStudents(),
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

  const { data: classRoomData } = useQuery(
    'classRooms',
    () => getClassRooms(),
    {
      retry: 0,
    }
  )

  const { data: branchData } = useQuery('branches', () => getBranches(), {
    retry: 0,
  })

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = useMutation(updateStudent, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      setFile('')
      queryClient.invalidateQueries(['students'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteStudent, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['students']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addStudent, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      setFile('')
      queryClient.invalidateQueries(['students'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [file, setFile] = useState('')

  const formCleanHandler = () => {
    setEdit(false)
    setFile('')
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteMutateAsync(id)))
  }

  const submitHandler = (data) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('mobile', data.mobile)
    formData.append('address', data.address)
    formData.append('gender', data.gender)
    formData.append('profilePicture', file)
    formData.append('branch', data.branch)
    formData.append('pTwelveSchool', data.pTwelveSchool)
    formData.append('classRoom', data.classRoom)
    formData.append('isActive', data.isActive)

    edit
      ? updateMutateAsync({
          _id: id,
          formData,
        })
      : addMutateAsync(formData)
  }

  const editHandler = (student) => {
    setId(student._id)
    setEdit(true)
    setValue('name', student.name)
    setValue('mobile', student.mobile)
    setValue('address', student.address)
    setValue('gender', student.gender)
    setValue('branch', student.branch._id)
    setValue('pTwelveSchool', student.pTwelveSchool._id)
    setValue('classRoom', student.classRoom._id)
    setValue('isActive', student.isActive)
  }

  return (
    <div className='container'>
      <Head>
        <title>Student</title>
        <meta property='og:title' content='Student' key='title' />
      </Head>
      {isSuccessUpdate && (
        <Message variant='success'>
          Student has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          Student has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>
          Student has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      <div
        className='modal fade'
        id='editStudentModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editStudentModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editStudentModalLabel'>
                {edit ? 'Edit Student' : 'Add Student'}
              </h3>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={formCleanHandler}
              ></button>
            </div>
            <div className='modal-body'>
              {isLoading ? (
                <div className='text-center'>
                  <Loader
                    type='ThreeDots'
                    color='#00BFFF'
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                  />
                </div>
              ) : isError ? (
                <Message variant='danger'>{error}</Message>
              ) : (
                <form onSubmit={handleSubmit(submitHandler)}>
                  <div className='row'>
                    <div className='col-md-6 col-12'>
                      {inputText({
                        register,
                        label: 'Name',
                        errors,
                        name: 'name',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputNumber({
                        register,
                        label: 'Mobile',
                        errors,
                        name: 'mobile',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {inputText({
                        register,
                        label: 'Address',
                        errors,
                        name: 'address',
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {staticInputSelect({
                        register,
                        label: 'Gender',
                        errors,
                        name: 'gender',
                        data: [{ name: 'Male' }, { name: 'Female' }],
                      })}
                    </div>
                    <div className='col-12'>
                      {inputFile({
                        register,
                        errors,
                        name: 'profilePicture',
                        label: 'Profile Picture',
                        setFile,
                        isRequired: false,
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
                      {dynamicInputSelect({
                        register,
                        label: 'Branch',
                        errors,
                        name: 'branch',
                        data: branchData && branchData,
                      })}
                    </div>
                    <div className='col-md-6 col-12'>
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
                          label: 'ClassRoom',
                          errors,
                          name: 'classRoom',
                          data:
                            classRoomData &&
                            classRoomData.filter(
                              (s) =>
                                s.pTwelveSchool._id === watch().pTwelveSchool
                            ),
                        })}
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col'>
                      {inputCheckBox({
                        register,
                        errors,
                        label: 'isActive',
                        name: 'isActive',
                        isRequired: false,
                      })}
                    </div>
                  </div>

                  <div className='modal-footer'>
                    <button
                      type='button'
                      className='btn btn-secondary '
                      data-bs-dismiss='modal'
                      onClick={formCleanHandler}
                    >
                      Close
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary '
                      disabled={isLoadingAdd || isLoadingUpdate}
                    >
                      {isLoadingAdd || isLoadingUpdate ? (
                        <span className='spinner-border spinner-border-sm' />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='d-flex justify-content-between align-items-center'>
        <h3 className=''>Students</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editStudentModal'
        >
          <FaPlus className='mb-1' />
        </button>
      </div>

      {isLoading ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <div className='table-responsive '>
            <table className='table table-sm hover bordered striped caption-top '>
              <caption>{data && data.length} records were found</caption>
              <thead>
                <tr>
                  <th>IMAGE</th>
                  <th>ROLL NO. </th>
                  <th>STUDENT </th>
                  <th>BRANCH</th>
                  <th>P12 SCHOOL</th>
                  <th>MOBILE</th>
                  <th>CLASS ROOM</th>
                  <th>ACTIVE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((student) => (
                    <tr key={student._id}>
                      <td>
                        {student.profilePicture && (
                          <Image
                            width='27'
                            height='27'
                            priority
                            className='img-fluid rounded-pill'
                            src={
                              student.profilePicture &&
                              student.profilePicture.imagePath
                            }
                            alt={
                              student.profilePicture &&
                              student.profilePicture.imageName
                            }
                          />
                        )}
                      </td>
                      <td>{student.rollNo}</td>
                      <td>
                        {student.name.charAt(0).toUpperCase() +
                          student.name.slice(1)}
                      </td>
                      <td>{student.branch && student.branch.name}</td>
                      <td>
                        {student.pTwelveSchool && student.pTwelveSchool.name}
                      </td>
                      <td>{student.mobile}</td>
                      <td>{student.classRoom && student.classRoom.name}</td>
                      <td>
                        {student.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>

                      <td className='btn-student'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(student)}
                          data-bs-toggle='modal'
                          data-bs-target='#editStudentModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(student._id)}
                          disabled={isLoadingDelete}
                        >
                          {isLoadingDelete ? (
                            <span className='spinner-border spinner-border-sm' />
                          ) : (
                            <span>
                              {' '}
                              <FaTrash className='mb-1' /> Delete
                            </span>
                          )}
                        </button>
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

export default dynamic(() => Promise.resolve(withAuth(Student)), {
  ssr: false,
})
