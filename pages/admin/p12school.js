import React, { useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import withAuth from '../../HOC/withAuth'
import Message from '../../components/Message'
import Loader from 'react-loader-spinner'
import moment from 'moment'
import {
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'

import {
  getP12Schools,
  updateP12School,
  deleteP12School,
  addP12School,
} from '../../api/p12School'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../components/Confirm'
import { useForm } from 'react-hook-form'
import { getBranches } from '../../api/branch'
import {
  dynamicInputSelect,
  inputCheckBox,
  inputText,
} from '../../utils/dynamicForm'

const P12School = () => {
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

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'p12Schools',
    () => getP12Schools(),
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
  } = useMutation(updateP12School, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['p12Schools'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(deleteP12School, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['p12Schools']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(addP12School, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['p12Schools'])
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
          branch: data.branch,
          isActive: data.isActive,
        })
      : addMutateAsync(data)
  }

  const editHandler = (p12School) => {
    setId(p12School._id)
    setEdit(true)
    setValue('name', p12School.name)
    setValue('branch', p12School.branch._id)
    setValue('isActive', p12School.isActive)
  }

  return (
    <div className='container'>
      <Head>
        <title>P12 School</title>
        <meta property='og:title' content='P12 School' key='title' />
      </Head>
      {isSuccessUpdate && (
        <Message variant='success'>
          P12 School has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          P12 School has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>
          P12 School has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      <div
        className='modal fade'
        id='editP12SchoolModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editP12SchoolModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editP12SchoolModalLabel'>
                {edit ? 'Edit P12School' : 'Add P12School'}
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
                    errors,
                    name: 'branch',
                    label: 'Branch',
                    data: branchData && branchData,
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
        <h3 className=''>P12 Schools</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editP12SchoolModal'
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
                  <th>BRANCH</th>
                  <th>P12 SCHOOL</th>
                  <th>ACTIVE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((p12School) => (
                    <tr key={p12School._id}>
                      <td>{moment(p12School.createdAt).format('llll')}</td>
                      <td>
                        {p12School.name.charAt(0).toUpperCase() +
                          p12School.name.slice(1)}
                      </td>
                      <td>
                        {p12School.branch.name.charAt(0).toUpperCase() +
                          p12School.branch.name.slice(1)}
                      </td>
                      <td>
                        {p12School.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>

                      <td className='btn-p12School'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(p12School)}
                          data-bs-toggle='modal'
                          data-bs-target='#editP12SchoolModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(p12School._id)}
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

export default dynamic(() => Promise.resolve(withAuth(P12School)), {
  ssr: false,
})
