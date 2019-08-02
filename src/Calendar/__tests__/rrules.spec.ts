import RRule, { rrulestr } from 'rrule'

describe('rrule recurrence cases', () => {

  it('Once a week', () => {
    // from 2019-03-04 to 2019-03-25 every monday
    //      March 2019
    // Su Mo Tu We Th Fr Sa
    //                1  2
    // 3  4  5  6  7  8  9
    // 10 11 12 13 14 15 16
    // 17 18 19 20 21 22 23
    // 24 25 26 27 28 29 30
    // 31
    const rruleSet = rrulestr('DTSTART:20190304T140000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO;INTERVAL=1;UNTIL=20190325T230000Z')
    const occurrences = rruleSet.all()
    expect(occurrences[0].toISOString()).toEqual('2019-03-04T14:00:00.000Z')
    expect(occurrences[1].toISOString()).toEqual('2019-03-11T14:00:00.000Z')
    expect(occurrences[2].toISOString()).toEqual('2019-03-18T14:00:00.000Z')
    expect(occurrences[3].toISOString()).toEqual('2019-03-25T14:00:00.000Z')
    expect(occurrences).toHaveLength(4)
  })

  it('Once', () => {
    const rrule = new RRule({
      dtstart: new Date('2019-03-04T14:00:00.000Z'),
      count: 1
    })
    expect(rrule.toString()).toEqual('DTSTART:20190304T140000Z\nRRULE:COUNT=1')

    const rruleSet = rrulestr(rrule.toString())
    const occurrences = rruleSet.all()
    expect(occurrences).toHaveLength(1)
    expect(occurrences[0].toISOString()).toEqual('2019-03-04T14:00:00.000Z')
  })

  it('with offset', () => {
    const rruleSet = rrulestr('DTSTART;TZID=America/New_York:20190304T020000\nRRULE:FREQ=WEEKLY;BYDAY=MO;INTERVAL=1;UNTIL=20210325T230000Z')
    const occurrences = rruleSet.all()
    expect(occurrences[0].toISOString()).toEqual('2019-03-04T14:00:00.000Z')
    expect(occurrences[1].toISOString()).toEqual('2019-03-11T14:00:00.000Z')
    expect(occurrences[2].toISOString()).toEqual('2019-03-18T14:00:00.000Z')
    expect(occurrences[3].toISOString()).toEqual('2019-03-25T14:00:00.000Z')
    expect(occurrences).toHaveLength(4)
  })

})
