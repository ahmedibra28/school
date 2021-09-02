import dynamicAPI from './dynamicAPI'

const url = '/api/admin/ptwelveschool'

export const getPTwelveSchools = async () => await dynamicAPI('get', url, {})

export const addPTwelveSchool = async (obj) =>
  await dynamicAPI('post', url, obj)

export const updatePTwelveSchool = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deletePTwelveSchool = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
