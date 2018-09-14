import {UserEventSchema} from "../event";

describe('event', () => {
  it('basic validation', () => {
    const yesError = UserEventSchema.validate({
      timeZone: 'what'
    }).error
    expect(yesError).toBeDefined()
  })
})
