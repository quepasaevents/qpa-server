import { createTestClient } from 'apollo-server-testing'
import {createServer } from "../../graphql"
import {Connection, createConnection} from "typeorm"
import {testConfig} from "../../../ormconfig"
import gql from "graphql-tag"
import {PostOffice, sendEmail} from "../../post_office"
import {User} from "../User.entity"
import {SessionInvite} from "../Session.entity"

jest.setTimeout(10000)

let testClient
let sendEmailMock
let connection: Connection = null

describe('Authentication', () => {
  beforeAll(async () => {
    connection = await createConnection({
      ...testConfig,
      logging: null
    })
  })

  beforeEach(async () => {
    sendEmailMock = jest.fn(() => Promise.resolve(true))

    const server = await createServer({
      typeormConnection: connection,
      sendEmail: sendEmailMock as PostOffice,
      domain: 'example.com'
    })
    testClient = await createTestClient(server as any)
  })

  afterAll(async () => {
    await connection.close()
  })

  it('Sign up of new user', async () => {
    const { mutate } = testClient
    const res = await mutate({
      query: gql`
          mutation {
              signup(input: {
                  email: "test@username.com",
                  name: "Test Name",
                  username: "testuser"
              }) {
                  path
                  message
              }
          } 
      `
    })
    expect(res.data.signup).toBeNull()
    expect(sendEmailMock.mock.calls).toHaveLength(1)
    const dbUser = await User.findOne({name: "Test Name"})
    expect(dbUser.email).toEqual("test@username.com")
  })

  it('Sign up with already existing email should fail', async (done) => {
    const existingUser = new User()
    existingUser.email = "existing@email.com"
    existingUser.name = "Existing User"
    existingUser.username = "existinguser2091"
    await existingUser.save()

    const res = await testClient.mutate({
      query: gql`
          mutation {
              signup(input: {
                  email: "existing@email.com",
                  name: "Different Name",
                  username: "differentusername"
              }) {
                  path
                  message
              }
          }
      `
    })
    const errors = res.data.signup
    expect(errors.length).toBeGreaterThan(0)
    const emailError = errors.find(err => err.path === 'email')
    expect(emailError).toBeDefined()
    done()
  })

  it('Sign in', async (done) => {
    const user = new User()
    user.name = 'Signin Testuser'
    user.username = 'signintestuser'
    user.email = 'sign@in.com'
    await user.save()

    expect(user.id).toBeDefined()

    const invite = new SessionInvite()
    invite.hash = 'testhash'
    invite.user = user

    await invite.save()
    expect(invite.user.username).toEqual('signintestuser')

    const fetchedInvite = await SessionInvite.findOne({hash: 'testhash'}, {
      relations: ['user']
    })
    expect(fetchedInvite.user.username).toEqual('signintestuser')

    const res = await testClient.mutate({
      query: gql`
        mutation {
            signin(input: {
                hash: "testhash",
            }) {
                hash
                user {
                    id
                    username
                }
                isValid
            }
        }
      `
    })
    expect(res.data.signin.user.username).toBe('signintestuser')
    expect(res.data.signin.hash).toBeDefined()
    expect(res.data.signin.isValid).toBeTruthy()
    done()
  })

})
