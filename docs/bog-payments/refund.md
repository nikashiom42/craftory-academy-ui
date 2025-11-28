# Refund

Source: https://api.bog.ge/docs/en/payments/refund

- Refund
Refund
This method allows businesses to refund the full or partial amount paid for an order. Full refunds are possible for payments made through card, Apple Pay, Google Pay, or BOG authorization, while partial refunds are applicable only for a card, Apple Pay and Google Pay. It is not possible to cancel a refund process once it has been initiated. Additionally, partial refund can only be called until the full amount is refunded.
Header parameters​
application/json
Basic <base64>
Bearer <jwt_token>, where jwt_token is the token returned in the access_token parameter of the authentication method response.
Bearer <jwt_token>
jwt_token
access_token
UUID v4
The Idempotency-Key parameter should be unique for each new API request. Subsequent requests to the same API endpoint with the same Idempotency-Key header will result in the server returning the same status code and response body as the initial request. This functionality is particularly useful to ensure consistent outcome in scenarios where network issues or retries may lead to duplicate requests.
Path parameters​
string
Body parameters​
number
- CURL
curl -X POST 'https://api.bog.ge/payments/v1/payment/refund/:order_id' \-H 'Authorization: Bearer <token>' \-H 'Content-Type: application/json' \--data-raw '{ "amount": "10.5"}'
curl -X POST 'https://api.bog.ge/payments/v1/payment/refund/:order_id' \-H 'Authorization: Bearer <token>' \-H 'Content-Type: application/json' \--data-raw '{ "amount": "10.5"}'
Response​
string
string
string
- RESPONSE
{ "key": "request_received", "message": "Refund request received", "action_id": "5b666901-eb05-4f83-abeb-8311e175f337"}
{ "key": "request_received", "message": "Refund request received", "action_id": "5b666901-eb05-4f83-abeb-8311e175f337"}