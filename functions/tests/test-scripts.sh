# Create user
curl -X POST https://us-central1-calendar-189316.cloudfunctions.net/signup -H "Content-Type: application/json" -d @createUser.json

# Sign in
curl "https://us-central1-calendar-189316.cloudfunctions.net/signin?hash=TULAlsd4yRIO3TbNiHXgOCOE3YYmJAUDo6yPSzUL2qRulf5h&email=jakubowicz.amit@gmail.com" -H "Client-Agent: curl"