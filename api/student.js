import dynamicAPI from './dynamicAPI'

const url = '/api/admin/students'

export const getStudents = async () => await dynamicAPI('get', url, {})

export const addStudent = async (obj) => await dynamicAPI('post', url, obj)

export const updateStudent = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteStudent = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
