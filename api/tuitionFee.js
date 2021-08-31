import dynamicAPI from './dynamicAPI'

const url = '/api/admin/tuitionfee'

export const getTuitionFees = async () => await dynamicAPI('get', url, {})

export const addTuitionFee = async (obj) => await dynamicAPI('post', url, obj)

export const updateTuitionFee = async (obj) =>
  await dynamicAPI('put', `${url}/${obj._id}`, obj)

export const deleteTuitionFee = async (id) =>
  await dynamicAPI('delete', `${url}/${id}`, {})
