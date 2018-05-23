import { google } from 'googleapis'
import fetch from 'isomorphic-fetch';

export default class Calendar {
  listEvents = async () => {
    const calList = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList')
    console.log('calList', JSON.stringify(calList))
    return calList
  }
}