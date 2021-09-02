import React, { useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'
import {
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'

import {
  getClassRooms,
  updateClassRoom,
  deleteClassRoom,
  addClassRoom,
} from '../../api/classRoom'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../components/Confirm'
import { useForm } from 'react-hook-form'
import { getPTwelveSchools } from '../../api/pTwelveSchool'
import { getSubjects } from '../../api/subject'
import {
  dynamicInputSelect,
  inputCheckBox,
  inputMultipleCheckBox,
  inputNumber,
  inputText,
} from '../../utils/dynamicForm'
import { getBranches } from '../../api/branch'

const ClassRoom = () => {
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
  } = useMutation(updateClassRoom, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['classRooms'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteClassRoom, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['classRooms']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addClassRoom, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['classRooms'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateMutateAsync({
          _id: id,
          name: data.name,
          exam: data.exam,
          pTwelveSchool: data.pTwelveSchool,
          branch: data.branch,
          subject: data.subject,
          tuitionFee: data.tuitionFee,
          isActive: data.isActive,
        })
      : addMutateAsync(data)
  }

  const editHandler = (classRoom) => {
    setId(classRoom._id)
    setEdit(true)
    setValue('name', classRoom.name)
    setValue('branch', classRoom.branch._id)
    setValue(
      'subject',
      classRoom.subject && classRoom.subject.map((id) => id._id)
    )
    setValue('pTwelveSchool', classRoom.pTwelveSchool._id)
    setValue('branch', classRoom.branch._id)
    setValue('tuitionFee', classRoom.tuitionFee)
    setValue('isActive', classRoom.isActive)
  }

  return (
    <div className='container'>
      <Head>
        <title>Class Room</title>
        <meta property='og:title' content='Class Room' key='title' />
      </Head>
      {isSuccessUpdate && (
        <Message variant='success'>
          Class Room has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          Class Room has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>
          Class Room has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      <div
        className='modal fade'
        id='editClassRoomModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editClassRoomModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editClassRoomModalLabel'>
                {edit ? 'Edit ClassRoom' : 'Add ClassRoom'}
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
                  {inputText({ register, label: 'Name', errors, name: 'name' })}
                  {inputNumber({
                    register,
                    label: 'Tuition Fee',
                    errors,
                    name: 'tuitionFee',
                  })}
                  {dynamicInputSelect({
                    register,
                    label: 'Branch',
                    errors,
                    name: 'branch',
                    data: branchData && branchData,
                  })}

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

                  {watch().pTwelveSchool &&
                    inputMultipleCheckBox({
                      register,
                      label: 'Subject',
                      errors,
                      name: 'subject',
                      data:
                        subjectData &&
                        subjectData.filter(
                          (s) => s.pTwelveSchool._id === watch().pTwelveSchool
                        ),
                    })}

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
        <h3 className=''>Class Rooms</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editClassRoomModal'
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
                  <th>CLASS </th>
                  <th>BRANCH</th>
                  <th>P12 SCHOOL</th>
                  <th>SUBJECT</th>
                  <th>TUITION FEE</th>
                  <th>ACTIVE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((classRoom) => (
                    <tr key={classRoom._id}>
                      <td>
                        {classRoom.name.charAt(0).toUpperCase() +
                          classRoom.name.slice(1)}
                      </td>
                      <td>
                        {classRoom.branch.name.charAt(0).toUpperCase() +
                          classRoom.branch.name.slice(1)}
                      </td>
                      <td>
                        {classRoom.pTwelveSchool.name.charAt(0).toUpperCase() +
                          classRoom.pTwelveSchool.name.slice(1)}
                      </td>
                      <td>
                        {classRoom.subject &&
                          classRoom.subject.map((s) => (
                            <span key={s._id} className='badge bg-primary me-1'>
                              {s.name}
                            </span>
                          ))}
                      </td>
                      <td>${classRoom.tuitionFee.toFixed(2)}</td>
                      <td>
                        {classRoom.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>

                      <td className='btn-classRoom'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(classRoom)}
                          data-bs-toggle='modal'
                          data-bs-target='#editClassRoomModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(classRoom._id)}
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

export default dynamic(() => Promise.resolve(withAuth(ClassRoom)), {
  ssr: false,
})
