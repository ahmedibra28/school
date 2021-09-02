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

import { getExams, addExam, deleteExam, updateExam } from '../../api/exam'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../components/Confirm'
import { useForm } from 'react-hook-form'
import { inputCheckBox, inputText } from '../../utils/dynamicForm'
import moment from 'moment'

const Exam = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'exams',
    () => getExams(),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = useMutation(['update'], updateExam, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['exams'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(['delete'], deleteExam, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['exams']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(['add'], addExam, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['exams'])
    },
  })

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
          isActive: data.isActive,
          name: data.name,
        })
      : addMutateAsync(data)
  }

  const editHandler = (exam) => {
    setId(exam._id)
    setEdit(true)
    setValue('isActive', exam.isActive)
    setValue('name', exam.name)
  }

  return (
    <div className='container'>
      <Head>
        <title>Exam</title>
        <meta property='og:title' content='Exam' key='title' />
      </Head>
      {isSuccessUpdate && (
        <Message variant='success'>Exam has been updated successfully.</Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>Exam has been Created successfully.</Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>Exam has been deleted successfully.</Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      <div
        className='modal fade'
        id='editExamModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editExamModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editExamModalLabel'>
                {edit ? 'Edit Exam' : 'Add Exam'}
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
                  {inputText({ register, errors, label: 'Name', name: 'name' })}

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
        <h3 className=''>Exams</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editExamModal'
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
                  <th>DATE & TIME</th>
                  <th>NAME</th>
                  <th>ACTIVE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((exam) => (
                    <tr key={exam._id}>
                      <td>{moment(exam.createdAt).format('llll')}</td>
                      <td>
                        {exam.name.charAt(0).toUpperCase() + exam.name.slice(1)}
                      </td>
                      <td>
                        {exam.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>

                      <td className='btn-exam'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(exam)}
                          data-bs-toggle='modal'
                          data-bs-target='#editExamModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(exam._id)}
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

export default dynamic(() => Promise.resolve(withAuth(Exam)), { ssr: false })
