import * as cookie from 'cookie'

describe('dependencies api', () => {
  it('cookie', () => {
    expect(cookie.parse('foo=bar; equation=E%3Dmc%5E2').foo).toBe('bar')
  })
})