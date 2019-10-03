# Communal events calendar
This is a weekend project of mine and you can use this code at your own risk as there is no guarantee that this code is secure or complying to any privacy rules.

## DB Extensions:

```
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Motivation
I often visit a region that I like very much. I like it because it's very rural and has a lot of beautiful nature.
There's also a lot going on, and tons of great people but there is nowhere to get information about all the events
going on. I would like to provide a place for people to promote their events and get informed about what's going on
in their communities. A place that respects the user's privacy and strengthen local communities.

## Features
Following is a list of existing and planned featured for an MVP. The non checked boxes indicate a to do item.

- [x] CI Pipeline for deployment on staging
- [ ] CI Pipeline for deployment on production

### Server-Side Features (non-check is to do)
- [x] passwordless authentication via email invitations and cookie sessions, with external dependencies only for persistence and email service
- [x] Basic integration with google calender REST API for saving just the time of an event
- [ ] Aggregation of event data with a gcal event (The idea is to only share the minimum necessary with gcal, and to take advantage of the scheduling features only of recurring events etc')

### Client-Side Features
- [ ] Set up a project structure for a web client
- [ ] List events
- [ ] Filter events by tags
- [ ] Sign up feature
- [ ] Sign in feature
- [ ] Nicer email templates for the authentication features
- [ ] Add event feature available for users with an active session