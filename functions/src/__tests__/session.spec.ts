import { SessionInvite } from '../session'

it('test one', () => {
  const si = new SessionInvite({id: 'testId'})
  expect(si.oneTimeKey).toHaveLength(24)
})
