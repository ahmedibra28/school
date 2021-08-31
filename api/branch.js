import dynamicAPI from './dynamicAPI'

const url = '/api/admin/branch'

export const getBranches = async () => await dynamicAPI('get', url, {})

export const addBranch = async (obj) => await dynamicAPI('post', url, obj)

export const updateBranch = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteBranch = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
