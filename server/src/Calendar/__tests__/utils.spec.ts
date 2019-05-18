import { breakTime } from "../Event.entity"

describe('Event Utilities', () => {
  it('break time', () => {
    const isoString = new Date("2009-05-03T14:00:00Z").toISOString()
    const date = breakTime(isoString)
    expect(date).toEqual("2009-05-03")
  })
})
