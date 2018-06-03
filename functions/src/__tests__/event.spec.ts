import {EventSchema} from "../event";
import * as Joi from 'joi'

describe('event', () => {
  it('validation', () => {
    const result = Joi.validate({
      owner: 234298,
      gcalEntry: 2342,
      location: 'Around the corner',
      timing: {notClearYet: 'to be defined'}
    }, EventSchema, {abortEarly: false})

    expect(result.error).toBeNull()
  })
})