import removeTypename from '../remove-typename'

describe('Remove Typename Util', () => {
  it('remove nested typename', () => {
    const input = {
      "input": {
        "id": "4b18628f-6069-4d6f-9708-f85862b2c3e6",
        "meta": {"tags": []},
        "time": {
          "start": "2019-06-12T10:00",
          "end": "2019-06-12T12:00",
          "timeZone": "Europe/Madrid",
          "recurrence": null
        },
        "location": {"address": "housy str...", "name": "my house", "__typename": "Location"},
        "info": [{
          "description": "Party in my house (:",
          "language": "en",
          "title": "My Event",
          "__typename": "EventInformation"
        }],
        "status": "confirmed"
      }
    }

    const expected = {
      "input": {
        "id": "4b18628f-6069-4d6f-9708-f85862b2c3e6",
        "meta": {"tags": []},
        "time": {
          "start": "2019-06-12T10:00",
          "end": "2019-06-12T12:00",
          "timeZone": "Europe/Madrid",
          "recurrence": null
        },
        "location": {"address": "housy str...", "name": "my house"},
        "info": [{
          "description": "Party in my house (:",
          "language": "en",
          "title": "My Event",
        }],
        "status": "confirmed"
      }
    }

    expect(removeTypename(input)).toEqual(expected)

  })
})
