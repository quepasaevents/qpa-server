import { SessionInvite } from '../session'

it('test one', () => {
  const si = new SessionInvite({id: 'testId'})
  console.log('si', si.hash)
  expect(si.hash).toHaveLength(48)
})
