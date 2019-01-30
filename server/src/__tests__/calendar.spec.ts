import {auth} from 'google-auth-library';
import { atob } from 'atob';
import Calendar from '../calendar'
import { gcal as gcalConfig } from '../config'
import Repository from "../repository";
import testEvent from "./testEvent";

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

  it('read events', async (done) => {
    const events = await calendar.listEvents()
    console.log('events', events)
    done()
  })

  xit('try to access', async (done) => {
    const cals = await calendar.listCalendars()
    console.log('cals', cals)
    done();
  })

  xit('create no recurrence event', async (done) => {
    const oneTimeEvent = {
      ...testEvent,
      timing: {
        ...testEvent.timing
      }
    }
    delete oneTimeEvent.timing.recurrence;

    const result = await calendar.createEvent({
      ...testEvent,
      id: 1234,
    })
    console.log('result', result)
    done();
  })

  xit('create recurrence event', async (done) => {
    const result = await calendar.createEvent({
      ...testEvent,
      id: 1234,
    })
    console.log('result', result)
    done();
  })
})
