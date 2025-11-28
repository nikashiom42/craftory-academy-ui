# Delete Saved Card

Source: https://api.bog.ge/docs/en/payments/saved-card/delete

- Save Card
- Delete Saved Card
Delete Saved Card
This method allows businesses to delete previously saved card information from the system.
Header parameters​
Basic <base64>
Bearer <jwt_token>, where jwt_token is the token returned in the access_token parameter of the authentication method response.
Bearer <jwt_token>
jwt_token
access_token
UUID v4
The Idempotency-Key parameter should be unique for each new API request. Subsequent requests to the same API endpoint with the same Idempotency-Key header will result in the server returning the same status code and response body as the initial request. This functionality is particularly useful to ensure consistent outcome in scenarios where network issues or retries may lead to duplicate requests.
Path parameters​
string
Response​
202 ACCEPTED
The request has been accepted.
- CURL
curl -X DELETE 'https://api.bog.ge/payments/v1/charges/card/:order_id' \-H 'Authorization: Bearer <token>'
curl -X DELETE 'https://api.bog.ge/payments/v1/charges/card/:order_id' \-H 'Authorization: Bearer <token>'