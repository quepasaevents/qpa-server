import { clone } from 'ramda'

const omitTypename = (key, value) => {
  return key === '__typename' ? undefined : value
}

const removeTypename = (object: any) => {
  return JSON.parse(JSON.stringify(object), omitTypename)
}

export default removeTypename
