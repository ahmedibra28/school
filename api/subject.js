import dynamicAPI from './dynamicAPI'

const url = '/api/admin/subject'

export const getSubjects = async () => await dynamicAPI('get', url, {})

export const addSubject = async (obj) => await dynamicAPI('post', url, obj)

export const updateSubject = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteSubject = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
