const event = {
  "contactPhone": "+34655700372",
  "contactEmail": "rastro@example.copm",
  "locationAddress": "By the river",
  "location": "Rio Chico",
  "locationCoordinate": [
    36.898863,
    -3.426283
  ],
  "title": "Rastro",
  "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt nisl nec libero consectetur mattis. Quisque dapibus purus diam, at lacinia justo volutpat." ,
  "tags": ["market"],
  "timing": {
    "end": {
      "dateTime": "2018-06-03T14:30:00", // in RFC3339 e.g. 2002-10-02T10:00:00-05:00 or 2002-10-02T15:00:00Z
      "timeZone": "Europe/Madrid"
    },
    "start": {
      "dateTime": "2018-06-03T09:00:00", // in RFC3339 e.g. 2002-10-02T10:00:00-05:00 or 2002-10-02T15:00:00Z
      "timeZone": "Europe/Madrid"
    },
    "recurrence": [
      "RRULE:FREQ=MONTHLY;BYSETPOS=1;BYDAY=SU;INTERVAL=1",
      // "RRULE:FREQ=MONTHLY;BYSETPOS=3;BYDAY=SU;INTERVAL=1",
    ],
  }
}

export default event
