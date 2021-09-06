import dynamicAPI from './dynamicAPI'

const url = '/api/teacher'

export const getTeachers = async () => await dynamicAPI('get', url, {})

export const addTeacher = async (obj) => await dynamicAPI('post', url, obj)

export const updateTeacher = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj.formData)

export const deleteTeacher = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})

export const getAllTeachers = async () =>
  await dynamicAPI('get', `${url}/all-teachers`, {})
