import {auth} from 'google-auth-library';
import { atob } from 'atob';
import Calendar from '../calendar'
import { gcal as gcalConfig } from '../config'
import Repository from "../repository";

let calendar
describe('cal access', () => {
  beforeEach(() => {
    calendar = new Calendar({
      repository: new Repository('testProject'),
      gcalConfig: gcalConfig,
    })
  })
  xit('atob test', () => {
    expect(atob('aGVsbG8=')).toEqual('hello')
  });

  xit('read events', async (done) => {
    const events = await calendar.listEvents()
    console.log('events', events)
    done()
  })

  xit('try to access', async (done) => {
    const cals = await calendar.listCalendars()
    console.log('cals', cals)
    done();
  })
})