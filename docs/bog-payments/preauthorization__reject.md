# Reject Pre-Authorization

Source: https://api.bog.ge/docs/en/payments/preauthorization/reject

- Complete Pre-Aithorization
- Reject Pre-Authorization
Reject Pre-Authorization
This method allows businesses to reject pre-authorized amounts in full.
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
string
A reason for rejection.
- CURL
curl -X POST 'https://api.bog.ge/payments/v1/payment/authorization/cancel/:order_id' \-H 'Authorization: Bearer <token>' \-H 'Content-Type: application/json' \--data-raw '{"description": "string"}'
curl -X POST 'https://api.bog.ge/payments/v1/payment/authorization/cancel/:order_id' \-H 'Authorization: Bearer <token>' \-H 'Content-Type: application/json' \--data-raw '{"description": "string"}'
Response​
string
string
string
- RESPONSE
{ "key": "request_received", "message": "Pre-authorization payment cancellation request received", "action_id": "aa9478c7-f82f-45a9-8a30-e7b4275b1224"}
{ "key": "request_received", "message": "Pre-authorization payment cancellation request received", "action_id": "aa9478c7-f82f-45a9-8a30-e7b4275b1224"}