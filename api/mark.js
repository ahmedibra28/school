import dynamicAPI from './dynamicAPI'

const url = '/api/mark'

export const getMarks = async () => await dynamicAPI('get', url, {})

export const addMark = async (obj) => await dynamicAPI('post', url, obj)

export const updateMark = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteMark = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
