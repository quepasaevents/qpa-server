import {CalendarEventRequest, EventTime} from "../src/types";
import fetch from 'node-fetch';

const event: CalendarEventRequest = {
  "contactPhone": "+34655700372",
  "contactEmail": "rastro@example.copm",
  "locationAddress": "By the river",
  "location": "Rio Chico",
  "locationCoordinate": [
    36.898863,
    -3.426283
  ],
  "title": "Rastro",
  "description": "Second hand market, carboot sale.",
  "tags": ["market"],
  "timing": {
    "end": {
      "dateTime": "2018-06-03T15:00", // in RFC3339 e.g. 2002-10-02T10:00:00-05:00 or 2002-10-02T15:00:00Z
      "timeZone": "Europe/Madrid"
    },
    "start": {
      "dateTime": "2018-06-03T09:00", // in RFC3339 e.g. 2002-10-02T10:00:00-05:00 or 2002-10-02T15:00:00Z
      "timeZone": "Europe/Madrid"
    },
    "recurrence": [
      "FREQ=MONTHLY;BYSETPOS=1;BYDAY=SU;INTERVAL=1",
      "FREQ=MONTHLY;BYSETPOS=3;BYDAY=SU;INTERVAL=1"
    ],
  }
}

fetch("https://staging.quepasaalpujarra.com/api/events", {
  method: "POST",
  headers: {
    cookie: '__session=OekzPAjhXamEw9lbR4vxdoPmhV4n74FxfJWTRHN1gX2nZzrv',
    'Content-Type': 'application/json',
  },
  // data: JSON.stringify(event),
}).then(response => {
  console.log('response', response)
  console.log('response.body', response.body)
}).catch(e => {
  console.error('Error', e)
})
