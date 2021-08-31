import dynamicAPI from './dynamicAPI'

const url = '/api/admin/p12school'

export const getP12Schools = async () => await dynamicAPI('get', url, {})

export const addP12School = async (obj) => await dynamicAPI('post', url, obj)

export const updateP12School = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteP12School = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
