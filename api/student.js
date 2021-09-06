import dynamicAPI from './dynamicAPI'

const url = '/api/student'

export const getStudents = async () => await dynamicAPI('get', url, {})

export const addStudent = async (obj) => await dynamicAPI('post', url, obj)

export const updateStudent = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj.formData)

export const deleteStudent = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})

export const getAllStudents = async () =>
  await dynamicAPI('get', `${url}/all-students`, {})
