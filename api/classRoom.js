import dynamicAPI from './dynamicAPI'

const url = '/api/admin/classroom'

export const getClassRooms = async () => await dynamicAPI('get', url, {})

export const addClassRoom = async (obj) => await dynamicAPI('post', url, obj)

export const updateClassRoom = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteClassRoom = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
