# Create user
curl -X POST https://us-central1-calendar-189316.cloudfunctions.net/signup -H "Content-Type: application/json" -d @createUser.json

# Sign in
curl "https://us-central1-calendar-189316.cloudfunctions.net/signin&hash=BLoPvsyah9ldhEPX0dkIzJrQzN8fyhnOMGdZ4HZaw553gAVn&email=jakubowicz.amit@gmail.com" -H "Client-Agent: curl"