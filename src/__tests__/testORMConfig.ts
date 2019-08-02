import config from '../ormconfig'
import {ConnectionOptions} from "typeorm"

export const testConfig: ConnectionOptions = {
  ...config,
  database: 'qpa-test',
  dropSchema: true
}

export default testConfig
