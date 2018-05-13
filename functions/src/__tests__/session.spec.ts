import { SessionInvite } from '../session'

it('test one', () => {
  const si = new SessionInvite({id: 'testId'})
  expect(si.hash).toHaveLength(48)
})
