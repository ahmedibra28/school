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
  getBranches,
  addBranch,
  deleteBranch,
  updateBranch,
} from '../../api/branch'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../../components/Confirm'
import { useForm } from 'react-hook-form'
import { inputCheckBox, inputText } from '../../utils/dynamicForm'
import moment from 'moment'

const Branch = () => {
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
    'branches',
    () => getBranches(),
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
  } = useMutation(['update'], updateBranch, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['branches'])
    },
  })

  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
    mutateAsync: deleteMutateAsync,
  } = useMutation(['delete'], deleteBranch, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['branches']),
  })

  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    error: errorAdd,
    isSuccess: isSuccessAdd,
    mutateAsync: addMutateAsync,
  } = useMutation(['add'], addBranch, {
    retry: 0,
    onSuccess: () => {
      reset()
      setEdit(false)
      queryClient.invalidateQueries(['branches'])
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

  const editHandler = (branch) => {
    setId(branch._id)
    setEdit(true)
    setValue('isActive', branch.isActive)
    setValue('name', branch.name)
  }

  return (
    <div className='container'>
      <Head>
        <title>Branch</title>
        <meta property='og:title' content='Branch' key='title' />
      </Head>
      {isSuccessUpdate && (
        <Message variant='success'>
          Branch has been updated successfully.
        </Message>
      )}
      {isErrorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {isSuccessAdd && (
        <Message variant='success'>
          Branch has been Created successfully.
        </Message>
      )}
      {isErrorAdd && <Message variant='danger'>{errorAdd}</Message>}
      {isSuccessDelete && (
        <Message variant='success'>
          Branch has been deleted successfully.
        </Message>
      )}
      {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}
      <div
        className='modal fade'
        id='editBranchModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editBranchModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editBranchModalLabel'>
                {edit ? 'Edit Branch' : 'Add Branch'}
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
        <h3 className=''>Branches</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editBranchModal'
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
                  data.map((branch) => (
                    <tr key={branch._id}>
                      <td>{moment(branch.createdAt).format('llll')}</td>
                      <td>
                        {branch.name.charAt(0).toUpperCase() +
                          branch.name.slice(1)}
                      </td>
                      <td>
                        {branch.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>

                      <td className='btn-branch'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(branch)}
                          data-bs-toggle='modal'
                          data-bs-target='#editBranchModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(branch._id)}
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

export default dynamic(() => Promise.resolve(withAuth(Branch)), { ssr: false })
