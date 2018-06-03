import * as Joi from 'joi'
import * as cookie from 'cookie'

describe('joi api', () => {
  it('test the api', () => {
    const schema = Joi.object().keys({
      username: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
      access_token: [Joi.string(), Joi.number()],
      birthyear: Joi.number().integer().min(1900).max(2013),
      email: Joi.string().email()
    }).with('username', 'birthyear').without('password', 'access_token');


    const result = Joi.validate({username: 'abc', birthyear: 1994}, schema);
    expect(result.error).toBeNull()

// You can also pass a callback which will be called synchronously with the validation result.
    Joi.validate({username: 'abc', birthyear: 1994}, schema, function (err, value) {
    });  // err === null -> valid
  })

  it('cookie', () => {
    expect(cookie.parse('foo=bar; equation=E%3Dmc%5E2').foo).toBe('bar')
  })
})