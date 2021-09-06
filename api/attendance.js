import dynamicAPI from './dynamicAPI'

const url = '/api/attendance'

export const getAttendances = async () => await dynamicAPI('get', url, {})

export const addAttendance = async (obj) => await dynamicAPI('post', url, obj)

export const updateAttendance = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteAttendance = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})

export const getFilteredClasses = async (obj) =>
  await dynamicAPI('post', `${url}/filter-classes`, obj)
