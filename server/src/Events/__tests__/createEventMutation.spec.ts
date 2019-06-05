import gql from 'graphql-tag'
import eventResolvers from '../eventsResolvers'
import {testConfig} from "../../../ormconfig"
import {User} from "../../Auth/User.entity"
import { createConnection } from "typeorm"

const mutation = gql`
    mutation {
        createEvent(input: {
            time: {
                timeZone: "Europe/Madrid",
                start: "2019-05-04 10:00",
                end: "2019-05-04 12:00",
                recurrence: "DTSTART:20190504T100000Z\\nRRULE:FREQ=WEEKLY;INTERVAL=1"
            },
            info: [{
                language: "en",
                title: "Yoga on Cerro Negro",
                description: "Neighbors yoga on the dance floor",
            }, {
                language: "es",
                title: "Yoga en el Cerro Negro",
                description: "Yoga de los vecinos",
            }],
            location: {
                address: "Camino de Cerro Negro",
                name: "The dance floor",
            },
            status: "Confirmed",
            contact: {
                name: "Miti",
                languages: ["hi"],
                contact: {
                    email: "a@b.com",
                    phone: "655700372"
                }
            }
        }) {
            id
        }
    }`
let owner: User = null
let connection

describe('Create event mutation', () => {
    beforeAll(async () => {
        connection = await createConnection({
            ...testConfig
        })
        owner = new User()
        owner.username = "onetimeguy"
        owner.email = "one@time.com"
        owner.name = "One Time"
        await owner.save()
        return connection
    })
    afterAll(async () => {
        await connection.close()
    })

    it('create event and fetch occurrences',() => {

    })
  }
)
