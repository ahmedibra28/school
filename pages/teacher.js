import React, { useState, useEffect } from 'react'
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
  getTeachers,
  updateTeacher,
  deleteTeacher,
  addTeacher,
} from '../api/teacher'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'
import { getPTwelveSchools } from '../api/pTwelveSchool'
import { getSubjects } from '../api/subject'
import {
  dynamicInputSelect,
  inputCheckBox,
  inputFile,
  inputMultipleCheckBox,
  inputNumber,
  inputText,
  staticInputSelect,
} from '../utils/dynamicForm'
import { getBranches } from '../api/branch'

const Teacher = () => {
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

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)
  const [file, setFile] = useState('')
  const [imageDisplay, setImageDisplay] = useState('')

  const { data, isLoading, isError, error } = useQuery(
    'teachers',
    () => getTeachers(),
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

  const { data: subjectData } = useQuery('subjects', () => getSubjects(), {
    retry: 0,
  })

  const { data: branchData } = useQuery('branches', () => getBranches(), {
    retry: 0,
  })

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = useMutation(updateTeacher, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      setFile('')
      queryClient.invalidateQueries(['teachers'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteTeacher, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['teachers']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addTeacher, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      setFile('')
      queryClient.invalidateQueries(['teachers'])
    },
  })

  const formCleanHandler = () => {
    setEdit(false)
    setFile('')
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteMutateAsync(id)))
  }

  useEffect(() => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setImageDisplay(reader.result)
    })
    file && reader.readAsDataURL(file)
  }, [file])

  const submitHandler = (data) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('mobile', data.mobile)
    formData.append('address', data.address)
    formData.append('gender', data.gender)
    formData.append('profilePicture', file)
    formData.append('branch', data.branch)
    formData.append('pTwelveSchool', data.pTwelveSchool)
    formData.append('subject', data.subject)
    formData.append('isActive', data.isActive)

    edit
      ? updateMutateAsync({
          _id: id,
          formData,
        })
      : addMutateAsync(formData)
  }

  const editHandler = (teacher) => {
    setId(teacher._id)
    setEdit(true)
    setValue('name', teacher.name)
    setValue('mobile', teacher.mobile)
    setValue('address', teacher.address)
    setValue('gender', teacher.gender)
    setValue('branch', teacher.branch._id)
    setValue('pTwelveSchool', teacher.pTwelveSchool._id)
    setValue('subject', teacher.subject && teacher.subject.map((id) => id._id))
    setValue('isActive', teacher.isActive)

    setImageDisplay(teacher.profilePicture && teacher.profilePicture.imagePath)
  }

  return (
    <div className='container'>
      <Head>
        <title>Teacher</title>
        <meta property='og:title' content='Teacher' key='title' />
      </Head>
      {isSuccessUpdate && (
        <Message variant='success'>
          Teacher has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          Teacher has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>
          Teacher has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      <div
        className='modal fade'
        id='editTeacherModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editTeacherModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editTeacherModalLabel'>
                {edit ? 'Edit Teacher' : 'Add Teacher'}
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
                    <div className='col-10'>
                      {inputFile({
                        register,
                        errors,
                        name: 'profilePicture',
                        label: 'Profile Picture',
                        setFile,
                        isRequired: false,
                      })}
                    </div>
                    <div className='col-2 my-auto pt-3'>
                      {edit && imageDisplay && (
                        <Image
                          width='35'
                          height='35'
                          priority
                          className='img-fluid rounded-pill my-auto'
                          src={imageDisplay}
                          alt={imageDisplay}
                        />
                      )}
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
                        inputMultipleCheckBox({
                          register,
                          label: 'Subject',
                          errors,
                          name: 'subject',
                          data:
                            subjectData &&
                            subjectData.filter(
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
        <h3 className=''>Teachers</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editTeacherModal'
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
                  <th>IMAGE </th>
                  <th>TEACHER </th>
                  <th>BRANCH</th>
                  <th>P12 SCHOOL</th>
                  <th>MOBILE</th>
                  <th>SUBJECT</th>
                  <th>ACTIVE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((teacher) => (
                    <tr key={teacher._id}>
                      <td>
                        {teacher.profilePicture && (
                          <Image
                            width='27'
                            height='27'
                            priority
                            className='img-fluid rounded-pill'
                            src={
                              teacher.profilePicture &&
                              teacher.profilePicture.imagePath
                            }
                            alt={
                              teacher.profilePicture &&
                              teacher.profilePicture.imageName
                            }
                          />
                        )}
                      </td>
                      <td>
                        {teacher.name.charAt(0).toUpperCase() +
                          teacher.name.slice(1)}
                      </td>
                      <td>{teacher.branch && teacher.branch.name}</td>
                      <td>
                        {teacher.pTwelveSchool && teacher.pTwelveSchool.name}
                      </td>
                      <td>{teacher.mobile}</td>
                      <td>
                        {teacher.subject &&
                          teacher.subject.map((s) => (
                            <span key={s._id} className='badge bg-primary me-1'>
                              {s.name}
                            </span>
                          ))}
                      </td>
                      <td>
                        {teacher.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>

                      <td className='btn-teacher'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(teacher)}
                          data-bs-toggle='modal'
                          data-bs-target='#editTeacherModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(teacher._id)}
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

export default dynamic(() => Promise.resolve(withAuth(Teacher)), {
  ssr: false,
})
