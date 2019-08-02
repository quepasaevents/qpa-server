# Create user
curl -X POST "https://staging.quepasaalpujarra.com/api/signup" -H "Content-Type: application/json" -d @createUser.json

# Sign in
curl -L -v -s "https://staging.quepasaalpujarra.com/api/signin?hash=Os8gknR71loKKutYAZQnFN7XyIQGbiUzzAoOvxRaddRsMHLt&email=jakubowicz.amit@gmail.com" -H "Client-Agent: curl"

curl -X POST "https://staging.quepasaalpujarra.com/api/events" -H "Cookie: __session=OekzPAjhXamEw9lbR4vxdoPmhV4n74FxfJWTRHN1gX2nZzrv"
