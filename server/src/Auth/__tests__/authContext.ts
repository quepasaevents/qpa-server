import {createTestClient} from 'apollo-server-testing'
import {createServer} from "../../graphql"
import {Connection, createConnection} from "typeorm"
import {testConfig} from "../../../ormconfig"
import gql from "graphql-tag"
import {PostOffice, sendEmail} from "../../post_office"
import {User} from "../User.entity"
import {Session, SessionInvite} from "../Session.entity"

jest.setTimeout(10000)

let testClient
let connection: Connection = null

describe('Authentication', () => {
  beforeAll(async () => {
    connection = await createConnection({
      ...testConfig,
      logging: null
    })
  })

  afterAll(async () => {
    await connection.close()
  })

  it('API Identifies user from auth header', async () => {
    const testyUser = new User()
    testyUser.email = 'testy@user.com'
    testyUser.username = 'mrtesty'
    testyUser.name = 'test man'
    await testyUser.save()
    const server = await createServer({
      typeormConnection: connection,
      sendEmail: jest.fn(() => Promise.resolve(true)) as PostOffice,
      domain: 'example.com',
      customContext: {
        user: testyUser
      }
    })
    testClient = await createTestClient(server as any)


    const session = new Session()
    session.user = testyUser
    session.hash = 'testy-user-secret-hash-token'
    session.save()

    const meQuery = gql`
        query {
            me {
                username
            }
        }
    `

    const result = await testClient.query({
      query: meQuery,
      sdf: 1
    })

    expect(result.data.me.username).toEqual('mrtesty')
  })

})
