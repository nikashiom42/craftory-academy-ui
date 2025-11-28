# Authentication Method

Source: https://api.bog.ge/docs/en/payments/authentication

- Authentication Method
Authentication Method
What do I need to use the payment API?​
To use the payment API, HTTP Basic Auth is required. You will need to know the unique credentials4 of your business to enter the system. These credentials consist of two parameters, client_id, and client_secret, used as the username and password for business authentication.
client_id
client_secret
How to obtain the credentials for entering the business system?​
Upon registering a company as a business in the banking system and providing all the necessary data, the system provides the credentials client_id and client_secret necessary to enter the system. These credentials are unique identifiers of the business. It is impermissible to disclose or transfer the client_secret parameter to another person. Doing so significantly increases the probability of a security breach. The business cannot change the client_secret parameter.
client_id
client_secret
client_secret
client_secret
Method description​
This method allows businesses to undergo the authentication process. Upon calling the API, the online payment server returns the Bearer Token, which is the necessary authentication parameter for calling all further methods.
Bearer Token
Header parameters​
application/x-www-form-urlencoded
Basic <base64>
'Basic ' + '<client_id>:<secret_key>' encoded in the Base64 format is transmitted as a value (e.g., 'Basic ODI4Mjo3Njk3MDY0OTlmMDcwOWUyMzQ4NDU4NjNmOThiMjMxNA=='), where <client_id> and <secret_key> are the credentials necessary to enter the system, transmitted by the bank to the business.
Body parameters​
client_credentials
The fixed text client_credentials is transmitted as the value.
client_credentials
- CURL
curl -X POST 'https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token' \-u {client_id}:{client_secret} \-H 'Content-Type: application/x-www-form-urlencoded' \--data-urlencode 'grant_type=client_credentials'
curl -X POST 'https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token' \-u {client_id}:{client_secret} \-H 'Content-Type: application/x-www-form-urlencoded' \--data-urlencode 'grant_type=client_credentials'
Response​
string
The Token is returned by the authorization server.
string
The type of Token (fixed value – Bearer – is returned).
Bearer
number
The number of seconds while the Token is active.
- RESPONSE
{ "access_token": "<JWT>", "token_type": "Bearer", "expires_in": 1634719923245}
{ "access_token": "<JWT>", "token_type": "Bearer", "expires_in": 1634719923245}