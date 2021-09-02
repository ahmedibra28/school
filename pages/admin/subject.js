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
  getSubjects,
  updateSubject,
  deleteSubject,
  addSubject,
} from '../../api/subject'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../components/Confirm'
import { useForm } from 'react-hook-form'
import { getPTwelveSchools } from '../../api/pTwelveSchool'
import { getExams } from '../../api/exam'
import {
  dynamicInputSelect,
  inputCheckBox,
  inputMultipleCheckBox,
  inputText,
} from '../../utils/dynamicForm'
import { getBranches } from '../../api/branch'

const Subject = () => {
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
    'subjects',
    () => getSubjects(),
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

  const { data: examData } = useQuery('exams', () => getExams(), {
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
  } = useMutation(updateSubject, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['subjects'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteSubject, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['subjects']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addSubject, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['subjects'])
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
          isActive: data.isActive,
        })
      : addMutateAsync(data)
  }

  const editHandler = (subject) => {
    setId(subject._id)
    setEdit(true)
    setValue('name', subject.name)
    setValue('branch', subject.branch._id)
    setValue('exam', subject.exam && subject.exam.map((id) => id._id))
    setValue('pTwelveSchool', subject.pTwelveSchool._id)
    setValue('isActive', subject.isActive)
  }

  return (
    <div className='container'>
      <Head>
        <title>Subject</title>
        <meta property='og:title' content='Subject' key='title' />
      </Head>
      {isSuccessUpdate && (
        <Message variant='success'>
          Subject has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          Subject has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>
          Subject has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      <div
        className='modal fade'
        id='editSubjectModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editSubjectModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editSubjectModalLabel'>
                {edit ? 'Edit Subject' : 'Add Subject'}
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

                  {inputMultipleCheckBox({
                    register,
                    label: 'Exam',
                    errors,
                    name: 'exam',
                    data: examData && examData,
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
        <h3 className=''>Subjects</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editSubjectModal'
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
                  <th>SUBJECT</th>
                  <th>P Twelve School</th>
                  <th>EXAMS</th>
                  <th>ACTIVE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((subject) => (
                    <tr key={subject._id}>
                      <td>
                        {subject.name.charAt(0).toUpperCase() +
                          subject.name.slice(1)}
                      </td>
                      <td>
                        {subject.pTwelveSchool.name.charAt(0).toUpperCase() +
                          subject.pTwelveSchool.name.slice(1)}
                      </td>
                      <td>
                        {subject.exam &&
                          subject.exam.map((e) => (
                            <span key={e._id} className='badge bg-primary me-1'>
                              {e.name}
                            </span>
                          ))}
                      </td>
                      <td>
                        {subject.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>

                      <td className='btn-subject'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(subject)}
                          data-bs-toggle='modal'
                          data-bs-target='#editSubjectModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(subject._id)}
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

export default dynamic(() => Promise.resolve(withAuth(Subject)), { ssr: false })
