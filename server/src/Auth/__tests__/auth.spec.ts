import { createTestClient } from 'apollo-server-testing'
import {createServer } from "../../graphql"
import {Connection, createConnection} from "typeorm"
import {testConfig} from "../../../ormconfig"
import gql from "graphql-tag"
import {PostOffice, sendEmail} from "../../post_office"
import {User} from "../User.entity"

jest.setTimeout(10000)

let testClient = null
let sendEmailMock
let connection: Connection = null

describe('Sign up', () => {
  beforeAll(async (t) => {
    connection = await createConnection(testConfig)
    t()
  })

  beforeEach(async (t) => {
    sendEmailMock = jest.fn(() => Promise.resolve(true))

    const server = await createServer({
      typeormConnection: connection,
      sendEmail: sendEmailMock as PostOffice
    })
    testClient = await createTestClient(server as any)
    t()
  })


  it('Sign up of new user', async (t) => {
    const { mutate } = testClient
    const res = await mutate({
      query: gql`
          mutation {
              signup(input: {
                  email: "test@username.com",
                  name: "Test Name",
                  username: "testuser"
              })
          }
      `
    })
    expect(res.data.signup).toBeTruthy()
    expect(sendEmailMock.mock.calls).toHaveLength(1)
    const dbUser = await User.findOne({name: "Test Name"})
    expect(dbUser.email).toEqual("test@username.com")
    t()
  })

  it('Sign up with already existing email should fail', async () => {
    const { mutate } = testClient
    const existingUser = new User()
    existingUser.email = "existing@email.com"
    existingUser.name = "Existing User"
    existingUser.username = "existinguser2091"
    await existingUser.save()

    const res = await mutate({
      query: gql`
          mutation {
              signup(input: {
                  email: "existing@email.com",
                  name: "Different Name",
                  username: "differentusername"
              })
          }
      `
    })
    expect(res.data.signup).toBeFalsy()
  })
})
