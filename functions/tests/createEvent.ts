import {Event} from '@types/gapi.client.calendar';
import {CalendarEventRequest, EventTime} from "../src/types";

const event: CalendarEventRequest = {
  "contactPhone": "+34655700372",
  "contactEmail": "jakubowicz.amit@gmail.com",
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
      "date": "" // in format  "yyyy-mm-dd" for all-day event
      "dateTime": "" // in RFC3339 e.g. 2002-10-02T10:00:00-05:00 or 2002-10-02T15:00:00Z
      "timeZone": "Europe/Madrid"
    },
    "start": Event.EventDateTime,
    "originalStartTime": EventTime,
    "recurrence": string[],
    "status": "confirmed",
    "calendarEventId": string,
  }
}

export default event