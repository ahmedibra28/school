import dynamicAPI from './dynamicAPI'

const url = '/api/attendance'

export const updateAttendance = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const getAttendances = async (obj) =>
  await dynamicAPI('post', `${url}/filter-classes`, obj)
