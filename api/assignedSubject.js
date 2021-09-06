import dynamicAPI from './dynamicAPI'

const url = '/api/teacher/assign-subject'

export const getAssignedSubjects = async (id) =>
  await dynamicAPI('get', `${url}/${id}`, {})

export const addAssignedSubject = async (obj) =>
  await dynamicAPI('post', url, obj)

export const updateAssignedSubject = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteAssignedSubject = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
