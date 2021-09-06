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
  getAssignedSubjects,
  updateAssignedSubject,
  deleteAssignedSubject,
  addAssignedSubject,
} from '../../api/assignedSubject'
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
import { useRouter } from 'next/router'
import { getClassRooms } from '../../api/classRoom'

const AssignedSubject = () => {
  const router = useRouter()
  const { id: teacherId } = router.query
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
    'assignedSubjects',
    () => getAssignedSubjects(teacherId && teacherId),
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
    'class rooms',
    () => getClassRooms(),
    {
      retry: 0,
    }
  )

  const subjectData =
    classRoomData && classRoomData.filter((cl) => cl._id === watch().classRoom)

  const { data: branchData } = useQuery('branches', () => getBranches(), {
    retry: 0,
  })

  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    isSuccess: isSuccessUpdate,
    mutateAsync: updateMutateAsync,
  } = useMutation(updateAssignedSubject, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['assignedSubjects'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteAssignedSubject, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['assignedSubjects']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addAssignedSubject, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['assignedSubjects'])
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
          pTwelveSchool: data.pTwelveSchool,
          branch: data.branch,
          classRoom: data.classRoom,
          subject: data.subject,
          isActive: data.isActive,
          teacher: teacherId,
        })
      : addMutateAsync({
          pTwelveSchool: data.pTwelveSchool,
          branch: data.branch,
          classRoom: data.classRoom,
          subject: data.subject,
          isActive: data.isActive,
          teacher: teacherId,
        })
  }

  const editHandler = (assignedSubject) => {
    setId(assignedSubject._id)
    setEdit(true)
    setValue('branch', assignedSubject.branch._id)
    setValue(
      'subject',
      assignedSubject.subject && assignedSubject.subject.map((id) => id._id)
    )
    setValue('pTwelveSchool', assignedSubject.pTwelveSchool._id)
    setValue('branch', assignedSubject.branch._id)
    setValue('classRoom', assignedSubject.classRoom._id)
    setValue('isActive', assignedSubject.isActive)
  }

  return (
    <div className='container'>
      <Head>
        <title>Assigned Subject</title>
        <meta property='og:title' content='Assigned Subject' key='title' />
      </Head>
      {isSuccessUpdate && (
        <Message variant='success'>
          Assigned Subject has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          Assigned Subject has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>
          Assigned Subject has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      <div
        className='modal fade'
        id='editAssignedSubjectModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editAssignedSubjectModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editAssignedSubjectModalLabel'>
                {edit ? 'Edit Assigned Subject' : 'Add Assigned Subject'}
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
                    <div className='col-12'>
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
                    <div className='col-md-6 col-12'>
                      {watch().pTwelveSchool &&
                        dynamicInputSelect({
                          register,
                          label: 'Class Room',
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
                    <div className='col-12'>
                      {watch().classRoom &&
                        inputMultipleCheckBox({
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
        <h3 className=''>Assigned Subjects</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editAssignedSubjectModal'
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
                  <th>TEACHER </th>
                  <th>BRANCH</th>
                  <th>P12 SCHOOL</th>
                  <th>CLASS ROOM</th>
                  <th>SUBJECT</th>
                  <th>ACTIVE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((assignedSubject) => (
                    <tr key={assignedSubject._id}>
                      <td>{assignedSubject.teacher.name}</td>
                      <td>{assignedSubject.branch.name}</td>
                      <td>{assignedSubject.pTwelveSchool.name}</td>
                      <td>{assignedSubject.classRoom.name}</td>
                      <td>
                        {assignedSubject.subject &&
                          assignedSubject.subject.map((s) => (
                            <span key={s._id} className='badge bg-primary me-1'>
                              {s.name}
                            </span>
                          ))}
                      </td>

                      <td>
                        {assignedSubject.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>

                      <td className='btn-assignedSubject'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(assignedSubject)}
                          data-bs-toggle='modal'
                          data-bs-target='#editAssignedSubjectModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(assignedSubject._id)}
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

// export default dynamic(() => Promise.resolve(withAuth(AssignedSubject)), {
//   ssr: false,
// })

export default AssignedSubject
