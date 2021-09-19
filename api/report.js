import dynamicAPI from './dynamicAPI'

const url = '/api/report'

export const getAttendances = async (obj) =>
  await dynamicAPI('post', `${url}/attendance`, obj)
