# Create user
curl -X POST "https://staging.quepasaalpujarra.com/api/signup" -H "Content-Type: application/json" -d @createUser.json

# Sign in
curl "https://staging.quepasaalpujarra.com/api/signin?hash=TULAlsd4yRIO3TbNiHXgOCOE3YYmJAUDo6yPSzUL2qRulf5h&email=jakubowicz.amit@gmail.com" -H "Client-Agent: curl"