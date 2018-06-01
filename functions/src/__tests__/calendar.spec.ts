import {auth} from 'google-auth-library';

describe('cal access', () => {
  it('try to access', async (done) => {


    /**
     iss  The email address of the service account.
     scope  A space-delimited list of the permissions that the application requests.
     aud  A descriptor of the intended target of the assertion. When making an access token request this value is always https://www.googleapis.com/oauth2/v4/token.
     exp  The expiration time of the assertion, specified as seconds since 00:00:00 UTC, January 1, 1970. This value has a maximum of 1 hour after the issued time.
     iat  The time the assertion was issued, specified as seconds since 00:00:00 UTC, January 1, 1970.
     */

    // const client: any = auth.fromJSON(keys);
    // client.scopes = ['https://www.googleapis.com/auth/calendar'];
    // await client.authorize();

    // const url = `https://www.googleapis.com/calendar/v3/users/me/calendarList`;
    // const res = await client.request({
    //   url,
    // });
    // console.log(JSON.stringify(res.data.items[0], null, '\t'));


    // const calendarId = 'tved0d7d5s4pk9qebub2pgpkks@group.calendar.google.com'
    //
    // const calendar = await client.request({
    //   method: 'get',
    //   url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    // })


    // console.log('calendar', calendar.data)

    // client.request({
    //   method: 'post',
    //   url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    // })



    done();

  })
})