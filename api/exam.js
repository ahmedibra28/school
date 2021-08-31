import dynamicAPI from './dynamicAPI'

const url = '/api/exam'

export const getExams = async () => await dynamicAPI('get', url, {})

export const addExam = async (obj) => await dynamicAPI('post', url, obj)

export const updateExam = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteExam = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
